// Generator halaman STATIS "Berita Terkini" (dijalankan GitHub Action tiap 30 menit).
//
// Kenapa: halaman artikel lama (/berita/artikel/?id=N) cuma satu file HTML yang isinya baru diisi JavaScript. Akibatnya
// pratinjau saat dibagikan (WhatsApp/Facebook/Telegram) selalu "Berita — LapakStore88" + logo, dan Google harus menjalankan
// JS dulu untuk melihat isinya. Di sini tiap artikel dibuatkan file sendiri (/berita/baca/<id>/) yang judul, deskripsi,
// gambar, isi, dan JSON-LD-nya SUDAH tertulis di HTML. Isi artikel tidak diubah -- hanya disajikan statis.
//
// Sumber data: endpoint publik panel-worker /public/news-export (tanpa menaikkan views).
// Tanpa dependensi npm (Node 20+: fetch bawaan).
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.env.NEWS_SITE_URL || "https://lokalstore88.online").replace(/\/+$/, "");
const API = (process.env.NEWS_API_BASE || "https://panel-worker.projectbykd.workers.dev").replace(/\/+$/, "");
const KEEP = Math.max(50, Number(process.env.NEWS_KEEP || 2000)); // jumlah artikel terbaru yang dibuatkan halaman statis
const PAGE_SIZE = 50;
const BRAND = "LapakStore88";
const LOGO = "https://i.ibb.co/N6QjSXMW/cf486a22-b7cc-4e19-9b24-1b3515f697b6.png";
const ADSENSE = "ca-pub-8487277933401565";
const CATS = {
	umum: ["Umum", "fa-newspaper"],
	nasional: ["Nasional", "fa-flag"],
	bisnis: ["Bisnis", "fa-chart-line"],
	olahraga: ["Olahraga", "fa-person-running"],
	bola: ["Bola", "fa-futbol"],
	hiburan: ["Hiburan", "fa-clapperboard"],
	teknologi: ["Teknologi", "fa-microchip"],
	otomotif: ["Otomotif", "fa-car"],
	kesehatan: ["Kesehatan", "fa-heart-pulse"],
	lifestyle: ["Lifestyle", "fa-mug-hot"],
	selebritis: ["Selebritis", "fa-crown"],
};
const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const catOf = (c) => (CATS[c] ? c : "umum");
export const staticPath = (id) => `/berita/baca/${id}/`;
const isoWib = (ts) => (ts ? String(ts).replace(" ", "T") + "+07:00" : "");
function tanggal(ts) {
	const m = String(ts || "").match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
	return m ? `${Number(m[3])} ${BULAN[Number(m[2]) - 1]} ${m[1]}, ${m[4]}:${m[5]} WIB` : "";
}
const plain = (html) => String(html || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
function cut(s, n) {
	const t = String(s || "").trim();
	return t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

/** Isi artikel apa adanya, kecuali: <script> dibuang (JSON-LD dibuat ulang di <head>) dan foto yang dulu dibungkus tautan ke
 *  toko sendiri dibuka bungkusnya (pembaca yang mengklik foto tidak dilempar keluar artikel). Teks tidak diubah. */
export function cleanBody(html) {
	let h = String(html || "").replace(/<script[\s\S]*?<\/script>/gi, "");
	h = h.replace(/<a\b[^>]*href=["'][^"']*(lokalstore88\.online|lapakstore88)[^"']*["'][^>]*>\s*(<img\b[^>]*>)\s*<\/a>/gi, "$2");
	// gambar di bawah lipatan dimuat belakangan (lebih ringan di HP)
	let first = true;
	h = h.replace(/<img\b(?![^>]*\bloading=)/gi, (m) => {
		if (first) {
			first = false;
			return m;
		}
		return m + ' loading="lazy"';
	});
	return h;
}

function readingMinutes(html) {
	const words = plain(html).split(" ").filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}

function headCommon() {
	return `
  <link rel="icon" type="image/png" href="${LOGO}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="/style.css?v=20260915-brandLogo">
  <link rel="stylesheet" href="/news.css?v=3">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <meta name="google-adsense-account" content="${ADSENSE}">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>`;
}

export function headerHtml() {
	return `
  <header class="header">
    <div class="container">
      <a class="logo-area" href="/" aria-label="${BRAND} Home">
        <img src="${LOGO}" class="nav-logo" alt="Logo ${BRAND}">
        <div class="logo lapak-brand"><span class="lapak-brand-row"><span class="brand-lapak">Lapak</span><span class="brand-store88">Store88</span></span><span class="lapak-brand-tagline">Akun Premium Terpercaya</span></div>
      </a>
      <input type="checkbox" id="menu-bar">
      <label for="menu-bar" class="menu-icon" aria-label="Buka menu navigasi"><span></span><span></span><span></span></label>
      <nav class="navbar" aria-label="Navigasi utama">
        <a href="/"><i class="fa-solid fa-house"></i> Home</a>
        <a href="/produk.html"><i class="fa-solid fa-gem"></i> Produk</a>
        <a href="/berita.html" class="active" aria-current="page"><i class="fa-solid fa-newspaper"></i> Berita Terkini</a>
        <a href="/joywen.html"><i class="fa-solid fa-handshake"></i> JoyWen Store</a>
        <a href="/testimoni.html"><i class="fa-solid fa-star"></i> Testimoni</a>
        <a href="/kontak.html"><i class="fa-solid fa-wallet"></i> Pembayaran</a>
      </nav>
    </div>
  </header>`;
}

function catNav(active) {
	return `
  <nav class="news-category-nav" aria-label="Kategori berita">
    <div class="news-category-nav-shell">
${Object.entries(CATS)
	.map(([k, [label, icon]]) => `      <a href="/berita/${k}/" class="news-category-chip${k === active ? " active" : ""}"><i class="fa-solid ${icon}"></i> ${label}</a>`)
	.join("\n")}
    </div>
  </nav>`;
}

export function footerHtml() {
	return `
  <footer class="footer news-footer">
    <div class="news-footer-links"><a href="/tentang.html">Tentang Kami</a><a href="/pedoman-redaksi.html">Pedoman Redaksi</a><a href="/kebijakan-privasi.html">Kebijakan Privasi</a><a href="/kontak.html">Kontak</a></div>
    <p>&copy; 2026 <span>${BRAND}</span>. Semua hak dilindungi.</p>
  </footer>`;
}

function relatedCard(a) {
	const [label] = CATS[catOf(a.category)];
	const img = a.image_url
		? `<img src="${esc(a.image_url)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('is-empty');this.remove()">`
		: "";
	return `
        <article class="news-mini-card">
          <a href="${staticPath(a.id)}" class="news-mini-media${img ? "" : " is-empty"}">${img}<span class="news-mini-category">${esc(label)}</span></a>
          <a href="${staticPath(a.id)}" class="news-mini-title">${esc(a.title)}</a>
          <span class="news-mini-date"><i class="fa-regular fa-clock"></i> ${esc(tanggal(a.posted_at))}</span>
        </article>`;
}

export function articlePage(a, related, prevNext) {
	const cat = catOf(a.category);
	const [catLabel, catIcon] = CATS[cat];
	const url = SITE + staticPath(a.id);
	const desc = cut(a.meta_description || a.excerpt || plain(a.rewritten_html), 160);
	const title = `${a.title} — ${BRAND}`;
	const image = a.image_url || LOGO;
	const body = cleanBody(a.rewritten_html);
	const ld = {
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		headline: String(a.title).slice(0, 110),
		description: desc,
		image: [image],
		datePublished: isoWib(a.posted_at),
		dateModified: isoWib(a.posted_at),
		articleSection: catLabel,
		inLanguage: "id-ID",
		keywords: a.keywords || undefined,
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		author: { "@type": "Organization", name: `Redaksi ${BRAND}`, url: SITE + "/tentang.html" },
		publisher: { "@type": "Organization", name: BRAND, logo: { "@type": "ImageObject", url: LOGO } },
		isBasedOn: a.url || undefined,
	};
	const crumbs = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Berita Terkini", item: SITE + "/berita.html" },
			{ "@type": "ListItem", position: 2, name: catLabel, item: `${SITE}/berita/${cat}/` },
			{ "@type": "ListItem", position: 3, name: String(a.title).slice(0, 110), item: url },
		],
	};
	const ldJson = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
	const shareText = encodeURIComponent(`${a.title} ${url}`);
	const nav = prevNext
		.map((x) =>
			x
				? `<a class="news-pn-item ${x.dir}" href="${staticPath(x.a.id)}"><span>${x.dir === "prev" ? '<i class="fa-solid fa-arrow-left"></i> Sebelumnya' : 'Berikutnya <i class="fa-solid fa-arrow-right"></i>'}</span><b>${esc(x.a.title)}</b></a>`
				: "<span></span>",
		)
		.join("");
	return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#050b14">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${esc(url)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:locale" content="id_ID">
  <meta property="og:title" content="${esc(a.title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="article:published_time" content="${esc(isoWib(a.posted_at))}">
  <meta property="article:section" content="${esc(catLabel)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(a.title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${esc(image)}">
  <script type="application/ld+json">${ldJson(ld)}</script>
  <script type="application/ld+json">${ldJson(crumbs)}</script>${headCommon()}
</head>
<body class="news-page news-static">
  <div class="news-progress" aria-hidden="true"><span id="newsProgress"></span></div>${headerHtml()}${catNav(cat)}

  <main>
    <div class="news-container news-breadcrumb-bar">
      <nav class="news-breadcrumb" aria-label="Breadcrumb"><a href="/berita.html">Berita Terkini</a><i class="fa-solid fa-chevron-right"></i><a href="/berita/${cat}/">${esc(catLabel)}</a></nav>
    </div>

    <div class="news-container news-layout">
      <section class="news-list-col">
        <article id="newsArticleBox" class="news-article-box" data-id="${a.id}" data-category="${cat}">
          <div class="news-article-eyebrow"><a href="/berita/${cat}/" class="news-article-cat"><i class="fa-solid ${catIcon}"></i> ${esc(catLabel)}</a><span><i class="fa-regular fa-clock"></i> <time datetime="${esc(isoWib(a.posted_at))}">${esc(tanggal(a.posted_at))}</time></span><span><i class="fa-regular fa-hourglass-half"></i> ${readingMinutes(a.rewritten_html)} menit baca</span></div>
          <h1 class="news-article-title">${esc(a.title)}</h1>
          <div class="news-article-byline">
            <span class="news-article-source"><i class="fa-solid fa-pen-nib"></i> Redaksi ${BRAND} · diolah dari <b>${esc(a.source || "berbagai sumber")}</b></span>
            <span class="news-share">
              <a href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener" aria-label="Bagikan ke WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" aria-label="Bagikan ke Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(a.title)}" target="_blank" rel="noopener" aria-label="Bagikan ke Telegram"><i class="fa-brands fa-telegram"></i></a>
              <button type="button" class="news-copy-link" data-url="${esc(url)}" aria-label="Salin tautan"><i class="fa-solid fa-link"></i></button>
            </span>
          </div>
          <div class="news-article-body">${body}</div>
          ${a.url ? `<p class="news-article-origin">Sumber asli: <a href="${esc(a.url)}" target="_blank" rel="noopener nofollow">${esc(a.source || a.url)}</a></p>` : ""}
          <nav class="news-prevnext" aria-label="Artikel lain">${nav}</nav>
        </article>

        ${
					related.length
						? `<section class="news-related-section">
          <div class="news-home-section-head"><h2><i class="fa-solid fa-layer-group"></i> Berita ${esc(catLabel)} Lainnya</h2><a href="/berita/${cat}/" class="news-see-all">Lihat Semua <i class="fa-solid fa-arrow-right"></i></a></div>
          <div class="grid-news-mini">${related.map(relatedCard).join("")}
          </div>
        </section>`
						: ""
				}
      </section>
      <aside id="newsSidebar" class="news-sidebar-col" aria-label="Info tambahan"></aside>
    </div>
  </main>
${footerHtml()}
  <script src="/berita.js?v=5"></script>
  <script>document.addEventListener('DOMContentLoaded', function () { newsInitStaticArticle(${a.id}, ${JSON.stringify(cat)}); });</script>
</body>
</html>
`;
}

/** Daftar statis (indeks) yang disisipkan di antara penanda di halaman daftar -- supaya mesin pencari menemukan tautan artikel
 *  tanpa menjalankan JavaScript. Tampilan dinamis (JS) tetap seperti biasa di atasnya. */
export function indexList(list, heading) {
	return `<!-- STATIC-INDEX:START -->
    <section class="news-container news-static-index" aria-label="${esc(heading)}">
      <div class="news-home-section-head"><h2><i class="fa-solid fa-list"></i> ${esc(heading)}</h2></div>
      <ol class="news-index-list">
${list.map((a) => `        <li><a href="${staticPath(a.id)}">${esc(a.title)}</a><time datetime="${esc(isoWib(a.posted_at))}">${esc(tanggal(a.posted_at))}</time></li>`).join("\n")}
      </ol>
    </section>
    <!-- STATIC-INDEX:END -->`;
}
export function injectIndex(html, block) {
	const re = /<!-- STATIC-INDEX:START -->[\s\S]*?<!-- STATIC-INDEX:END -->/;
	if (re.test(html)) return html.replace(re, block);
	return html.replace(/(\s*)<\/main>/, `\n    ${block}$1</main>`);
}

export function sitemapXml(list) {
	const urls = list
		.map((a) => `<url><loc>${esc(SITE + staticPath(a.id))}</loc><lastmod>${esc(isoWib(a.posted_at))}</lastmod></url>`)
		.join("");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`;
}

async function fetchAll() {
	const out = [];
	for (let page = 1; out.length < KEEP; page++) {
		let data = null;
		for (let attempt = 1; attempt <= 3 && !data; attempt++) {
			try {
				const r = await fetch(`${API}/public/news-export?page=${page}&pageSize=${PAGE_SIZE}`);
				if (!r.ok) throw new Error("HTTP " + r.status);
				data = await r.json();
			} catch (e) {
				if (attempt === 3) throw new Error(`Gagal mengambil halaman ${page}: ${e.message}`);
				await new Promise((res) => setTimeout(res, 2000 * attempt));
			}
		}
		if (!data.success) throw new Error("Endpoint menolak: " + (data.message || "?"));
		const arts = (data.articles || []).filter((a) => Number.isInteger(Number(a.id)) && Number(a.id) > 0 && a.title);
		out.push(...arts);
		if (arts.length < PAGE_SIZE) break;
	}
	return out.slice(0, KEEP);
}

function writeIfChanged(path, content) {
	if (existsSync(path) && readFileSync(path, "utf8") === content) return false;
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content);
	return true;
}

