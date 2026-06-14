// ================= CONFIGURATION =================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password88"; 
const whatsappNumber = "6285180572575";
// URL BARU ANDA SUDAH DIPASANG DI SINI
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbxIV3NFcgOP_5vTJ-Qw1NA9FPzvJCoRBt3RJMZC1J7nIpkP5P0s_X5hpaZPN1Q8gAD6jw/exec";

let productsData = [];
let novelsData = []; 
let activeProduct = null;
let activeNovel = null; 
let currentChapterIndex = 0; 
let isAdmin = false;
let adminActiveProductId = null;

// ================= INITIALIZATION =================
function loadData() {
    isAdmin = localStorage.getItem("lapakAdminLogin") === "true";
    updateAdminUIElements();

    fetch(SPREADSHEET_URL)
        .then(response => response.json())
        .then(data => {
            // Data diambil langsung dari URL terbaru
            productsData = data.products || [];
            novelsData = data.novels || [];
            renderProducts();
            renderNovels();
        })
        .catch(error => {
            console.error("Gagal memuat dari Sheet:", error);
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
        card.innerHTML = `
            <div class="card-logo-wrapper"><img src="${p.image || 'https://img.icons8.com/fluency/512/box.png'}" class="product-image-sheet" onerror="this.src='https://img.icons8.com/fluency/512/box.png'"></div>
            <h3 class="product-name">${p.name}</h3>
        `;
        card.onclick = () => openProductModal(p.id);
        if (isAdmin) {
            const btn = document.createElement("button");
            btn.innerText = "🛠️ Edit";
            btn.style.marginTop = "10px";
            btn.onclick = (e) => { e.stopPropagation(); openAdminEditModal(p.id); };
            card.appendChild(btn);
        }
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
        card.innerHTML = `<div class="card-logo-wrapper"><img src="${n.foto}" style="max-width:85px;" onerror="this.src='https://img.icons8.com/fluency/512/book.png'"></div><div style="margin-top:10px;">${n.judul}</div>`;
        grid.appendChild(card);
    });
}

// ================= NOVEL SYSTEM =================
window.openNovelModal = (id) => {
    activeNovel = novelsData.find(n => n.id === id);
    if (!activeNovel) return;
    document.getElementById("modalNovelTitle").innerText = activeNovel.judul;
    const container = document.getElementById("novelChaptersContainer");
    container.innerHTML = "";
    activeNovel.chapters.forEach((ch, i) => {
        const row = document.createElement("div");
        row.className = "packet-row";
        row.onclick = () => readChapter(i);
        row.innerHTML = `<div>📖 ${ch.bab}</div>`;
        container.appendChild(row);
    });
    document.getElementById("novelModal").classList.add("active");
};

window.readChapter = (index) => {
    currentChapterIndex = index;
    const ch = activeNovel.chapters[index];
    document.getElementById("readingTitle").innerText = ch.bab;
    document.getElementById("readingBody").innerText = ch.isi;
    document.getElementById("novelReadingContainer").classList.add("active");
};

// ================= MODAL & SHOPPING =================
function openProductModal(id) {
    activeProduct = productsData.find(p => p.id === id);
    if (!activeProduct) return;
    document.getElementById("modalProductName").innerText = activeProduct.name;
    const container = document.getElementById("packetOptionsContainer");
    container.innerHTML = "";
    activeProduct.packets.forEach((p, i) => {
        container.innerHTML += `<label class="packet-row"><input type="radio" name="pkt" onchange="updateTotalPrice(${p.price})" ${i===0?'checked':''}> ${p.type} - ${p.desc} | Rp ${Number(p.price).toLocaleString()}</label>`;
    });
    document.getElementById("totalPrice").innerText = "Rp " + Number(activeProduct.packets[0].price).toLocaleString();
    document.getElementById("productModal").classList.add("active");
}

window.updateTotalPrice = (price) => {
    document.getElementById("totalPrice").innerText = "Rp " + Number(price).toLocaleString();
};

// ================= ADMIN & LOGIN =================
function updateAdminUIElements() {
    const loginNavBtn = document.getElementById("loginNavBtn");
    if (!loginNavBtn) return;
    loginNavBtn.innerText = isAdmin ? "Admin Aktif" : "Login";
    loginNavBtn.onclick = isAdmin ? logoutAdmin : openLoginModal;
}

window.openLoginModal = () => document.getElementById("loginModal").classList.add("active");
window.processLogin = () => {
    if (document.getElementById("usernameInput").value === ADMIN_USERNAME && document.getElementById("passwordInput").value === ADMIN_PASSWORD) {
        isAdmin = true;
        localStorage.setItem("lapakAdminLogin", "true");
        updateAdminUIElements();
        renderProducts();
        document.getElementById("loginModal").classList.remove("active");
    } else alert("Login Gagal!");
};

window.logoutAdmin = () => {
    isAdmin = false;
    localStorage.setItem("lapakAdminLogin", "false");
    updateAdminUIElements();
    renderProducts();
};

// ================= CLOSERS =================
window.closeModal = () => document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
window.closeNovelReaderElement = () => document.getElementById("novelReadingContainer").classList.remove("active");

document.addEventListener("DOMContentLoaded", loadData);
