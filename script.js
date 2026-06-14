// ================= CONFIGURATION =================
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbxIV3NFcgOP_5vTJ-Qw1NA9FPzvJCoRBt3RJMZC1J7nIpkP5P0s_X5hpaZPN1Q8gAD6jw/exec";

let productsData = [];
let novelsData = []; 
let activeNovel = null;

// ================= INITIALIZATION =================
function loadData() {
    fetch(SPREADSHEET_URL)
        .then(res => res.json())
        .then(data => {
            productsData = data.products || [];
            novelsData = data.novels || [];
            
            // Render berdasarkan halaman yang aktif
            if (document.getElementById("productGrid")) renderProducts('all');
            if (document.getElementById("novelGrid")) renderNovels();
        })
        .catch(err => console.error("Error loading data:", err));
}

// ================= RENDER PRODUK DENGAN FILTER =================
window.renderProducts = (category = 'all') => {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const filtered = (category === 'all') 
        ? productsData 
        : productsData.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding:20px; color:#aaa;"><h3>Aplikasi Tidak Ditemukan</h3></div>`;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-logo-wrapper"><img src="${p.image || 'https://img.icons8.com/fluency/512/box.png'}" onerror="this.src='https://img.icons8.com/fluency/512/box.png'"></div>
            <h3 class="product-name">${p.name}</h3>
        `;
        card.onclick = () => openProductModal(p.id);
        grid.appendChild(card);
    });
};

// ================= MODAL PRODUK =================
function openProductModal(id) {
    const p = productsData.find(x => x.id === id);
    if (!p) return;
    
    document.getElementById("modalProductName").innerText = p.name;
    const container = document.getElementById("packetOptionsContainer");
    container.innerHTML = "";
    
    p.packets.forEach((pkt, i) => {
        container.innerHTML += `
            <label class="packet-row" style="display:block; padding:10px; border-bottom:1px solid #333; cursor:pointer;">
                <input type="radio" name="pkt" value="${pkt.price}" onchange="updateTotalPrice(${pkt.price})" ${i===0?'checked':''}>
                ${pkt.type} - ${pkt.desc} | Rp ${Number(pkt.price).toLocaleString()}
            </label>`;
    });
    document.getElementById("totalPrice").innerText = "Rp " + Number(p.packets[0].price).toLocaleString();
    document.getElementById("productModal").classList.add("active");
}

window.updateTotalPrice = (price) => {
    document.getElementById("totalPrice").innerText = "Rp " + Number(price).toLocaleString();
};

// ================= NOVEL SYSTEM =================
function renderNovels() {
    const grid = document.getElementById("novelGrid");
    if (!grid) return;
    grid.innerHTML = "";
    novelsData.forEach(n => {
        const card = document.createElement("div");
        card.className = "card novel-card";
        card.onclick = () => openNovelModal(n.id);
        card.innerHTML = `<img src="${n.foto}" style="width:60px;" onerror="this.src='https://img.icons8.com/fluency/512/book.png'"><div>${n.judul}</div>`;
        grid.appendChild(card);
    });
}

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

// ================= CLOSERS =================
// Menutup semua modal yang memiliki class .modal-overlay
window.closeModal = () => {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
};

document.addEventListener("DOMContentLoaded", loadData);
