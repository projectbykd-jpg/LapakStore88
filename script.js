// ================= CONFIGURATION & CREDENTIALS =================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password88"; 

const whatsappNumber = "6285180572575";

// State global aplikasi web
let productsData = [];
let novelsData = []; 
let activeProduct = null;
let activeNovel = null; 
let currentChapterIndex = 0;  // Mencatat bab yang sedang dibaca saat ini
let isAdmin = false;
let adminActiveProductId = null;
let currentFontSize = 17; // Ukuran font default pembaca novel (px)

// ================= INITIALIZATION & DATA LOADING =================
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbzCLWEKZBt-bqGb6OIdTDmXYfKOvNHCh07XiLSXQD4EIDNcb8vtKt2NdYijK4LtO4K1gQ/exec";

function loadData() {
    isAdmin = localStorage.getItem("lapakAdminLogin") === "true";
    updateAdminUIElements();

    const grid = document.getElementById("productGrid");
    if (grid) grid.innerHTML = "<div style='color:#ffd700; text-align:center; width:100%; padding:20px;'>Memuat harga terbaru dari database...</div>";

    const novelGrid = document.getElementById("novelGrid");
    if (novelGrid) novelGrid.innerHTML = "<div style='color:#ffd700; text-align:center; width:100%; padding:20px;'>Memuat koleksi novel gratis...</div>";

    // Cek apakah ada perubahan lokal oleh admin yang tersimpan
    const localProducts = localStorage.getItem("lapakStoreProducts");

    // Mengambil objek gabungan dari Apps Script
    fetch(SPREADSHEET_URL)
        .then(response => response.json())
        .then(data => {
            productsData = localProducts ? JSON.parse(localProducts) : (data.products || []);
            novelsData = data.novels || [];
            
            renderProducts();
            renderNovels(); 
        })
        .catch(error => {
            console.error("Gagal memuat data dari Google Sheets:", error);
            // Ambil data lokal, jika tidak ada set array kosong agar web tidak crash
            productsData = localProducts ? JSON.parse(localProducts) : [];
            novelsData = [];
            
            // Tampilkan pesan error informatif di UI produk
            if (grid) grid.innerHTML = "<div style='color:#ff4d4d; text-align:center; width:100%; padding:20px;'>Gagal memuat produk. Periksa koneksi internet Anda!</div>";
            
            renderProducts();
            renderNovels();
        });
}

