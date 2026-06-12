// ================= CONFIGURATION & CREDENTIALS =================
// Akun Login Admin Lapak Kunci Konfigurasi (Bisa kamu ubah sendiri sesukamu)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "22Desember2002"; 

// Nomor WhatsApp tujuan order toko kamu
const whatsappNumber = "6285180572575";

// ================= DATABASE UTAMA ALL 25 PREMIUM BRANDS =================
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
    },
    {
        id: "youtube",
        name: "YouTube",
        class: "brand-youtube",
        packets: [
            { type: "FAMPLAN via invite email", desc: "1 Bulan", price: 10000 }
        ]
    },
    {
        id: "iqiyi",
        name: "iQIYI",
        class: "brand-iqiyi",
        packets: [
            { type: "SHARING", desc: "1 Bulan", price: 10000 },
            { type: "SHARING (Garansi 6 bulan)", desc: "1 Tahun", price: 20000 },
            { type: "PRIVATE", desc: "1 Bulan", price: 30000 }
        ]
    },
    {
        id: "capcut",
        name: "CapCut",
        class: "brand-capcut",
        packets: [
            { type: "SHARING", desc: "1 Bulan", price: 10000 },
            { type: "PRIVATE", desc: "1 Minggu", price: 5000 },
            { type: "PRIVATE", desc: "1 Bulan", price: 20000 }
        ]
    },
    {
        id: "youku",
        name: "YOUKU",
        class: "brand-youku",
        packets: [
            { type: "SHARING", desc: "1 Bulan", price: 10000 },
            { type: "SHARING", desc: "3 Bulan", price: 15000 },
            { type: "SHARING", desc: "1 Tahun", price: 20000 }
        ]
    },
    {
        id: "meitu",
        name: "MEITU AND WINK",
        class: "brand-meitu",
        packets: [
            { type: "PRIVATE (Android Only)", desc: "1 Minggu", price: 10000 },
            { type: "PRIVATE (Android Only)", desc: "1 Bulan", price: 20000 },
            { type: "PRIVATE (iOS Only)", desc: "1 Bulan", price: 35000 }
        ]
    },
    {
        id: "disney",
        name: "DISNEY+",
        class: "brand-disney",
        packets: [
            { type: "SHARING 3U", desc: "1 Bulan", price: 30000 },
            { type: "PRIVATE", desc: "1 Bulan", price: 70000 }
        ]
    },
    {
        id: "prime",
        name: "PRIME VIDEO",
        class: "brand-prime",
        packets: [
            { type: "SHARING", desc: "1 Bulan", price: 10000 },
            { type: "PRIVATE", desc: "1 Bulan", price: 18000 }
        ]
    },
    {
        id: "hbo",
        name: "HBO MAX",
        class: "brand-hbo",
        packets: [
            { type: "SHARING PLAN ULTIMATE", desc: "1 Bulan (18K - 8U)", price: 18000 },
            { type: "SHARING PLAN STANDARD", desc: "1 Bulan (20K - 5U)", price: 20000 }
        ]
    },
    {
        id: "apple",
        name: "APPLE MUSIC",
        class: "brand-apple",
        packets: [
            { type: "FAMPLAN VIA INVITE MESSAGE", desc: "1 Bulan", price: 15000 },
            { type: "FAMPLAN VIA INVITE MESSAGE", desc: "2 Bulan", price: 20000 },
            { type: "FAMPLAN VIA INVITE MESSAGE", desc: "3 Bulan", price: 25000 },
            { type: "FAMPLAN VIA INVITE MESSAGE", desc: "4 Bulan", price: 30000 }
        ]
    },
    {
        id: "picsart",
        name: "PICSART",
        class: "brand-picsart",
        packets: [
            { type: "SHARING", desc: "1 Bulan", price: 10000 },
            { type: "PRIVATE", desc: "1 Bulan", price: 20000 }
        ]
    },
    {
        id: "loklok",
        name: "LOKLOK",
        class: "brand-loklok",
        packets: [
            { type: "SHARING BASIC", desc: "1 Bulan", price: 20000 },
            { type: "SHARING STANDARD", desc: "1 Bulan", price: 23000 }
        ]
    },
    {
        id: "microsoft",
        name: "MICROSOFT 365",
        class: "brand-m365",
        packets: [
            { type: "VIA INVITE EMAIL CUSTOMER", desc: "1 Bulan", price: 10000 }
        ]
    },
    {
        id: "alight",
        name: "ALIGHT MOTION",
        class: "brand-alight",
        packets: [
            { type: "PRIVATE (Garansi 6 bulan)", desc: "1 Tahun", price: 20000 }
        ]
    },
    {
        id: "spotify",
        name: "SPOTIFY",
        class: "brand-spotify",
        packets: [
            { type: "INDIVIDUAL PLAN AKUN SELLER", desc: "1 Bulan", price: 28000 },
            { type: "INDIVIDUAL PLAN AKUN SELLER", desc: "3 Bulan", price: 50000 }
        ]
    },
    {
        id: "bstation",
        name: "BSTATION",
        class: "brand-bstation",
        packets: [
            { type: "SHARING (Kalo habis dapat 3 bln, Garansi 6 bln)", desc: "1 Tahun", price: 20000 },
            { type: "SHARING", desc: "1 Bulan", price: 10000 }
        ]
    },
    {
        id: "canva",
        name: "CANVA",
        class: "brand-canva",
        packets: [
            { type: "MEMBER (Free Designer by request)", desc: "1 Bulan", price: 5000 },
            { type: "MEMBER (Free Designer by request)", desc: "3 Bulan", price: 10000 },
            { type: "MEMBER (Garansi 6 bulan)", desc: "1 Tahun", price: 20000 },
            { type: "LIFETIME (No garansi)", desc: "Lifetime", price: 10000 }
        ]
    },
    {
        id: "grammarly",
        name: "GRAMMARLY",
        class: "brand-grammarly",
        packets: [
            { type: "SHARING", desc: "1 Bulan", price: 10000 },
            { type: "PRIVATE", desc: "1 Bulan", price: 30000 }
        ]
    },
    {
        id: "zoom",
        name: "ZOOM",
        class: "brand-zoom",
        packets: [
            { type: "100 Peserta PRIVATE", desc: "1 Bulan", price: 10000 },
            { type: "100 Peserta PRIVATE", desc: "1 Minggu", price: 10000 }
        ]
    },
    {
        id: "chatgpt",
        name: "CHATGPT",
        class: "brand-chatgpt",
        packets: [
            { type: "PLUS PRIVATE VIA INVITE EMAIL", desc: "1 Bulan", price: 20000 }
        ]
    },
    {
        id: "getcontact",
        name: "GETCONTACT",
        class: "brand-getcontact",
        packets: [
            { type: "PRIVATE AKUN CUSTOMER", desc: "1 Bulan", price: 20000 }
        ]
    },
    {
        id: "scribd",
        name: "SCRIBD / EVERAND",
        class: "brand-scribd",
        packets: [
            { type: "SHARING", desc: "1 Bulan", price: 10000 },
            { type: "SHARING (Garansi 6 bulan)", desc: "2 Bulan", price: 15000 }
        ]
    }
];

