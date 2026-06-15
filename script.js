// ================= CONFIGURATION =================
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbxIV3NFcgOP_5vTJ-Qw1NA9FPzvJCoRBt3RJMZC1J7nIpkP5P0s_X5hpaZPN1Q8gAD6jw/exec";
const WHATSAPP_NUMBER = "6285180572575";

let productsData = [];
let novelsData = []; 
let activeNovel = null;
let currentProduct = null;

// ================= INITIALIZATION =================
function loadData() {
    fetch(SPREADSHEET_URL)
        .then(res => res.json())
        .then(data => {
            productsData = data.products || [];
            novelsData = data.novels || [];
            if (document.getElementById("productGrid")) renderProducts('all');
            if (document.getElementById("novelGrid")) renderNovels();
        })
        .catch(err => console.error("Error loading data:", err));
}

// ================= RENDER PRODUK =================
window.renderProducts = (category = 'all') => {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const filtered = (category === 'all') ? productsData : productsData.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<div class="card-logo-wrapper"><img src="${p.image || 'https://img.icons8.com/fluency/512/box.png'}" onerror="this.src='https://img.icons8.com/fluency/512/box.png'"></div><h3>${p.name}</h3>`;
        card.onclick = () => openProductModal(p.id);
        grid.appendChild(card);
    });
};

window.openProductModal = (id) => {
    const p = productsData.find(x => x.id === id);
    if (!p) return;
    currentProduct = p;
    document.getElementById("modalProductName").innerText = p.name;
    const container = document.getElementById("packetOptionsContainer");
    container.innerHTML = "";
    p.packets.forEach((pkt, i) => {
        container.innerHTML += `<label class="packet-row" style="display:block; padding:10px; border-bottom:1px solid #333; cursor:pointer;"><input type="radio" name="pkt" value="${i}" onchange="updateTotalPrice(${pkt.price})" ${i===0?'checked':''}> ${pkt.type} - ${pkt.desc} | Rp ${Number(pkt.price).toLocaleString()}</label>`;
    });
    document.getElementById("totalPrice").innerText = "Rp " + Number(p.packets[0].price).toLocaleString();
    document.getElementById("productModal").classList.add("active");
};

window.updateTotalPrice = (price) => { document.getElementById("totalPrice").innerText = "Rp " + Number(price).toLocaleString(); };

window.checkoutViaWhatsApp = () => {
    if (!currentProduct) return;
    const radio = document.querySelector('input[name="pkt"]:checked');
    const selectedPkt = currentProduct.packets[radio.value];
    const text = `Halo LapakStore88, saya ingin membeli paket premium ini:\n\n• Produk: ${currentProduct.name}\n• Tipe: ${selectedPkt.type} (${selectedPkt.desc})\n• Harga: Rp ${Number(selectedPkt.price).toLocaleString()}\n\nMohon instruksi pembayaran QRIS selanjutnya ya min, terima kasih!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
};

// ================= NOVEL SYSTEM =================
window.renderNovels = () => {
    const grid = document.getElementById("novelGrid");
    if (!grid) return;
    grid.innerHTML = "";
    novelsData.forEach(n => {
        const card = document.createElement("div");
        card.className = "card novel-card";
        card.onclick = () => openNovelModal(n.id);
        card.innerHTML = `<img src="${n.foto}" style="width:100%; border-radius:8px;" onerror="this.src='https://img.icons8.com/fluency/512/book.png'"><div>${n.judul}</div>`;
        grid.appendChild(card);
    });
};

window.openNovelModal = (id) => {
    activeNovel = novelsData.find(x => x.id === id);
    if (!activeNovel) return;
    document.getElementById("modalNovelTitle").innerText = activeNovel.judul;
    const container = document.getElementById("novelChaptersContainer");
    container.innerHTML = "";
    activeNovel.chapters.forEach((ch, i) => {
        const btn = document.createElement("div");
        btn.className = "packet-row";
        btn.style.cursor = "pointer";
        btn.style.padding = "10px";
        btn.style.borderBottom = "1px solid #333";
        btn.innerHTML = `📖 ${ch.bab}`;
        btn.onclick = () => readChapter(i);
        container.appendChild(btn);
    });
    document.getElementById("novelModal").classList.add("active");
};

window.readChapter = (i) => {
    const ch = activeNovel.chapters[i];
    document.getElementById("readingTitle").innerText = ch.bab;
    document.getElementById("readingBody").innerText = ch.isi;
    document.getElementById("novelReadingContainer").classList.add("active");
};

// ================= FIX NOVEL NAVIGATION & SETTINGS =================
window.navigateChapter = (direction) => {
    if (!activeNovel || !activeNovel.chapters) return;
    const currentTitle = document.getElementById("readingTitle").innerText;
    const currentIndex = activeNovel.chapters.findIndex(ch => ch.bab === currentTitle);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < activeNovel.chapters.length) readChapter(newIndex);
};

let currentFontSize = 16;
window.adjustNovelFontSize = (change) => {
    currentFontSize += change;
    const readerBody = document.getElementById("readingBody");
    if (readerBody) readerBody.style.fontSize = currentFontSize + "px";
};

window.closeNovelReaderElement = () => document.getElementById("novelReadingContainer").classList.remove("active");
window.closeModal = () => document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));

document.addEventListener("DOMContentLoaded", loadData);