// Render data produk premium ke bentuk Card Grid (UPDATED: Mendukung Gambar & Kategori Dinamis)
function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return; // PENGAMAN: Berhenti jika tidak berada di produk.html
    grid.innerHTML = "";
    
    // Peta cadangan (Hanya dipakai jika di Google Sheets kolom gambar kosong/tidak diset)
    const logoMap = {
        'netflix': 'https://img.icons8.com/color/512/netflix--v1.png',
        'viu': 'https://i.ibb.co/4Z12Ycjm/image.png',
        'wetv': 'https://i.ibb.co/wFbZ2f16/image.png',
        'vidio': 'https://i.ibb.co/xSBTxckS/image.png',
        'youtube': 'https://img.icons8.com/color/512/youtube-play.png',
        'iqiyi': 'https://i.ibb.co/nqs2CyXY/image.png',
        'capcut': 'https://i.ibb.co/wZC6s8TL/image.png',
        'youku': 'https://i.ibb.co/tMTYm90y/image.png',
        'meitu': 'https://i.ibb.co/G4nYGcfk/image.png',
        'disney': 'https://i.ibb.co/PZzrW7Zd/image.png',
        'prime': 'https://img.icons8.com/color/512/amazon-prime-video.png',
        'hbo': 'https://i.ibb.co/0VZpBWrv/image.png',
        'apple': 'https://img.icons8.com/color/512/apple-music.png',
        'picsart': 'https://img.icons8.com/color/512/picsart.png',
        'loklok': 'https://i.ibb.co/KzW9RJP6/image.png', 
        'microsoft': 'https://i.ibb.co/bgxh2JFr/image.png',
        'alight': 'https://i.ibb.co/bjmpFwbc/image.png',
        'spotify': 'https://img.icons8.com/color/512/spotify--v1.png',
        'bstation': 'https://img.icons8.com/fluency/512/bilibili.png',
        'canva': 'https://img.icons8.com/color/512/canva.png',
        'grammarly': 'https://img.icons8.com/color/512/grammarly.png',
        'zoom': 'https://img.icons8.com/color/512/zoom.png',
        'chatgpt': 'https://img.icons8.com/fluent/512/chatgpt.png',
        'getcontact': 'https://i.ibb.co/XZjRttvR/image.png',
        'scribd': 'https://i.ibb.co/231Ygg29/image.png'
    };
    
    productsData.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";
        
        // --- PERBAIKAN UTAMA: MEMBACA KATEGORI & GAMBAR DARI GOOGLE SHEET ---
        const productCategory = product.category || product.kategori || "all";
        card.setAttribute("data-category", productCategory.toLowerCase().trim());
        
        // Membaca link gambar langsung dari kolom Sheet baru. Jika kosong, pakai logoMap cadangan di atas.
        const prodKey = product.id.toLowerCase();
        const logoUrl = product.image || product.gambar || logoMap[prodKey] || 'https://img.icons8.com/fluency/512/box.png';
        
        card.onclick = () => openProductModal(product.id);
        
        // Memasang struktur bersih & menyuntikkan class styling gambar khusus
        card.innerHTML = `
            <div class="card-logo-wrapper">
                <img src="${logoUrl}" alt="${product.name}" class="product-image-sheet">
            </div>
            <h3 class="product-name ${product.class || ''}" style="margin: 5px 0 0 0; font-size: 14px; text-align: center;">${product.name}</h3>
        `;
        
        if (isAdmin) {
            const editBtn = document.createElement("button");
            editBtn.className = "admin-edit-trigger";
            editBtn.innerText = "🛠️ Edit Paket";
            editBtn.style.marginTop = "10px";
            editBtn.style.width = "100%";
            editBtn.onclick = (e) => {
                e.stopPropagation(); 
                openAdminEditModal(product.id);
            };
            card.appendChild(editBtn);
        }
        grid.appendChild(card);
    });

    // Menjalankan penyegaran tampilan awal tab agar aplikasi langsung terlihat tanpa tersembunyi
    if (typeof filterProductTab === "function") {
        const activeTabElement = document.querySelector('.tab-btn.active');
        if (activeTabElement) {
            const activeCategory = activeTabElement.textContent.toLowerCase().includes('semua') ? 'all' : 
                                   activeTabElement.textContent.toLowerCase().includes('stream') ? 'streaming' :
                                   activeTabElement.textContent.toLowerCase().includes('musi') ? 'music' : 'tools';
            
            let cards = grid.getElementsByClassName('card');
            let anyVisible = false;
            for (let i = 0; i < cards.length; i++) {
                let cardCategory = cards[i].getAttribute('data-category') || 'all';
                if (activeCategory === 'all' || cardCategory === activeCategory) {
                    cards[i].style.setProperty('display', '', 'important');
                    anyVisible = true;
                } else {
                    cards[i].style.setProperty('display', 'none', 'important');
                }
            }
            const notFoundEl = document.getElementById('searchNotFound');
            if (notFoundEl) notFoundEl.style.display = anyVisible ? 'none' : 'flex';
        }
    }
}

// ================= RENDER NOVELS SYSTEM =================
function renderNovels() {
    const grid = document.getElementById("novelGrid");
    if (!grid) return; // PENGAMAN: Berhenti jika tidak berada di novel.html
    grid.innerHTML = "";

    if (novelsData.length === 0) {
        grid.innerHTML = "<div style='color:#a0aec0; text-align:center; width:100%; padding:20px;'>Belum ada koleksi novel hari ini.</div>";
        return;
    }

    novelsData.forEach(novel => {
        const card = document.createElement("div");
        card.className = "card novel-card";
        card.onclick = () => openNovelModal(novel.id);

        card.innerHTML = `
            <div class="card-logo-wrapper" style="width: 100%; height: 90px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                <img src="${novel.foto}" alt="${novel.judul}" style="max-width: 85px; max-height: 85px; object-fit: cover; border-radius: 6px;">
            </div>
            <div style="font-weight: bold; text-align: center; color: #ffd700; font-size: 14px;">${novel.judul}</div>
            <div style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 4px;">${novel.chapters.length} Bab Tersedia</div>
        `;
        grid.appendChild(card);
    });
}

