// Central app script (refactored)
// - Safer rendering, semantic product cards, keyboard support, modal focus management

// Configuration
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbyEfspTml7o-X_TzU75UlFxnaIA1dvgjtV5r90dGk4U0Vmd3nTnVrW3WRq2uKLk-0ue8Q/exec";
const WHATSAPP_NUMBER = "6285180572575";

let productsData = [];
let novelsData = [];
let currentProduct = null;
let lastActiveElement = null;
let currentFontSize = 18; // default reader font size
let currentNovel = null;
let currentChapterIndex = 0;

// Fetch data
function loadData() {
  fetch(SPREADSHEET_URL)
    .then(res => res.json())
    .then(data => {
      productsData = data.products || [];
      novelsData = data.novels || [];
      if (document.getElementById('productGrid')) renderProducts('all');
      if (document.getElementById('novelGrid')) renderNovels();
    })
    .catch(err => {
      console.error('Error loading data:', err);
      const grid = document.getElementById('productGrid');
      if (grid) grid.innerHTML = '<p style="color:var(--muted)">Gagal memuat data produk. Coba muat ulang.</p>';
    });
}

// Utility: format price
function formatPrice(n) {
  try { return 'Rp ' + Number(n).toLocaleString('id-ID'); }
  catch(e){ return 'Rp ' + n }
}

// Render products into grid
window.renderProducts = function(category = 'all'){
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const activeCategory = String(category || 'all').toLowerCase();

  // Pindahkan warna aktif ke tab kategori yang benar.
  document.querySelectorAll('.filter-tabs .tab-btn').forEach(btn => {
    const onclickValue = btn.getAttribute('onclick') || '';
    const categoryMatch = onclickValue.match(/renderProducts\(['"]([^'"]+)['"]\)/);
    const buttonCategory = String(btn.dataset.category || categoryMatch?.[1] || '').toLowerCase();
    const isActive = buttonCategory === activeCategory;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  grid.innerHTML = '';

  const filtered = (activeCategory === 'all') ? productsData : productsData.filter(p => (p.category||'').toLowerCase() === activeCategory);

  if (!filtered.length) {
    const notFound = document.getElementById('searchNotFound');
    if (notFound) notFound.style.display = 'flex';
    return;
  }
  const notFound = document.getElementById('searchNotFound');
  if (notFound) notFound.style.display = 'none';

  filtered.forEach((p, productIndex) => {
    const article = document.createElement('article');
    // Gunakan kedua class agar kartu cocok dengan CSS lama dan UI baru.
    article.className = 'card ui-card';
    article.setAttribute('tabindex','0');
    article.setAttribute('role','button');
    article.dataset.id = p.id || '';
    article.dataset.category = p.category || 'all';

    const media = document.createElement('div');
    media.className = 'card-logo-wrapper ui-card-media';
    const img = document.createElement('img');
    img.alt = p.name || 'Produk';
    img.loading = 'lazy';
    img.src = p.image || 'https://img.icons8.com/fluency/512/box.png';
    img.onerror = () => {
      img.onerror = null;
      img.src = 'https://img.icons8.com/fluency/512/box.png';
    };
    media.appendChild(img);

    const badgeText = String(p.badge || p.label || (productIndex === 0 ? 'Rekomendasi' : '')).trim();
    if (badgeText) {
      const badge = document.createElement('span');
      badge.className = 'product-card-badge';
      badge.textContent = badgeText;
      media.appendChild(badge);
    }

    const body = document.createElement('div');
    body.className = 'ui-card-body';
    const name = document.createElement('h3');
    name.className = 'product-name';
    name.innerText = p.name || 'Unnamed Product';

    const meta = document.createElement('p');
    meta.className = 'product-meta';
    meta.innerText = p.meta || (p.description || 'Akun premium');

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const price = document.createElement('div');
    price.className = 'price';
    price.innerText = p.packets && p.packets[0] ? formatPrice(p.packets[0].price) : (p.price ? formatPrice(p.price) : '-');

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.type = 'button';
    btn.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Beli';
    btn.onclick = (e) => { e.stopPropagation(); openProductModal(p.id); };

    actions.appendChild(price);
    actions.appendChild(btn);

    body.appendChild(name);
    body.appendChild(meta);

    const assurance = document.createElement('div');
    assurance.className = 'product-card-assurance';
    assurance.innerHTML = '<span><i class="fa-solid fa-shield-heart"></i> Garansi sesuai paket</span><span><i class="fa-solid fa-bolt"></i> Pesan via WhatsApp</span>';
    body.appendChild(assurance);
    body.appendChild(actions);

    article.appendChild(media);
    article.appendChild(body);

    // keyboard support: Enter to open
    article.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProductModal(p.id);
      }
    });

    article.addEventListener('click', () => openProductModal(p.id));

    grid.appendChild(article);
  });

  // Terapkan kembali kata pencarian setelah kategori dirender ulang.
  if (typeof window.filterProductsByName === 'function') {
    window.filterProductsByName();
  }
}