// State global aplikasi web
let productsData = [];
let activeProduct = null;
let isAdmin = false;
let adminActiveProductId = null;

// ================= INITIALIZATION & DATA LOADING =================
function loadData() {
    const savedData = localStorage.getItem("lapakStoreProducts");
    if (savedData) {
        productsData = JSON.parse(savedData);
    } else {
        productsData = defaultProductsData;
        localStorage.setItem("lapakStoreProducts", JSON.stringify(productsData));
    }
    
    // Sinkronisasi status login admin dari session sebelumnya
    isAdmin = localStorage.getItem("lapakAdminLogin") === "true";
    updateAdminUIElements();
}

// Render data produk ke dalam bentuk Card Grid di index.html
function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
    productsData.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";
        // Saat card diklik, otomatis membuka pop-up pilihan paket pembeli
        card.onclick = () => openProductModal(product.id);
        
        // Label teks berwarna khusus brand toko kamu
        const textLabel = document.createElement("div");
        textLabel.className = product.class;
        textLabel.innerText = product.name;
        card.appendChild(textLabel);
        
        // Jika mode admin sedang login aktif, tampilkan tombol modifikasi data produk
        if (isAdmin) {
            const editBtn = document.createElement("button");
            editBtn.className = "admin-edit-trigger";
            editBtn.innerText = "🛠️ Edit Harga/Paket";
            editBtn.onclick = (e) => {
                e.stopPropagation(); // Mencegah event click card utama memicu modal customer
                openAdminEditModal(product.id);
            };
            card.appendChild(editBtn);
        }
        
        grid.appendChild(card);
    });
}

// Menyesuaikan tampilan navigasi & topbar berdasarkan status login
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

// ================= AUTHENTICATION SYSTEM (ADMIN) =================
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
        // Beri class 'selected' otomatis pada baris paket urutan pertama
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
    
    // Pasang harga default awal paket ke display total belanja
    if (product.packets.length > 0) {
        updateTotalPrice(product.packets[0].price);
    } else {
        updateTotalPrice(0);
    }
    
    const modal = document.getElementById("productModal");
    if (modal) modal.classList.add("active");
}

// Fungsi interaktif memperbarui visual border baris paket & angka total harga
function changeSelectedPacketRow(radioElement, price) {
    // Bersihkan semua highlight border baris lama
    document.querySelectorAll(".packet-row").forEach(el => el.classList.remove("selected"));
    
    // Tambahkan highlight border emas ke baris yang di-klik pembeli
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

// Mengirimkan rincian pembelian pembeli secara langsung ke WhatsApp kamu
function sendWhatsAppOrder() {
    if (!activeProduct) return;
    const selectedRadio = document.querySelector('input[name="packetSelect"]:checked');
    if (!selectedRadio) return;
    
    const index = selectedRadio.value;
    const packet = activeProduct.packets[index];
    const formattedPrice = "Rp " + Number(packet.price).toLocaleString("id-ID");
    
    // Format pesan otomatis toko premium kamu
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
    
    // Kosongkan paket lama dan tumpuk dengan input data baru dari modal admin
    product.packets = [];
    types.forEach((element, index) => {
        product.packets.push({
            type: types[index].value.trim(),
            desc: descs[index].value.trim(),
            price: Number(prices[index].value) || 0
        });
    });
    
    // Kunci data baru ke dalam localStorage browser lokal agar permanen
    localStorage.setItem("lapakStoreProducts", JSON.stringify(productsData));
    renderProducts();
    closeAdminModal();
    alert(`Berhasil! Struktur paket harga baru untuk ${product.name} telah disimpan.`);
}

function closeAdminModal() {
    const modal = document.getElementById("adminEditModal");
    if (modal) modal.classList.remove("active");
}

// Global window handler: Menutup modal pop-up secara otomatis saat area hitam di-klik luar kotak box
window.onclick = function(e) {
    if (e.target.classList.contains("modal-overlay")) {
        closeModal();
        closeLoginModal();
        closeAdminModal();
    }
};

// Inisialisasi Lifecycle Aplikasi saat DOM Selesai di-load browser
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    renderProducts();
    console.log("LapakStore88 Core Script Engine Ready!");
});