// ================= RENDER PRODUK & NOVEL =================
function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";
    productsData.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<div class="card-logo-wrapper"><img src="${p.image || p.gambar}" class="product-image-sheet"></div><h3 class="product-name">${p.name}</h3>`;
        card.onclick = () => openProductModal(p.id);
        grid.appendChild(card);
    });
}

function renderNovels() {
    const grid = document.getElementById("novelGrid");
    if (!grid) return;
    grid.innerHTML = "";
    novelsData.forEach(n => {
        const card = document.createElement("div");
        card.className = "card novel-card";
        card.onclick = () => openNovelModal(n.id);
        card.innerHTML = `<div class="card-logo-wrapper"><img src="${n.foto}" style="max-width:85px; border-radius:6px;"></div><div style="font-weight:bold; color:#ffd700;">${n.judul}</div>`;
        grid.appendChild(card);
    });
}

// ================= READ NOVEL LOGIC =================
function openNovelModal(id) {
    activeNovel = novelsData.find(n => n.id === id);
    document.getElementById("modalNovelTitle").innerText = activeNovel.judul;
    const container = document.getElementById("novelChaptersContainer");
    container.innerHTML = "";
    activeNovel.chapters.forEach((ch, i) => {
        const row = document.createElement("div");
        row.className = "packet-row chapter-row";
        row.onclick = () => readChapter(i);
        row.innerHTML = `<div class="packet-left">📖 ${ch.bab}</div><div class="packet-price">Gratis</div>`;
        container.appendChild(row);
    });
    document.getElementById("novelModal").classList.add("active");
}

function readChapter(index) {
    closeNovelModal(); // TUTUP DAFTAR BAB DULU
    currentChapterIndex = index;
    const chapter = activeNovel.chapters[index];
    document.getElementById("readingTitle").innerText = chapter.bab;
    const bodyEl = document.getElementById("readingBody");
    bodyEl.innerHTML = chapter.isi.replace(/\n/g, "<br>");
    
    const bacaBox = document.getElementById("novelReadingContainer");
    bacaBox.style.setProperty('display', 'flex', 'important');
    bacaBox.classList.add("active");
}

function closeNovelReaderElement() {
    document.getElementById("novelReadingContainer").classList.remove("active");
    document.getElementById("novelReadingContainer").style.display = 'none';
}

function closeNovelModal() {
    document.getElementById("novelModal").classList.remove("active");
}

window.onclick = (e) => {
    if (e.target.classList.contains("modal-overlay")) e.target.classList.remove("active");
    if (e.target.classList.contains("reader-overlay")) closeNovelReaderElement();
};

document.addEventListener("DOMContentLoaded", loadData);

// ================= AUTHENTICATION SYSTEM (ADMIN) =================
function updateAdminUIElements() {
    const adminBar = document.getElementById("adminBadgePanel");
    const loginNavBtn = document.getElementById("loginNavBtn");
    
    if (!loginNavBtn) return;
    
    if (isAdmin) {
        if (adminBar) adminBar.style.display = "flex";
        loginNavBtn.innerText = "Admin Aktif";
        loginNavBtn.style.background = "#ff9800";
        loginNavBtn.style.color = "#000";
        loginNavBtn.setAttribute("onclick", "logoutAdmin()");
    } else {
        if (adminBar) adminBar.style.display = "none";
        loginNavBtn.innerText = "Login";
        loginNavBtn.style.background = "transparent";
        loginNavBtn.style.color = "#ffd700";
        loginNavBtn.setAttribute("onclick", "openLoginModal()");
    }
}

window.openLoginModal = function() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.add("active");
}

window.closeLoginModal = function() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.remove("active");
    
    const errText = document.getElementById("loginError");
    if (errText) errText.style.display = "none";
    
    const userInput = document.getElementById("usernameInput");
    const passInput = document.getElementById("passwordInput");
    if (userInput) userInput.value = "";
    if (passInput) passInput.value = "";
}

window.processLogin = function() {
    const user = document.getElementById("usernameInput")?.value;
    const pass = document.getElementById("passwordInput")?.value;
    
    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
        isAdmin = true;
        localStorage.setItem("lapakAdminLogin", "true");
        updateAdminUIElements();
        renderProducts();
        closeLoginModal();
        alert("Selamat Datang, Admin LapakStore88! Mode Edit Aktif.");
    } else {
        const errText = document.getElementById("loginError");
        if (errText) errText.style.display = "block";
    }
}

window.logoutAdmin = function() {
    isAdmin = false;
    localStorage.setItem("lapakAdminLogin", "false");
    updateAdminUIElements();
    renderProducts();
    alert("Keluar dari Mode Admin. Sekarang kembali ke Mode Customer.");
}

// ================= CUSTOMER SHOPPING MODAL =================
function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    activeProduct = product;
    
    const nameHeader = document.getElementById("modalProductName");
    if (nameHeader) nameHeader.innerText = product.name;
    
    const container = document.getElementById("packetOptionsContainer");
    if (!container) return;
    container.innerHTML = "";
    
    product.packets.forEach((packet, index) => {
        const row = document.createElement("label");
        row.className = `packet-row ${index === 0 ? 'selected' : ''}`;
        
        const formattedPrice = "Rp " + Number(packet.price).toLocaleString("id-ID");
        
        row.innerHTML = `
            <div class="packet-left">
                <input type="radio" name="packetSelect" value="${index}" ${index === 0 ? 'checked' : ''} 
                    onchange="changeSelectedPacketRow(this, ${packet.price})">
                <span>${packet.type} - ${packet.desc}</span>
            </div>
            <div class="packet-price">${formattedPrice}</div>
        `;
        container.appendChild(row);
    });
    
    if (product.packets.length > 0) {
        updateTotalPrice(product.packets[0].price);
    } else {
        updateTotalPrice(0);
    }
    
    const modal = document.getElementById("productModal");
    if (modal) modal.classList.add("active");
}

window.changeSelectedPacketRow = function(radioElement, price) {
    document.querySelectorAll(".packet-row").forEach(el => el.classList.remove("selected"));
    const parentLabel = radioElement.closest(".packet-row");
    if (parentLabel) parentLabel.classList.add("selected");
    updateTotalPrice(price);
}

function updateTotalPrice(price) {
    const totalPriceEl = document.getElementById("totalPrice");
    if (totalPriceEl) {
        totalPriceEl.innerText = "Rp " + Number(price).toLocaleString("id-ID");
    }
}

window.closeModal = function() {
    const modal = document.getElementById("productModal");
    if (modal) modal.classList.remove("active");
}

window.sendWhatsAppOrder = function() {
    if (!activeProduct) return;
    const selectedRadio = document.querySelector('input[name="packetSelect"]:checked');
    if (!selectedRadio) return;
    
    const index = selectedRadio.value;
    const packet = activeProduct.packets[index];
    const formattedPrice = "Rp " + Number(packet.price).toLocaleString("id-ID");
    
    const textMessage = `Halo LapakStore88, saya ingin membeli paket premium ini:\n\n` +
                        `• *Produk:* Akun ${activeProduct.name}\n` +
                        `• *Tipe Paket:* ${packet.type}\n` +
                        `• *Durasi:* ${packet.desc}\n` +
                        `• *Total Harga:* ${formattedPrice}\n\n` +
                        `Mohon instruksi pembayaran QRIS selanjutnya ya min, terima kasih!`;
                        
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`, '_blank');
    closeModal();
}

