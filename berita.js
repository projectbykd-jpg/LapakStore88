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
  bola: "Bola",
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
  olahraga: "fa-person-running",
  bola: "fa-futbol",
  hiburan: "fa-clapperboard",
  teknologi: "fa-microchip",
  otomotif: "fa-car",
  kesehatan: "fa-heart-pulse",
  lifestyle: "fa-mug-hot",
};
const NEWS_CATEGORY_ORDER = ["umum", "nasional", "bisnis", "olahraga", "bola", "hiburan", "teknologi", "otomotif", "kesehatan", "lifestyle"];

function newsEsc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function newsFormatDate(iso, short) {
  if (!iso) return "";
  // Backend simpan "YYYY-MM-DD HH:MM:SS" (UTC+7, lihat TZ_OFFSET_HOURS di panel-worker).
  const d = new Date(String(iso).replace(" ", "T") + "+07:00");
  if (isNaN(d.getTime())) return "";
  if (short) return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
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
const NEWS_BRAND_LOGO = "https://i.ibb.co/7Jtv7WJs/image.png";

// Placeholder BERMEREK (bukan ikon generik yang norak) buat artikel tanpa foto --
// gradasi gelap+emas senada situs + logo LapakStore88 di tengah, supaya tetap
// enak dipandang berdampingan dengan kartu yang punya foto asli.
function newsMediaHtml(imageUrl) {
  if (imageUrl) {
    return `<img src="${newsEsc(imageUrl)}" alt="" loading="lazy" onerror="this.parentNode.innerHTML=${JSON.stringify(newsPlaceholderHtml())}">`;
  }
  return newsPlaceholderHtml();
}
function newsPlaceholderHtml() {
  return `<div class="news-media-placeholder"><img src="${NEWS_BRAND_LOGO}" alt="LapakStore88" loading="lazy"></div>`;
}

async function newsFetchList(opts) {
  opts = opts || {};
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  params.set("page", String(opts.page || 1));
  params.set("pageSize", String(opts.pageSize || NEWS_PAGE_SIZE));
  try {
    const res = await fetch(`${NEWS_API_BASE}/public/news?${params.toString()}`);
    return await res.json();
  } catch (e) {
    return { success: false, articles: [], total: 0 };
  }
}

async function newsFetchDetail(id) {
  const res = await fetch(`${NEWS_API_BASE}/public/news?id=${encodeURIComponent(id)}`);
  return res.json();
}

async function newsFetchBanner() {
  try {
    const res = await fetch(`${NEWS_API_BASE}/public/news?banner=1`);
    return await res.json();
  } catch (e) {
    return { success: false, banner: null };
  }
}

async function newsFetchRandom(category, limit) {
  try {
    const params = new URLSearchParams({ random: "1", limit: String(limit || 6) });
    if (category) params.set("category", category);
    const res = await fetch(`${NEWS_API_BASE}/public/news?${params.toString()}`);
    return await res.json();
  } catch (e) {
    return { success: false, articles: [] };
  }
}

// `depth` = berapa level folder halaman ini dari root ("" di root/berita.html;
// "../../" di /berita/<kategori>/ MAUPUN /berita/artikel/ -- keduanya SAMA
// dalamnya, 2 folder dari root) -- dipakai supaya satu fungsi render kartu
// bisa dipakai ulang di landing, kategori, & sidebar artikel tanpa link-nya
// salah folder (dulu ke-tulis "../" doang utk kategori -> hasilnya
// /berita/berita/artikel/, dobel "berita").
function newsArticleUrl(depth, id) {
  return `${depth}berita/artikel/?id=${id}`;
}
function newsCategoryUrl(depth, cat) {
  return `${depth}berita/${encodeURIComponent(cat || "umum")}/`;
}

// Kartu gaya "list situs berita profesional": thumbnail kecil di kiri,
// judul+ringkasan+meta di kanan, satu baris penuh (bukan kotak grid).
function newsRowCardHtml(a, depth) {
  return `
    <article class="news-row">
      <a href="${newsArticleUrl(depth, a.id)}" class="news-row-media">
        ${newsMediaHtml(a.image_url)}
      </a>
      <div class="news-row-body">
        <a href="${newsCategoryUrl(depth, a.category)}" class="news-row-category">${newsEsc(newsCategoryLabel(a.category))}</a>
        <a href="${newsArticleUrl(depth, a.id)}" class="news-row-title">${newsEsc(a.title)}</a>
        <p class="news-row-excerpt">${newsEsc(newsExcerpt(a.excerpt, 130))}</p>
        <div class="news-row-meta"><span><i class="fa-solid fa-signature"></i> ${newsEsc(a.source)}</span><span><i class="fa-regular fa-clock"></i> ${newsEsc(newsFormatDate(a.posted_at))}</span></div>
      </div>
    </article>`;
}

// Kartu carousel/related: potret, ringkas, buat dipakai berjejer.
function newsMiniCardHtml(a, depth) {
  return `
    <article class="news-mini-card">
      <a href="${newsArticleUrl(depth, a.id)}" class="news-mini-media">
        ${newsMediaHtml(a.image_url)}
        <span class="news-mini-category">${newsEsc(newsCategoryLabel(a.category))}</span>
      </a>
      <a href="${newsArticleUrl(depth, a.id)}" class="news-mini-title">${newsEsc(a.title)}</a>
      <span class="news-mini-date"><i class="fa-regular fa-clock"></i> ${newsEsc(newsFormatDate(a.posted_at, true))}</span>
    </article>`;
}

function newsSkeletonHtml(n) {
  return `<div class="novel-loading-card"><i class="fa-solid fa-spinner fa-spin"></i><span>Memuat berita...</span></div>`;
}

// ---------------------------------------------------------------------------
// Landing (berita.html): carousel "Terbaru" + baris per kategori (kategori
// kosong otomatis dilewati, jadi tidak ada seksi kosong yang kelihatan jelek).
// ---------------------------------------------------------------------------
async function newsInitLanding() {
  const track = document.getElementById("newsCarouselTrack");
  if (track) {
    const data = await newsFetchList({ page: 1, pageSize: 10 });
    if (data.success && data.articles.length) {
      track.innerHTML = data.articles.map((a) => newsMiniCardHtml(a, "")).join("");
      newsInitCarouselControls();
    } else {
      const wrap = document.getElementById("newsCarouselWrap");
      if (wrap) wrap.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-newspaper"></i><h3>Belum ada berita</h3><p>Artikel terbaru akan muncul di sini begitu tersedia.</p></div>`;
    }
  }

  const sectionsHost = document.getElementById("newsCategorySections");
  if (!sectionsHost) return;
  sectionsHost.innerHTML = "";
  for (const cat of NEWS_CATEGORY_ORDER) {
    const data = await newsFetchList({ category: cat, page: 1, pageSize: 4 });
    if (!data.success || !data.articles.length) continue; // lewati kategori yang masih kosong
    const section = document.createElement("section");
    section.className = "news-home-section";
    section.innerHTML = `
      <div class="news-home-section-head">
        <h2><i class="fa-solid ${newsCategoryIcon(cat)}"></i> ${newsEsc(newsCategoryLabel(cat))}</h2>
        <a href="${newsCategoryUrl("", cat)}" class="news-see-all">Lihat Semua <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      <div class="grid-news-mini">${data.articles.map((a) => newsMiniCardHtml(a, "")).join("")}</div>`;
    sectionsHost.appendChild(section);
  }
  if (!sectionsHost.children.length) {
    sectionsHost.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-inbox"></i><h3>Belum ada berita per kategori</h3><p>Tambahkan sumber berita per kategori di Panel BOT supaya bagian ini terisi.</p></div>`;
  }
}

function newsInitCarouselControls() {
  const track = document.getElementById("newsCarouselTrack");
  const prev = document.getElementById("newsCarouselPrev");
  const next = document.getElementById("newsCarouselNext");
  if (!track) return;
  const scrollByCard = (dir) => {
    const card = track.querySelector(".news-mini-card");
    const step = card ? card.getBoundingClientRect().width + 14 : 260;
    track.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };
  if (prev) prev.addEventListener("click", () => scrollByCard(-1));
  if (next) next.addEventListener("click", () => scrollByCard(1));
}

// ---------------------------------------------------------------------------
// Halaman kategori (berita/<kategori>/index.html)
// ---------------------------------------------------------------------------
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
        grid.insertAdjacentHTML("beforeend", data.articles.map((a) => newsRowCardHtml(a, "../../")).join(""));
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
  newsInitSidebar("../../", category);
}