// Search filter by name
window.filterProductsByName = function(){
  const q = (document.getElementById('productSearchInput')?.value || '').trim().toLowerCase();
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.ui-card, .card'));
  let anyVisible = false;
  cards.forEach(c => {
    const txt = (c.querySelector('.product-name')?.innerText || c.innerText || '').toLowerCase();
    const matches = !q || txt.includes(q);
    c.classList.toggle('is-search-hidden', !matches);
    c.hidden = !matches;
    // Paksa prioritas inline agar tetap menang meski CSS lama masih tercache.
    c.style.setProperty('display', matches ? 'flex' : 'none', 'important');
    if (matches) anyVisible = true;
  });
  const notFound = document.getElementById('searchNotFound');
  if (notFound) notFound.style.display = anyVisible ? 'none' : 'flex';
}

// Open product modal and build options
window.openProductModal = function(id){
  const p = productsData.find(x => String(x.id) === String(id));
  if (!p) return;
  currentProduct = p;
  lastActiveElement = document.activeElement;

  const modal = document.getElementById('productModal');
  const nameEl = document.getElementById('modalProductName');
  const container = document.getElementById('packetOptionsContainer');
  const totalEl = document.getElementById('totalPrice');

  if (nameEl) nameEl.innerText = p.name || 'Produk';
  if (!container) return;
  container.innerHTML = '';

  (p.packets || []).forEach((pkt, i) => {
    const row = document.createElement('label');
    row.className = `packet-row${i === 0 ? ' selected' : ''}`;
    row.innerHTML = `
      <input type="radio" name="pkt" value="${i}" ${i===0? 'checked': ''}> 
      <span class="packet-left">
        <strong>${pkt.type}</strong>
        <small>${pkt.desc || ''}</small>
      </span>
      <span class="packet-price">${formatPrice(pkt.price)}</span>
    `;
    const input = row.querySelector('input[type="radio"]');
    input?.addEventListener('change', () => {
      container.querySelectorAll('.packet-row').forEach(option => {
        option.classList.toggle('selected', option.querySelector('input')?.checked === true);
      });
      updateTotalPrice(pkt.price);
    });
    container.appendChild(row);
  });

  if (totalEl) totalEl.innerText = (p.packets && p.packets[0]) ? formatPrice(p.packets[0].price) : (p.price ? formatPrice(p.price) : 'Rp 0');

  if (modal) {
    // move modal to body to avoid stacking/transform issues
    if (modal.parentNode !== document.body) document.body.appendChild(modal);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
    modal.setAttribute('aria-modal','true');
    // prevent background scroll
    document.body.style.overflow = 'hidden';
    // focus first radio for keyboard users
    setTimeout(()=>{
      const firstRadio = container.querySelector('input[type="radio"]');
      if (firstRadio) firstRadio.focus();
    },80);
  }
}

window.updateTotalPrice = function(price){
  const totalEl = document.getElementById('totalPrice');
  if (totalEl) totalEl.innerText = formatPrice(price);
}

window.checkoutViaWhatsApp = function(){
  if (!currentProduct) return;
  const radio = document.querySelector('input[name="pkt"]:checked');
  const idx = radio ? Number(radio.value) : 0;
  const selected = (currentProduct.packets || [])[idx] || { type: '-', desc: '', price: currentProduct.price || 0 };
  // build message and open WhatsApp link
  const messageLines = [
    'Halo LapakStore88, saya ingin membeli paket premium ini:',
    '',
    `• Produk: ${currentProduct.name}`,
    `• Tipe: ${selected.type} ${selected.desc ? '(' + selected.desc + ')' : ''}`,
    `• Harga: ${formatPrice(selected.price)}`,
    '',
    'Mohon konfirmasi ketersediaan dan garansi paket sebelum pembayaran.',
    '',
    'Terima kasih.'
  ];
  const text = messageLines.join('\n');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// Close modals and restore focus
window.closeModal = function(){
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.classList.remove('active');
    m.setAttribute('aria-hidden','true');
  });
  // restore scroll if no modal active
  const anyActive = document.querySelector('.modal-overlay.active, .reader-overlay.active');
  if(!anyActive) document.body.style.overflow = '';
  if (lastActiveElement && lastActiveElement.focus) lastActiveElement.focus();
}

