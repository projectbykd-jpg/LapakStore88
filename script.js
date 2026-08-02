// Central app script (refactored)
// - Safer rendering, semantic product cards, keyboard support, modal focus management

// Configuration
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbxIV3NFcgOP_5vTJ-Qw1NA9FPzvJCoRBt3RJMZC1J7nIpkP5P0s_X5hpaZPN1Q8gAD6jw/exec";
const WHATSAPP_NUMBER = "6285180572575";

let productsData = [];
let novelsData = [];
let currentProduct = null;
let lastActiveElement = null;
let currentFontSize = 18; // default reader font size

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
  grid.innerHTML = '';

  const filtered = (category === 'all') ? productsData : productsData.filter(p => (p.category||'').toLowerCase() === category.toLowerCase());

  if (!filtered.length) {
    const notFound = document.getElementById('searchNotFound');
    if (notFound) notFound.style.display = 'flex';
    return;
  }
  const notFound = document.getElementById('searchNotFound');
  if (notFound) notFound.style.display = 'none';

  filtered.forEach(p => {
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
    if (!q || txt.includes(q)) { c.style.display = ''; anyVisible = true; }
    else { c.style.display = 'none'; }
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
    row.className = 'packet-row';
    row.style.display = 'block';
    row.innerHTML = `
      <input type="radio" name="pkt" value="${i}" ${i===0? 'checked': ''} style="margin-right:8px"> 
      <span class="packet-left"> <strong>${pkt.type}</strong> — <small style='color:var(--muted)'>${pkt.desc || ''}</small></span>
      <span class="packet-price">${formatPrice(pkt.price)}</span>
    `;
    const input = row.querySelector('input[type="radio"]');
    input?.addEventListener('change', () => updateTotalPrice(pkt.price));
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
  novelsData.forEach(n => {
    const card = document.createElement('div');
    card.className = 'ui-card novel-card';
    const img = document.createElement('img');
    img.src = n.foto || 'https://img.icons8.com/fluency/512/book.png';
    img.loading = 'lazy';
    img.alt = n.judul || 'Novel';
    img.style.borderRadius = '8px';
    card.appendChild(img);
    const title = document.createElement('div');
    title.className = 'product-name';
    title.innerText = n.judul || 'Untitled';
    card.appendChild(title);
    card.setAttribute('tabindex','0');
    card.addEventListener('click', () => openNovelModal(n.id));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openNovelModal(n.id); });
    grid.appendChild(card);
  });
}

window.openNovelModal = function(id){
  const active = novelsData.find(x => String(x.id) === String(id));
  if (!active) return;
  const modal = document.getElementById('novelModal');
  const titleEl = document.getElementById('modalNovelTitle');
  const container = document.getElementById('novelChaptersContainer');
  if (titleEl) titleEl.innerText = active.judul || 'Judul Novel';
  if (!container) return;
  container.innerHTML = '';
  (active.chapters || []).forEach((ch,i) => {
    const btn = document.createElement('div');
    btn.className = 'packet-row';
    btn.innerText = `📖 ${ch.bab}`;
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => readChapter(i));
    container.appendChild(btn);
  });
  if (modal) {
    if (modal.parentNode !== document.body) document.body.appendChild(modal);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
}

window.readChapter = function(i){
  const active = novelsData.find(n => n.chapters && n.chapters[i]);
  if (!active) return;
  const ch = active.chapters[i];
  const readingTitle = document.getElementById('readingTitle');
  const readingBody = document.getElementById('readingBody');
  if (readingTitle) readingTitle.innerText = ch.bab || '';
  if (readingBody) readingBody.innerText = ch.isi || '';
  const reader = document.getElementById('novelReadingContainer');
  if (reader && reader.parentNode !== document.body) document.body.appendChild(reader);
  document.getElementById('novelReadingContainer')?.classList.add('active');
}

window.navigateChapter = function(direction) {
  const active = novelsData.find(n => n.chapters && n.chapters.length);
  if (!active) return;
  const currentTitle = document.getElementById('readingTitle')?.innerText || '';
  const currentIndex = active.chapters.findIndex(ch => ch.bab === currentTitle);
  const newIndex = currentIndex + direction;
  if (newIndex >= 0 && newIndex < active.chapters.length) readChapter(newIndex);
}

window.adjustNovelFontSize = function(change){
  currentFontSize = Math.max(12, currentFontSize + change);
  const readerBody = document.getElementById('readingBody');
  if (readerBody) readerBody.style.fontSize = currentFontSize + 'px';
}

window.closeNovelReaderElement = function(){
  document.getElementById('novelReadingContainer')?.classList.remove('active');
  const anyActive = document.querySelector('.modal-overlay.active, .reader-overlay.active');
  if(!anyActive) document.body.style.overflow = '';
}

// Ensure modals on body to avoid stacking/transform issues
function ensureModalsOnBody(){
  document.querySelectorAll('.modal-overlay, .reader-overlay, #adminEditModal, #novelReadingContainer').forEach(el => {
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
  document.querySelectorAll('.modal-overlay, .reader-overlay').forEach(m => {
    try{ _modalObserver.observe(m, { attributes: true, attributeFilter: ['class'] }); }catch(e){}
  });
});