/** Ambil JSON endpoint publik (batas waktu 25 dtk) + catat kesehatannya di log workflow. Tidak pernah melempar galat. */
async function getPublic(q) {
	const t = Date.now();
	try {
		const ctl = new AbortController();
		const timer = setTimeout(() => ctl.abort(), 25000);
		const r = await fetch(`${API}/public/news?${q}`, { signal: ctl.signal, headers: { origin: SITE } });
		const txt = await r.text();
		clearTimeout(timer);
		console.log(`[cek] /public/news?${q} -> HTTP ${r.status} ${Date.now() - t} ms, cors=${r.headers.get("access-control-allow-origin")}`);
		return r.ok ? JSON.parse(txt) : null;
	} catch (e) {
		console.log(`[cek] /public/news?${q} -> GAGAL setelah ${Date.now() - t} ms: ${e.name === "AbortError" ? "tidak menjawab 25 dtk" : e.message}`);
		return null;
	}
}

const SNAP_PER_LIST = 12;
const snapItem = (a) => ({
	id: Number(a.id),
	title: String(a.title || ""),
	excerpt: cut(a.excerpt || plain(a.rewritten_html), 180),
	image_url: String(a.image_url || ""),
	category: catOf(a.category),
	source: String(a.source || ""),
	posted_at: String(a.posted_at || ""),
});

