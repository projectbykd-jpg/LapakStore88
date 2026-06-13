// ================= CONFIGURATION & CREDENTIALS =================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password88"; 

const whatsappNumber = "6285180572575";

// ================= DATABASE UTAMA CADANGAN (PREMIUM BRANDS) =================
const defaultProductsData = [
    {
        id: "netflix",
        name: "NETFLIX",
        class: "brand-netflix",
        packets: [
            { type: "SHARING 1P1U", desc: "1 Hari", price: 5000 },
            { type: "SHARING 1P1U", desc: "3 Hari", price: 8000 },
            { type: "SHARING 1P1U", desc: "1 Minggu", price: 15000 },
            { type: "SHARING 1P1U", desc: "1 Bulan", price: 40000 },
            { type: "SHARING 1P2U", desc: "1 Bulan", price: 25000 },
            { type: "SEMI PRIVATE", desc: "1 Bulan", price: 48000 },
            { type: "PRIVATE (Bisa 5 device)", desc: "1 Bulan", price: 180000 }
        ]
    },
    {
        id: "viu",
        name: "VIU",
        class: "brand-viu",
        packets: [
            { type: "PRIVATE ANTI LIMIT", desc: "1 Bulan", price: 5000 },
            { type: "PRIVATE ANTI LIMIT", desc: "3 Bulan", price: 10000 },
            { type: "PRIVATE ANTI LIMIT", desc: "6 Bulan", price: 15000 }
        ]
    },
    {
        id: "wetv",
        name: "WeTV",
        class: "brand-wetv",
        packets: [
            { type: "SHARING", desc: "1 Bulan", price: 10000 },
            { type: "PRIVATE", desc: "1 Bulan", price: 32000 }
        ]
    },
    {
        id: "vidio",
        name: "Vidio",
        class: "brand-vidio",
        packets: [
            { type: "PLATINUM MOBILE PLAN", desc: "1 Bulan PRIVATE", price: 26000 },
            { type: "PLATINUM MOBILE PLAN", desc: "1 Bulan SHARING", price: 20000 },
            { type: "ALL DEVICE PLAN", desc: "1 Bulan PRIVATE", price: 45000 },
            { type: "ALL DEVICE PLAN", desc: "1 Bulan SHARING", price: 25000 },
            { type: "TV ONLY PLAN PRIVATE", desc: "1 Bulan", price: 15000 }
        ]
    }
];

// State global aplikasi web
let productsData = [];
let novelsData = []; 
let activeProduct = null;
let activeNovel = null; 
let currentChapterIndex = 0;  // Mencatat bab yang sedang dibaca saat ini
let isAdmin = false;
let adminActiveProductId = null;

// ================= INITIALIZATION & DATA LOADING =================
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbzCLWEKZBt-bqGb6OIdTDmXYfKOvNHCh07XiLSXQD4EIDNcb8vtKt2NdYijK4LtO4K1gQ/exec";

function loadData() {
    isAdmin = localStorage.getItem("lapakAdminLogin") === "true";
    updateAdminUIElements();

    const grid = document.getElementById("productGrid");
    if (grid) grid.innerHTML = "<div style='color:#ffd700; text-align:center; width:100%; padding:20px;'>Memuat harga terbaru dari database...</div>";

    const novelGrid = document.getElementById("novelGrid");
    if (novelGrid) novelGrid.innerHTML = "<div style='color:#ffd700; text-align:center; width:100%; padding:20px;'>Memuat koleksi novel gratis...</div>";

    // Mengambil objek gabungan dari Apps Script
    fetch(SPREADSHEET_URL)
        .then(response => response.json())
        .then(data => {
            productsData = data.products || [];
            novelsData = data.novels || [];
            
            renderProducts();
            renderNovels(); 
        })
        .catch(error => {
            console.error("Gagal memuat data dari Google Sheets:", error);
            productsData = defaultProductsData;
            novelsData = [];
            renderProducts();
            renderNovels();
        });
}

// Render data produk premium ke bentuk Card Grid
function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
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
        card.onclick = () => openProductModal(product.id);
        
        const prodKey = product.id.toLowerCase();
        const logoUrl = logoMap[prodKey] || 'https://img.icons8.com/fluency/512/box.png';
        
        card.innerHTML = `
            <div class="card-logo-wrapper" style="width: 100%; height: 70px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                <img src="${logoUrl}" alt="${product.name}" style="max-width: 65px; max-height: 65px; object-fit: contain;">
            </div>
            <div class="${product.class}" style="font-weight: bold; text-align: center;">${product.name}</div>
        `;
        
        if (isAdmin) {
            const editBtn = document.createElement("button");
            editBtn.className = "admin-edit-trigger";
            editBtn.innerText = "🛠️ Edit Harga/Paket";
            editBtn.style.marginTop = "10px";
            editBtn.onclick = (e) => {
                e.stopPropagation(); 
                openAdminEditModal(product.id);
            };
            card.appendChild(editBtn);
        }
        grid.appendChild(card);
    });
}

