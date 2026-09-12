// Berita Terkini — portal berita LapakStore88.
// Terpisah dari script.js (yang urusannya produk/novel via Google Apps Script)
// karena sumber datanya beda: artikel berita diambil dari endpoint publik
// panel-worker (Cloudflare Worker), bukan dari SPREADSHEET_URL.
const NEWS_API_BASE = "https://panel-worker.projectbykd.workers.dev";
const NEWS_PAGE_SIZE = 12;

const NEWS_CATEGORY_LABELS = {
  umum: "Umum",
  nasional: "Nasional",
  bisnis: "Bisnis",
  olahraga: "Olahraga",
  hiburan: "Hiburan",
  teknologi: "Teknologi",
  otomotif: "Otomotif",
  kesehatan: "Kesehatan",
  lifestyle: "Lifestyle",
};
const NEWS_CATEGORY_ICONS = {
  umum: "fa-newspaper",
  nasional: "fa-flag",
  bisnis: "fa-chart-line",
  olahraga: "fa-futbol",
  hiburan: "fa-clapperboard",
  teknologi: "fa-microchip",
  otomotif: "fa-car",
  kesehatan: "fa-heart-pulse",
  lifestyle: "fa-mug-hot",
};

function newsEsc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function newsFormatDate(iso) {
  if (!iso) return "";
  // Backend simpan "YYYY-MM-DD HH:MM:SS" (UTC+7, lihat TZ_OFFSET_HOURS di panel-worker).
  const d = new Date(String(iso).replace(" ", "T") + "+07:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " WIB";
}

function newsExcerpt(s, max) {
  const t = String(s || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function newsCategoryLabel(cat) {
  return NEWS_CATEGORY_LABELS[cat] || NEWS_CATEGORY_LABELS.umum;
}
function newsCategoryIcon(cat) {
  return NEWS_CATEGORY_ICONS[cat] || NEWS_CATEGORY_ICONS.umum;
}

async function newsFetchList(opts) {
  opts = opts || {};
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  params.set("page", String(opts.page || 1));
  params.set("pageSize", String(opts.pageSize || NEWS_PAGE_SIZE));
  const res = await fetch(`${NEWS_API_BASE}/public/news?${params.toString()}`);
  return res.json();
}

async function newsFetchDetail(id) {
  const res = await fetch(`${NEWS_API_BASE}/public/news?id=${encodeURIComponent(id)}`);
  return res.json();
}

function newsCardHtml(a) {
  const img = a.image_url || "https://img.icons8.com/fluency/512/news.png";
  return `
    <article class="news-card">
      <a href="../artikel/?id=${a.id}" class="news-card-media">
        <img src="${newsEsc(img)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='https://img.icons8.com/fluency/512/news.png'">
        <span class="news-card-category">${newsEsc(newsCategoryLabel(a.category))}</span>
      </a>
      <div class="news-card-body">
        <a href="../artikel/?id=${a.id}" class="news-card-title">${newsEsc(a.title)}</a>
        <p class="news-card-excerpt">${newsEsc(newsExcerpt(a.excerpt, 110))}</p>
        <div class="news-card-meta"><span><i class="fa-solid fa-signature"></i> ${newsEsc(a.source)}</span><span><i class="fa-regular fa-clock"></i> ${newsEsc(newsFormatDate(a.posted_at))}</span></div>
      </div>
    </article>`;
}

// Landing (berita.html) dipanggil dari root, kartu berlink ke artikel/ dan
// <kategori>/ yang keduanya SATU LEVEL di bawah root -- jadi butuh varian link
// tanpa prefix "../".
function newsCardHtmlFromRoot(a) {
  return newsCardHtml(a).replace(/\.\.\/artikel\//g, "berita/artikel/");
}

async function newsInitLanding() {
  const grid = document.getElementById("newsLandingGrid");
  if (!grid) return;
  try {
    const data = await newsFetchList({ page: 1, pageSize: 12 });
    if (!data.success || !data.articles.length) {
      grid.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-newspaper"></i><h3>Belum ada berita</h3><p>Artikel terbaru akan muncul di sini begitu tersedia.</p></div>`;
      return;
    }
    grid.innerHTML = data.articles.map(newsCardHtmlFromRoot).join("");
  } catch (e) {
    grid.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>Gagal memuat berita</h3><p>Coba muat ulang halaman beberapa saat lagi.</p></div>`;
  }
}

async function newsInitCategoryPage(category) {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;
  const loadMoreBtn = document.getElementById("newsLoadMore");
  let page = 1;
  let total = 0;
  let loaded = 0;

  async function loadPage(append) {
    if (loadMoreBtn) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memuat...';
    }
    try {
      const data = await newsFetchList({ category, page, pageSize: NEWS_PAGE_SIZE });
      if (!data.success) throw new Error(data.message || "Gagal memuat");
      total = data.total || 0;
      if (!append) grid.innerHTML = "";
      if (!data.articles.length && page === 1) {
        grid.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-inbox"></i><h3>Belum ada berita di kategori ini</h3><p>Coba cek kategori lain atau kembali lagi nanti.</p></div>`;
      } else {
        grid.insertAdjacentHTML("beforeend", data.articles.map(newsCardHtml).join(""));
        loaded += data.articles.length;
      }
    } catch (e) {
      if (page === 1) grid.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>Gagal memuat berita</h3><p>Coba muat ulang halaman beberapa saat lagi.</p></div>`;
    } finally {
      if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = 'Muat Lebih Banyak <i class="fa-solid fa-chevron-down"></i>';
        loadMoreBtn.style.display = loaded < total ? "" : "none";
      }
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      page++;
      loadPage(true);
    });
  }
  loadPage(false);
}

async function newsInitArticlePage() {
  const box = document.getElementById("newsArticleBox");
  if (!box) return;
  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    box.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-circle-question"></i><h3>Artikel tidak ditemukan</h3><p>Link tidak lengkap. <a href="../../berita.html">Kembali ke Berita Terkini</a></p></div>`;
    return;
  }
  try {
    const data = await newsFetchDetail(id);
    if (!data.success || !data.article) {
      box.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-circle-question"></i><h3>Artikel tidak ditemukan</h3><p>Mungkin sudah dihapus. <a href="../../berita.html">Kembali ke Berita Terkini</a></p></div>`;
      return;
    }
    const a = data.article;
    document.title = a.title + " — LapakStore88";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", newsExcerpt(a.title, 155));
    const catUrl = `../../berita/${encodeURIComponent(a.category || "umum")}/`;
    box.innerHTML = `
      <div class="news-article-eyebrow"><a href="${catUrl}" class="news-article-cat"><i class="fa-solid ${newsCategoryIcon(a.category)}"></i> ${newsEsc(newsCategoryLabel(a.category))}</a><span><i class="fa-regular fa-clock"></i> ${newsEsc(newsFormatDate(a.posted_at))}</span></div>
      <h1 class="news-article-title">${newsEsc(a.title)}</h1>
      <div class="news-article-source"><i class="fa-solid fa-signature"></i> Sumber: ${newsEsc(a.source)}</div>
      <div class="news-article-body">${a.rewritten_html || ""}</div>
      <div class="news-article-footer"><a href="${catUrl}" class="page-button page-button-soft"><i class="fa-solid fa-arrow-left"></i> Berita ${newsEsc(newsCategoryLabel(a.category))} Lainnya</a></div>`;
  } catch (e) {
    box.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>Gagal memuat artikel</h3><p>Coba muat ulang halaman beberapa saat lagi.</p></div>`;
  }
}