/** Cadangan data untuk halaman (berita/data/home.json, satu domain dengan situs): dipakai berita.js bila API panel di
 *  workers.dev tidak terjangkau dari jaringan pembaca (sebagian ISP memblokir/menggantung domain *.workers.dev). Tanpa
 *  stempel waktu supaya file hanya berubah bila isinya berubah. */
export function snapshotJson(arts, popular, banner) {
	const categories = {};
	for (const a of arts) {
		const c = catOf(a.category);
		const list = (categories[c] ||= []);
		if (list.length < SNAP_PER_LIST) list.push(snapItem(a));
	}
	const pop = Array.isArray(popular) && popular.length ? popular : arts.slice(0, 5);
	const b = banner && banner.image ? { image: String(banner.image), url: String(banner.url || ""), text: String(banner.text || "") } : null;
	return JSON.stringify({ latest: arts.slice(0, SNAP_PER_LIST).map(snapItem), categories, popular: pop.slice(0, 8).map(snapItem), banner: b });
}

export async function main() {
	const [, bannerData, popularData] = await Promise.all([getPublic("page=1&pageSize=6"), getPublic("banner=1"), getPublic("popular=1&limit=8")]);
	const arts = await fetchAll();
	if (!arts.length) {
		console.log("Tidak ada artikel dari endpoint -- tidak mengubah apa pun (jaga-jaga endpoint bermasalah).");
		return { written: 0, removed: 0, total: 0 };
	}
	const byCat = new Map();
	for (const a of arts) {
		const c = catOf(a.category);
		(byCat.get(c) ?? byCat.set(c, []).get(c)).push(a);
	}
	let written = 0;
	const keep = new Set();
	for (const a of arts) {
		const id = String(Number(a.id));
		keep.add(id);
		const sameCat = byCat.get(catOf(a.category));
		const idx = sameCat.indexOf(a);
		const related = sameCat.filter((x) => x !== a).slice(0, 4);
		// "sebelumnya" = artikel lebih lama di kategori sama, "berikutnya" = lebih baru
		const prevNext = [sameCat[idx + 1] ? { dir: "prev", a: sameCat[idx + 1] } : null, idx > 0 ? { dir: "next", a: sameCat[idx - 1] } : null];
		if (writeIfChanged(join(ROOT, "berita", "baca", id, "index.html"), articlePage(a, related, prevNext))) written++;
	}
	// artikel di luar KEEP dibuang (halaman 404 mengarahkan ke tampilan dinamis lama, jadi tautan lama tetap terbuka)
	let removed = 0;
	const base = join(ROOT, "berita", "baca");
	if (existsSync(base)) {
		for (const d of readdirSync(base)) {
			if (/^\d+$/.test(d) && !keep.has(d)) {
				rmSync(join(base, d), { recursive: true, force: true });
				removed++;
			}
		}
	}
	writeIfChanged(join(ROOT, "sitemap-news.xml"), sitemapXml(arts));
	writeIfChanged(join(ROOT, "berita", "data", "home.json"), snapshotJson(arts, popularData?.articles, bannerData?.banner));
	// indeks statis di halaman daftar
	const landing = join(ROOT, "berita.html");
	writeIfChanged(landing, injectIndex(readFileSync(landing, "utf8"), indexList(arts.slice(0, 40), "Indeks Berita Terbaru")));
	for (const c of Object.keys(CATS)) {
		const p = join(ROOT, "berita", c, "index.html");
		if (!existsSync(p)) continue;
		const list = (byCat.get(c) || []).slice(0, 30);
		if (!list.length) continue;
		writeIfChanged(p, injectIndex(readFileSync(p, "utf8"), indexList(list, `Indeks ${CATS[c][0]}`)));
	}
	console.log(`Artikel: ${arts.length} | halaman ditulis/diperbarui: ${written} | dibuang: ${removed}`);
	return { written, removed, total: arts.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((e) => {
		console.error(e.message || e);
		process.exit(1);
	});
}