// ================= RENDER NOVELS SYSTEM =================
function renderNovels() {
    const grid = document.getElementById("novelGrid");
    if (!grid) return; 
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

// Menampilkan Pop-up Daftar Bab Novel saat diclick pembaca
function openNovelModal(novelId) {
    const novel = novelsData.find(n => n.id === novelId);
    if (!novel) return;

    activeNovel = novel;

    const nameHeader = document.getElementById("modalNovelTitle");
    if (nameHeader) nameHeader.innerText = novel.judul;

    const container = document.getElementById("novelChaptersContainer");
    if (!container) return;
    container.innerHTML = "";

    novel.chapters.forEach((chapter, index) => {
        const row = document.createElement("div");
        row.className = "packet-row chapter-row";
        row.style.cursor = "pointer";
        row.onclick = () => readChapter(index);

        row.innerHTML = `
            <div class="packet-left">
                <span style="font-weight: bold; color: #ffd700;">📖 ${chapter.bab}</span>
            </div>
            <div class="packet-price" style="font-size: 11px; color: #4cdf66;">Gratis Baca</div>
        `;
        container.appendChild(row);
    });

    const modal = document.getElementById("novelModal");
    if (modal) modal.classList.add("active");
}

// Fungsi untuk membuka konten teks isi bab cerita secara utuh
function readChapter(index) {
    if (!activeNovel || !activeNovel.chapters[index]) return;
    
    // Catat indeks bab yang sedang aktif
    currentChapterIndex = index;
    const chapter = activeNovel.chapters[index];
    
    const bacaBox = document.getElementById("novelReadingContainer");
    if (!bacaBox) {
        alert(`--- ${chapter.bab} ---\n\n${chapter.isi}`);
        return;
    }
    
    // Masukkan judul dan teks cerita dengan konversi line break
    document.getElementById("readingTitle").innerText = chapter.bab;
    document.getElementById("readingBody").innerHTML = chapter.isi.replace(/\n/g, "<br>");
    
    // Reset posisi gulir bacaan otomatis ke atas
    document.getElementById("readingBody").scrollTop = 0;

    // Atur sistem visibilitas tombol Navigasi Bab (Prev & Next)
    const prevBtn = document.getElementById("btnPrevChapter");
    const nextBtn = document.getElementById("btnNextChapter");

    // Jika ini bab pembuka pertama, batasi tombol Previous
    if (prevBtn) {
        prevBtn.style.opacity = index === 0 ? "0.3" : "1";
        prevBtn.style.pointerEvents = index === 0 ? "none" : "auto";
    }
    
    // Jika sudah mencapai bab puncak terakhir, kunci tombol Next
    if (nextBtn) {
        if (index === activeNovel.chapters.length - 1) {
            nextBtn.innerText = "Bab Tamat 🎉";
            nextBtn.style.opacity = "0.5";
            nextBtn.style.pointerEvents = "none";
        } else {
            nextBtn.innerText = "Bab Selanjutnya ➡️";
            nextBtn.style.opacity = "1";
            nextBtn.style.pointerEvents = "auto";
        }
    }
    
    // Tampilkan lembaran modal membaca dengan pasti
    bacaBox.style.display = "block";
    bacaBox.classList.add("active");
}

// Fungsi lompat bab instan (Maju / Mundur halaman)
function navigateChapter(direction) {
    const targetIndex = currentChapterIndex + direction;
    
    // Jalankan jika lembaran bab berikutnya valid tersedia
    if (activeNovel && activeNovel.chapters[targetIndex]) {
        readChapter(targetIndex);
    }
}

// Fungsi menutup modal list bab novel
function closeNovelModal() {
    const modal = document.getElementById("novelModal");
    if (modal) modal.classList.remove("active");
}

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

function openLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.add("active");
}

function closeLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.remove("active");
    
    const errText = document.getElementById("loginError");
    if (errText) errText.style.display = "none";
    
    const userInput = document.getElementById("usernameInput");
    const passInput = document.getElementById("passwordInput");
    if (userInput) userInput.value = "";
    if (passInput) passInput.value = "";
}

function processLogin() {
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

function logoutAdmin() {
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

function changeSelectedPacketRow(radioElement, price) {
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

function closeModal() {
    const modal = document.getElementById("productModal");
    if (modal) modal.classList.remove("active");
}

function sendWhatsAppOrder() {
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

function saveAdminChanges() {
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

function closeAdminModal() {
    const modal = document.getElementById("adminEditModal");
    if (modal) modal.classList.remove("active");
}

// Global window handler untuk menutup overlay modal yang aktif
window.onclick = function(e) {
    if (e.target.classList.contains("modal-overlay")) {
        closeModal();
        closeLoginModal();
        closeAdminModal();
        closeNovelModal(); 
        
        // Menutup penel bacaan novel jika area luar modal di-klik
        const bacaBox = document.getElementById("novelReadingContainer");
        if (bacaBox) {
            bacaBox.classList.remove("active");
            bacaBox.style.display = "none";
        }
    }
};

// Lifecycle Aplikasi
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    console.log("LapakStore88 Core Script Engine with Novel Expansion Ready!");
});
