// Database lengkap paket produk LapakStore88 sesuai gambar list harga
const productsData = [
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

let activeProduct = null;
const whatsappNumber = "6285180572575";

// Fungsi render kartu produk ke dalam Grid Website
function renderProducts() {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    
    productsData.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => openModal(product.id);
        
        card.innerHTML = `
            <div class="card-logo-placeholder ${product.class}">
                ${product.name}
            </div>
        `;
        grid.appendChild(card);
    });
}

// Fungsi membuka modal detail paket produk
function openModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    activeProduct = product;
    document.getElementById("modalProductName").innerText = product.name;
    
    const container = document.getElementById("packetOptionsContainer");
    container.innerHTML = "";
    
    product.packets.forEach((packet, index) => {
        const row = document.createElement("label");
        row.className = "packet-row";
        
        // Format Rupiah Tampilan
        const formattedPrice = "Rp " + packet.price.toLocaleString("id-ID");
        
        row.innerHTML = `
            <div class="packet-left">
                <input type="radio" name="packetSelect" value="${index}" ${index === 0 ? 'checked' : ''} onchange="updateTotalPrice(${packet.price})">
                <span class="packet-name">${packet.type} - ${packet.desc}</span>
            </div>
            <div class="packet-price">${formattedPrice}</div>
        `;
        container.appendChild(row);
    });
    
    // Set total harga awal berdasarkan paket pertama
    updateTotalPrice(product.packets[0].price);
    
    document.getElementById("productModal").classList.add("active");
}

function updateTotalPrice(price) {
    document.getElementById("totalPrice").innerText = "Rp " + price.toLocaleString("id-ID");
}

function closeModal() {
    document.getElementById("productModal").classList.remove("active");
}

// Menutup modal secara otomatis jika area luar modal diklik
window.onclick = function(event) {
    const modal = document.getElementById("productModal");
    if (event.target === modal) {
        closeModal();
    }
}

// Fungsi Utama: Mengirim pesanan langsung terformat rapi menuju WhatsApp target
function sendWhatsAppOrder() {
    if (!activeProduct) return;
    
    const selectedRadio = document.querySelector('input[name="packetSelect"]:checked');
    if (!selectedRadio) {
        alert("Silakan pilih varian paket terlebih dahulu!");
        return;
    }
    
    const packetIndex = selectedRadio.value;
    const selectedPacket = activeProduct.packets[packetIndex];
    
    const formattedPrice = "Rp " + selectedPacket.price.toLocaleString("id-ID");
    
    // Pembuatan string template pesan teks otomatis sesuai format yang Anda minta
    const textMessage = `Min Order Akun ${activeProduct.name} Tipe ${selectedPacket.type} - ${selectedPacket.desc} - ${formattedPrice}`;
    
    // Encode komponen URL agar kompatibel aman dengan API WhatsApp link resmi
    const encodedText = encodeURIComponent(textMessage);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    
    // Buka chat tab/aplikasi WhatsApp langsung
    window.open(waUrl, '_blank');
}

// Menjalankan inisialisasi render begitu halaman selesai dimuat seluruhnya
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    console.log('LapakStore88 Premium Panel Loaded successfully.');
});