// ================= BACKOFFICE CONTROL PANEL (ADMIN ONLY) =================
function openAdminEditModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    adminActiveProductId = productId;
    
    const targetTitle = document.getElementById("adminTargetProductName");
    if (targetTitle) targetTitle.innerText = `Produk: ${product.name}`;
    
    const container = document.getElementById("adminPacketsEditorContainer");
    if (!container) return;
    container.innerHTML = "";
    
    product.packets.forEach((packet, index) => {
        const div = document.createElement("div");
        div.className = "admin-edit-row";
        div.innerHTML = `
            <div style="margin-bottom:5px; font-weight:bold; color:#ffd700;">Paket Varian #${index + 1}</div>
            <label style="font-size:11px; color:#a0aec0; display:block; margin-top:5px;">Nama Tipe Paket</label>
            <input type="text" class="form-control admin-input-type" value="${packet.type}" style="margin-bottom:8px;">
            <label style="font-size:11px; color:#a0aec0; display:block;">Durasi</label>
            <input type="text" class="form-control admin-input-desc" value="${packet.desc}" style="margin-bottom:8px;">
            <label style="font-size:11px; color:#a0aec0; display:block;">Harga (Hanya Angka, Tanpa Rp atau Titik)</label>
            <input type="number" class="form-control admin-input-price" value="${packet.price}">
        `;
        container.appendChild(div);
    });
    
    const modal = document.getElementById("adminEditModal");
    if (modal) modal.classList.add("active");
}

window.saveAdminChanges = function() {
    const product = productsData.find(p => p.id === adminActiveProductId);
    if (!product) return;
    
    const types = document.querySelectorAll(".admin-input-type");
    const descs = document.querySelectorAll(".admin-input-desc");
    const prices = document.querySelectorAll(".admin-input-price");
    
    product.packets = [];
    types.forEach((element, index) => {
        product.packets.push({
            type: types[index].value.trim(),
            desc: descs[index].value.trim(),
            price: Number(prices[index].value) || 0
        });
    });
    
    localStorage.setItem("lapakStoreProducts", JSON.stringify(productsData));
    renderProducts();
    closeAdminModal();
    alert(`Berhasil! Struktur paket harga baru untuk ${product.name} telah disimpan.`);
}

window.closeAdminModal = function() {
    const modal = document.getElementById("adminEditModal");
    if (modal) modal.classList.remove("active");
}

window.closeNovelModal = function() {
    const modal = document.getElementById("novelModal");
    if (modal) modal.classList.remove("active");
}

window.navigateChapter = function(direction) {
    const targetIndex = currentChapterIndex + direction;
    if (activeNovel && activeNovel.chapters[targetIndex]) {
        readChapter(targetIndex);
    }
}

window.onclick = function(e) {
    if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("reader-overlay")) {
        closeModal();
        closeLoginModal();
        closeAdminModal();
        closeNovelModal(); 
        closeNovelReaderElement();
    }
};

// Lifecycle Aplikasi
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    console.log("LapakStore88 Core Script Engine with Novel Expansion Ready!");
});