// Keyboard: Esc to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Novel rendering
window.renderNovels = function(){
  const grid = document.getElementById('novelGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!novelsData.length) {
    grid.innerHTML = `
      <div class="novel-empty-state">
        <i class="fa-solid fa-book-open"></i>
        <h3>Koleksi novel belum tersedia</h3>
        <p>Silakan coba muat ulang halaman beberapa saat lagi.</p>
      </div>`;
    return;
  }

  novelsData.forEach((novel, index) => {
    const article = document.createElement('article');
    article.className = 'novel-card';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `Buka novel ${novel.judul || 'tanpa judul'}`);
    article.style.setProperty('--novel-delay', `${Math.min(index, 8) * 45}ms`);

    const cover = document.createElement('div');
    cover.className = 'novel-cover';
    const img = document.createElement('img');
    img.src = novel.foto || 'https://img.icons8.com/fluency/512/book.png';
    img.loading = 'lazy';
    img.alt = `Sampul ${novel.judul || 'novel'}`;
    img.onerror = () => {
      img.onerror = null;
      img.src = 'https://img.icons8.com/fluency/512/book.png';
    };
    const badge = document.createElement('span');
    badge.className = 'novel-free-badge';
    badge.innerHTML = '<i class="fa-solid fa-book-open-reader"></i> Gratis';
    cover.append(img, badge);

    const body = document.createElement('div');
    body.className = 'novel-card-body';
    const title = document.createElement('h3');
    title.className = 'novel-title';
    title.textContent = novel.judul || 'Novel Tanpa Judul';
    const meta = document.createElement('p');
    meta.className = 'novel-meta';
    const chapterCount = Array.isArray(novel.chapters) ? novel.chapters.length : 0;
    meta.innerHTML = `<span><i class="fa-solid fa-layer-group"></i> ${chapterCount} bab</span><span><i class="fa-solid fa-mobile-screen"></i> Reader nyaman</span>`;
    const button = document.createElement('span');
    button.className = 'novel-read-button';
    button.innerHTML = 'Lihat Daftar Bab <i class="fa-solid fa-arrow-right"></i>';
    body.append(title, meta, button);
    article.append(cover, body);

    const open = () => window.openNovelModal(novel.id);
    article.addEventListener('click', open);
    article.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
    grid.appendChild(article);
  });
}

window.openNovelModal = function(id){
  const active = novelsData.find(item => String(item.id) === String(id));
  if (!active) return;
  currentNovel = active;
  currentChapterIndex = 0;
  lastActiveElement = document.activeElement;

  const modal = document.getElementById('novelModal');
  const titleEl = document.getElementById('modalNovelTitle');
  const container = document.getElementById('novelChaptersContainer');
  if (titleEl) titleEl.textContent = active.judul || 'Judul Novel';
  if (!container) return;
  container.innerHTML = '';

  const chapters = Array.isArray(active.chapters) ? active.chapters : [];
  if (!chapters.length) {
    container.innerHTML = '<div class="novel-no-chapter"><i class="fa-solid fa-circle-info"></i> Bab belum tersedia.</div>';
  } else {
    chapters.forEach((chapter, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'packet-row novel-chapter-row';
      button.innerHTML = `<span class="chapter-number">${String(index + 1).padStart(2, '0')}</span><span class="chapter-copy"><strong>${chapter.bab || `Bab ${index + 1}`}</strong><small>Tekan untuk mulai membaca</small></span><i class="fa-solid fa-chevron-right"></i>`;
      button.addEventListener('click', () => window.readChapter(index));
      container.appendChild(button);
    });
  }

  if (modal) {
    if (modal.parentNode !== document.body) document.body.appendChild(modal);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => container.querySelector('button')?.focus(), 80);
  }
}