// ---------------------------------------------------------------------------
// Halaman artikel (berita/artikel/index.html)
// ---------------------------------------------------------------------------
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
    const catUrl = newsCategoryUrl("../../", a.category);
    box.innerHTML = `
      <div class="news-article-eyebrow"><a href="${catUrl}" class="news-article-cat"><i class="fa-solid ${newsCategoryIcon(a.category)}"></i> ${newsEsc(newsCategoryLabel(a.category))}</a><span><i class="fa-regular fa-clock"></i> ${newsEsc(newsFormatDate(a.posted_at))}</span></div>
      <h1 class="news-article-title">${newsEsc(a.title)}</h1>
      <div class="news-article-source"><i class="fa-solid fa-signature"></i> Sumber: ${newsEsc(a.source)}</div>
      <div class="news-article-body">${a.rewritten_html || ""}</div>`;

    newsInitSidebar("../../", a.category);
    newsInitRelated("../../", a.category, Number(a.id));
  } catch (e) {
    box.innerHTML = `<div class="news-empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>Gagal memuat artikel</h3><p>Coba muat ulang halaman beberapa saat lagi.</p></div>`;
  }
}

// "Berita Lainnya" di akhir halaman artikel -- kategori sama, artikel ini dikecualikan.
async function newsInitRelated(depth, category, excludeId) {
  const host = document.getElementById("newsRelated");
  if (!host) return;
  const data = await newsFetchList({ category, page: 1, pageSize: 5 });
  const list = (data.success ? data.articles : []).filter((a) => Number(a.id) !== excludeId).slice(0, 4);
  if (!list.length) {
    host.closest(".news-related-section")?.remove();
    return;
  }
  host.innerHTML = list.map((a) => newsMiniCardHtml(a, depth)).join("");
}

