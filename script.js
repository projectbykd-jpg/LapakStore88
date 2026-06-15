// ================= CONFIGURATION =================
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbxIV3NFcgOP_5vTJ-Qw1NA9FPzvJCoRBt3RJMZC1J7nIpkP5P0s_X5hpaZPN1Q8gAD6jw/exec";
const WHATSAPP_NUMBER = "6285180572575"; // GANTI DENGAN NOMOR ANDA

let productsData = [];
let novelsData = []; 
let activeNovel = null;
let currentProduct = null; // Menyimpan data produk yang sedang dibuka di modal

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
    
    currentProduct = p; // Simpan ke variabel global
    document.getElementById("modalProductName").innerText = p.name;
    const container = document.getElementById("packetOptionsContainer");
    container.innerHTML = "";
    
    p.packets.forEach((pkt, i) => {
        container.innerHTML += `
            <label class="packet-row" style="display:block; padding:10px; border-bottom:1px solid #333; cursor:pointer;">
                <input type="radio" name="pkt" value="${i}" onchange="updateTotalPrice(${pkt.price})" ${i===0?'checked':''}>
                ${pkt.type} - ${pkt.desc} | Rp ${Number(pkt.price).toLocaleString()}
            </label>`;
    });
    
    document.getElementById("totalPrice").innerText = "Rp " + Number(p.packets[0].price).toLocaleString();
    document.getElementById("productModal").classList.add("active");
}

window.updateTotalPrice = (price) => {
    document.getElementById("totalPrice").innerText = "Rp " + Number(price).toLocaleString();
};

// ================= FUNGSI WHATSAPP =================
window.checkoutViaWhatsApp = () => {
    if (!currentProduct) return;
    
    const radio = document.querySelector('input[name="pkt"]:checked');
    const selectedPkt = currentProduct.packets[radio.value];
    
    const text = `Halo LapakStore88, saya ingin membeli paket premium ini:

• *Produk:* ${currentProduct.name}
• *Tipe Paket:* ${selectedPkt.type} (${selectedPkt.desc})
• *Durasi:* 1 Bulan
• *Total Harga:* Rp ${Number(selectedPkt.price).toLocaleString()}

Mohon instruksi pembayaran QRIS selanjutnya ya min, terima kasih!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
};

// ================= NOVEL SYSTEM =================
// ... (Bagian novel tetap sama seperti kode asli Anda)
function renderNovels() {
    const grid = document.getElementById("novelGrid");
    if (!grid) {
        console.warn("Elemen 'novelGrid' tidak ditemukan di halaman ini.");
        return;
    }
    
    grid.innerHTML = "";

    if (!novelsData || novelsData.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding:50px; color:#aaa;"><h3>Belum ada novel tersedia.</h3></div>`;
        return;
    }

    novelsData.forEach(n => {
        const card = document.createElement("div");
        card.className = "card novel-card";
        // Pastikan struktur HTML di sini sesuai dengan CSS Anda
        card.innerHTML = `
            <img src="${n.foto}" style="width:100%; border-radius:8px;" onerror="this.src='https://img.icons8.com/fluency/512/book.png'">
            <div style="padding:10px;">${n.judul}</div>
        `;
        card.onclick = () => openNovelModal(n.id);
        grid.appendChild(card);
    });
}
