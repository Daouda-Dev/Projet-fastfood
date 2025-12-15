// Panier
let cart = [];

// Éléments DOM
const cartCount = document.querySelector('.cart-count');
const cartDropdown = document.querySelector('.cart-dropdown');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const checkoutBtn = document.querySelector('.checkout-btn');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const cartIcon = document.querySelector('.cart-icon');

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

/*** ÉCOUTEURS D'ÉVÉNEMENTS ***/
function setupEventListeners() {
    // Menu mobile
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Panier
    cartIcon.addEventListener('click', () => {
        cartDropdown.classList.toggle('active');
    });
    
    // Ajout au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.dataset.price);
            const productImage = productCard.querySelector('img').src;

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                color: null,            // plus de couleur
                colorCode: null,        // plus de couleur
                image: productImage
            });
        });
    });
    
    // Commande
    checkoutBtn.addEventListener('click', checkout);
}

/*** FONCTIONS DU PANIER ***/
function addToCart(product) {
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
}

function updateCart() {
    // Mettre à jour le compteur
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Générer les items du panier
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" width="60">
            <div>
                <h4>${item.name}</h4>
                <p>${item.price.toFixed(0)} FCFA × ${item.quantity}</p>
            </div>
            <p>${(item.price * item.quantity).toFixed(0)} FCFA</p>
        </div>
    `).join('');

    // Calculer le total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(0);
}

/*** COMMANDE WHATSAPP ***/
function checkout() {
    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const notes = document.getElementById('customer-notes').value.trim();

    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }
    
    if (!name || !address) {
        alert("Veuillez remplir votre nom et adresse");
        return;                         
    }

    let message = "📱 Nouvelle Commande - FAS_FOOD_G1\n\n";
    message += "=== PRODUITS ===\n";
    
    cart.forEach(item => {
        message += `► ${item.name}\n`;
        message += `   • Quantité: ${item.quantity}\n`;
        message += `   • Prix: ${(item.price * item.quantity).toFixed(0)} FCFA\n\n`;
    });
    
    message += `TOTAL: ${cartTotal.textContent} FCFA\n\n`;
    message += "=== LIVRAISON ===\n";
    message += `Nom: ${name}\n`;
    message += `Adresse: ${address}\n`;
    if (notes) message += `Notes: ${notes}\n`;
    
    const phone = "22373003978";
    const url =`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, "_blank");
    
    // Réinitialiser
    cart = [];
    updateCart();
    document.getElementById('customer-name').value = "";
    document.getElementById('customer-address').value = "";
    document.getElementById('customer-notes').value = "";
    cartDropdown.classList.remove("active");
}