// Sidebar (banner + berita lainnya + arsip acak per kategori) -- dipakai di
// halaman kategori & artikel.
async function newsInitSidebar(depth, category) {
  const host = document.getElementById("newsSidebar");
  if (!host) return;

  const [bannerData, latestData, randomData] = await Promise.all([
    newsFetchBanner(),
    newsFetchList({ page: 1, pageSize: 5 }),
    newsFetchRandom(category, 6),
  ]);

  let html = "";

  if (bannerData.success && bannerData.banner) {
    const b = bannerData.banner;
    html += `
      <a class="news-sidebar-banner" href="${newsEsc(b.url || "#")}" target="_blank" rel="noopener">
        <img src="${newsEsc(b.image)}" alt="${newsEsc(b.text || "Promo")}" loading="lazy">
        ${b.text ? `<span>${newsEsc(b.text)}</span>` : ""}
      </a>`;
  }

  const latest = latestData.success ? latestData.articles : [];
  if (latest.length) {
    html += `
      <div class="news-sidebar-box">
        <div class="news-sidebar-title"><i class="fa-solid fa-fire-flame-curved"></i> Berita Lainnya</div>
        <div class="news-sidebar-list">
          ${latest
            .map(
              (a, i) => `
            <a href="${newsArticleUrl(depth, a.id)}" class="news-sidebar-item">
              <span class="news-sidebar-num">${i + 1}</span>
              <span class="news-sidebar-item-title">${newsEsc(a.title)}</span>
            </a>`,
            )
            .join("")}
        </div>
      </div>`;
  }

  const archive = randomData.success ? randomData.articles : [];
  if (archive.length) {
    html += `
      <div class="news-sidebar-box">
        <div class="news-sidebar-title"><i class="fa-solid fa-box-archive"></i> Arsip ${newsEsc(newsCategoryLabel(category))}</div>
        <div class="news-sidebar-archive">
          ${archive
            .map(
              (a) => `
            <a href="${newsArticleUrl(depth, a.id)}" class="news-sidebar-archive-item">
              ${newsMediaHtml(a.image_url)}
              <span>${newsEsc(a.title)}</span>
            </a>`,
            )
            .join("")}
        </div>
      </div>`;
  }

  host.innerHTML = html || `<div class="news-sidebar-box"><div class="news-sidebar-title"><i class="fa-solid fa-box-archive"></i> Arsip</div><p class="news-sidebar-empty">Belum ada artikel lain.</p></div>`;
}
