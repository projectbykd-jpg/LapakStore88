// Membuat halaman informasi (Tentang Kami, Pedoman Redaksi, Kebijakan Privasi) dan 404.html dengan header/footer yang sama
// dengan halaman berita statis. Jalankan ulang bila teksnya diubah: node scripts/build-pages.mjs
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { esc, footerHtml, headerHtml } from "./build-news.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://lokalstore88.online";
const LOGO = "https://i.ibb.co/N6QjSXMW/cf486a22-b7cc-4e19-9b24-1b3515f697b6.png";
const UPDATED = "12 Oktober 2026";

function page({ file, title, desc, body, bodyClass = "news-page info-page", robots = "index, follow", extraHead = "" }) {
	const url = `${SITE}/${file}`;
	return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#050b14">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="${robots}">
  ${file === "404.html" ? "" : `<link rel="canonical" href="${url}">`}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="LapakStore88">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${LOGO}">
  <link rel="icon" type="image/png" href="${LOGO}">
  <link rel="stylesheet" href="/style.css?v=20260915-brandLogo">
  <link rel="stylesheet" href="/news.css?v=3">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">${extraHead}
</head>
<body class="${bodyClass}">${headerHtml()}
  <main>
${body}
  </main>
${footerHtml()}
</body>
</html>
`;
}

const pages = [
	{
		file: "tentang.html",
		title: "Tentang Kami — LapakStore88",
		desc: "Mengenal LapakStore88: toko akun premium dan rubrik Berita Terkini yang merangkum kabar terbaru dari berbagai sumber.",
		body: `    <article class="info-card">
      <h1>Tentang Kami</h1>
      <p class="info-updated">Diperbarui ${UPDATED}</p>
      <p><b>LapakStore88</b> adalah toko daring yang menyediakan beragam akun premium dengan proses cepat dan layanan yang responsif. Katalog produk dapat dilihat di halaman <a href="/produk.html">Produk</a>, dan pengalaman pelanggan di halaman <a href="/testimoni.html">Testimoni</a>.</p>
      <h2>Rubrik Berita Terkini</h2>
      <p>Selain toko, kami mengelola rubrik <a href="/berita.html">Berita Terkini</a> yang merangkum kabar terbaru — nasional, bisnis, olahraga, teknologi, hiburan, dan lainnya — dalam bentuk ringkas supaya cepat dibaca. Setiap artikel mencantumkan media sumbernya beserta tautan ke berita aslinya. Cara kami menyusun artikel dijelaskan terbuka di <a href="/pedoman-redaksi.html">Pedoman Redaksi</a>.</p>
      <h2>Hubungi kami</h2>
      <p>Pertanyaan, koreksi berita, atau permintaan kerja sama dapat disampaikan melalui halaman <a href="/kontak.html">Kontak</a>.</p>
    </article>`,
	},
	{
		file: "pedoman-redaksi.html",
		title: "Pedoman Redaksi — LapakStore88",
		desc: "Cara rubrik Berita Terkini LapakStore88 menyusun, mencantumkan sumber, dan mengoreksi artikel.",
		body: `    <article class="info-card">
      <h1>Pedoman Redaksi</h1>
      <p class="info-updated">Diperbarui ${UPDATED}</p>
      <h2>Cara artikel disusun</h2>
      <p>Artikel di rubrik Berita Terkini adalah <b>ringkasan</b> dari berita yang sudah terbit di media lain. Penyusunannya dibantu sistem otomatis berbasis kecerdasan buatan (AI) untuk menulis ulang secara ringkas dengan bahasa yang mudah dibaca. Kami tidak melakukan liputan langsung di lapangan.</p>
      <h2>Sumber selalu dicantumkan</h2>
      <ul>
        <li>Setiap artikel menyebut nama media sumbernya dan menautkan ke berita asli.</li>
        <li>Untuk informasi lengkap dan terkini, pembaca kami arahkan ke sumber aslinya.</li>
        <li>Foto milik media sumber tetap merupakan hak pemiliknya.</li>
      </ul>
      <h2>Koreksi &amp; penghapusan</h2>
      <p>Bila menemukan kesalahan fakta, atau Anda pemilik konten yang keberatan ringkasannya dimuat, sampaikan melalui halaman <a href="/kontak.html">Kontak</a> dengan menyertakan tautan artikel. Kami akan memeriksa dan memperbaiki atau menghapusnya.</p>
      <h2>Iklan</h2>
      <p>Situs ini dapat menampilkan iklan (termasuk Google AdSense). Iklan tidak memengaruhi isi ringkasan berita.</p>
    </article>`,
	},
	{
		file: "kebijakan-privasi.html",
		title: "Kebijakan Privasi — LapakStore88",
		desc: "Kebijakan privasi LapakStore88: data yang dikumpulkan, cookie, iklan Google AdSense, dan hak pengunjung.",
		body: `    <article class="info-card">
      <h1>Kebijakan Privasi</h1>
      <p class="info-updated">Diperbarui ${UPDATED}</p>
      <p>Halaman ini menjelaskan informasi apa yang dikumpulkan saat Anda mengunjungi lokalstore88.online dan bagaimana informasi itu digunakan.</p>
      <h2>Informasi yang dikumpulkan</h2>
      <ul>
        <li><b>Data kunjungan anonim</b> — misalnya artikel yang dibuka, dipakai untuk menghitung jumlah pembaca dan menyusun daftar berita terpopuler. Data ini tidak dikaitkan dengan identitas Anda.</li>
        <li><b>Data yang Anda kirim sendiri</b> — misalnya saat menghubungi kami atau memesan produk lewat WhatsApp. Data ini hanya dipakai untuk melayani permintaan Anda.</li>
      </ul>
      <h2>Cookie &amp; iklan</h2>
      <p>Situs ini dapat menampilkan iklan dari <b>Google AdSense</b>. Google dan mitranya menggunakan cookie untuk menayangkan iklan berdasarkan kunjungan Anda ke situs ini dan situs lain. Anda dapat menonaktifkan iklan yang dipersonalisasi melalui <a href="https://adssettings.google.com" target="_blank" rel="noopener">Setelan Iklan Google</a>, atau mempelajari lebih lanjut di <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">kebijakan iklan Google</a>.</p>
      <h2>Layanan pihak ketiga</h2>
      <p>Situs ini memuat sumber daya dari pihak ketiga seperti Google Fonts, Cloudflare, dan layanan gambar. Penyedia tersebut dapat menerima alamat IP Anda saat memuat sumber daya itu, sesuai kebijakan privasi masing-masing.</p>
      <h2>Tautan ke situs lain</h2>
      <p>Artikel berita menautkan ke media sumbernya. Kami tidak bertanggung jawab atas praktik privasi situs lain.</p>
      <h2>Hubungi kami</h2>
      <p>Pertanyaan tentang kebijakan ini dapat disampaikan melalui halaman <a href="/kontak.html">Kontak</a>.</p>
    </article>`,
	},
	{
		file: "404.html",
		title: "Halaman tidak ditemukan — LapakStore88",
		desc: "Halaman yang Anda cari tidak ditemukan.",
		bodyClass: "news-page page-404",
		robots: "noindex, follow",
		// Artikel yang baru tayang mungkin belum dibuatkan halaman statisnya (generator jalan tiap 30 menit), dan artikel lama di
		// luar retensi sudah dibuang: arahkan ke tampilan dinamis /berita/artikel/?id=N supaya tautan tidak pernah buntu.
		extraHead: `
  <script>(function(){var m=location.pathname.match(/^\\/berita\\/baca\\/(\\d+)\\/?/);if(m){location.replace('/berita/artikel/?id='+m[1]);}})();</script>`,
		body: `    <div>
      <h1>404</h1>
      <p>Halaman yang Anda cari tidak ditemukan atau sudah dipindahkan.</p>
      <a class="btn-home" href="/berita.html"><i class="fa-solid fa-newspaper"></i> Ke Berita Terkini</a>
    </div>`,
	},
];

for (const p of pages) writeFileSync(join(ROOT, p.file), page(p));
console.log("Halaman dibuat:", pages.map((p) => p.file).join(", "));