window.closeNovelModal = function(){
  const modal = document.getElementById('novelModal');
  modal?.classList.remove('active');
  modal?.setAttribute('aria-hidden', 'true');
  const anyActive = document.querySelector('.modal-overlay.active, .reader-overlay.active');
  if (!anyActive) document.body.style.overflow = '';
  lastActiveElement?.focus?.();
}

window.readChapter = function(index){
  if (!currentNovel || !Array.isArray(currentNovel.chapters)) return;
  const chapter = currentNovel.chapters[index];
  if (!chapter) return;
  currentChapterIndex = index;

  const readingNovelName = document.getElementById('readingNovelName');
  const readingTitle = document.getElementById('readingTitle');
  const readingBody = document.getElementById('readingBody');
  if (readingNovelName) readingNovelName.textContent = currentNovel.judul || '';
  if (readingTitle) readingTitle.textContent = chapter.bab || `Bab ${index + 1}`;
  if (readingBody) {
    readingBody.textContent = chapter.isi || 'Isi bab belum tersedia.';
    readingBody.style.fontSize = currentFontSize + 'px';
    readingBody.scrollTop = 0;
  }

  updateNovelNavigation();
  updateReadingProgress();
  window.closeNovelModal();

  const reader = document.getElementById('novelReadingContainer');
  if (reader && reader.parentNode !== document.body) document.body.appendChild(reader);
  reader?.classList.add('active');
  reader?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => readingBody?.focus(), 80);
}

window.navigateChapter = function(direction) {
  if (!currentNovel?.chapters?.length) return;
  const nextIndex = currentChapterIndex + Number(direction || 0);
  if (nextIndex >= 0 && nextIndex < currentNovel.chapters.length) window.readChapter(nextIndex);
}

function updateNovelNavigation(){
  const total = currentNovel?.chapters?.length || 0;
  const prev = document.getElementById('btnPrevChapter');
  const next = document.getElementById('btnNextChapter');
  if (prev) {
    prev.disabled = currentChapterIndex <= 0;
    prev.setAttribute('aria-disabled', String(prev.disabled));
  }
  if (next) {
    next.disabled = currentChapterIndex >= total - 1;
    next.setAttribute('aria-disabled', String(next.disabled));
  }
}

function updateReadingProgress(){
  const body = document.getElementById('readingBody');
  const bar = document.getElementById('readingProgressBar');
  if (!body || !bar) return;
  const maxScroll = body.scrollHeight - body.clientHeight;
  const progress = maxScroll > 0 ? (body.scrollTop / maxScroll) * 100 : 100;
  bar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
}

window.adjustNovelFontSize = function(change){
  currentFontSize = Math.max(13, Math.min(28, currentFontSize + Number(change || 0)));
  const readerBody = document.getElementById('readingBody');
  if (readerBody) readerBody.style.fontSize = currentFontSize + 'px';
}

window.closeNovelReaderElement = function(){
  const reader = document.getElementById('novelReadingContainer');
  reader?.classList.remove('active');
  reader?.setAttribute('aria-hidden', 'true');
  const bar = document.getElementById('readingProgressBar');
  if (bar) bar.style.width = '0%';
  const anyActive = document.querySelector('.modal-overlay.active, .reader-overlay.active');
  if (!anyActive) document.body.style.overflow = '';
}

// Ensure modals on body to avoid stacking/transform issues
function ensureModalsOnBody(){
  document.querySelectorAll('.modal-overlay, .reader-overlay, #novelReadingContainer').forEach(el => {
    if(el && el.parentNode !== document.body) document.body.appendChild(el);
  });
}

// Observe modal active class to toggle body scroll
const _modalObserver = new MutationObserver(muts => {
  muts.forEach(m => {
    const target = m.target;
    if(!target.classList) return;
    if(target.classList.contains('active')) document.body.style.overflow = 'hidden';
    else {
      const any = document.querySelector('.modal-overlay.active, .reader-overlay.active');
      if(!any) document.body.style.overflow = '';
    }
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  ensureModalsOnBody();
  const readingBody = document.getElementById('readingBody');
  if (readingBody) readingBody.addEventListener('scroll', updateReadingProgress, { passive: true });
  const searchInput = document.getElementById('productSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', window.filterProductsByName);
    searchInput.addEventListener('search', window.filterProductsByName);
  }
  document.querySelectorAll('.modal-overlay, .reader-overlay').forEach(m => {
    try{ _modalObserver.observe(m, { attributes: true, attributeFilter: ['class'] }); }catch(e){}
  });
});
