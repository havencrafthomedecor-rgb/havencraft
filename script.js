/* ===================================
   HAVENCRAFT ADVANCED CART ENGINE
   Brand Level E-commerce System
=================================== */

/* =============================
   GLOBAL CART STATE
============================= */

let cart = JSON.parse(localStorage.getItem("havencraft_cart")) || [];

/* =============================
   SAVE CART
============================= */

function saveCart() {
    localStorage.setItem("havencraft_cart", JSON.stringify(cart));
    updateCartCount();
}

/* =============================
   UPDATE CART COUNT (Navbar)
============================= */

function updateCartCount() {
    const countElement = document.getElementById("cart-count");
    if (countElement) {
        let totalItems = 0;
        cart.forEach(item => totalItems += item.quantity);
        countElement.innerText = totalItems;
    }
}

/* =============================
   ADD TO CART
============================= */

function addToCart(name, price) {

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    showNotification(name + " added to cart!");
}

/* =============================
   REMOVE FROM CART
============================= */

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

/* =============================
   CHANGE QUANTITY
============================= */

function changeQuantity(index, delta) {
    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        removeFromCart(index);
        return;
    }

    saveCart();
    renderCart();
}

/* =============================
   CALCULATE TOTAL
============================= */

function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    return total;
}

/* =============================
   RENDER CART PAGE
============================= */

function renderCart() {

    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalElement.innerText = "0";
        return;
    }

    cart.forEach((item, index) => {

        let div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-info">
                <h3>${item.name}</h3>
                <p>${item.price}৳</p>
            </div>

            <div class="cart-qty">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>

            <div class="cart-remove">
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;

        container.appendChild(div);
    });

    totalElement.innerText = calculateTotal();
}

/* =============================
   WHATSAPP ORDER SYSTEM
============================= */

function orderViaWhatsApp() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "🛍️ *HavenCraft Order* %0A%0A";

    cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - ${item.price * item.quantity}৳ %0A`;
    });

    message += `%0A💰 Total: ${calculateTotal()}৳`;
    message += `%0A%0APlease confirm my order.`;

    let phone = "8801XXXXXXXXX"; // <-- এখানে তোমার নাম্বার দাও

    let url = `https://wa.me/${phone}?text=${message}`;

    window.open(url, "_blank");
}

/* =============================
   CLEAR CART
============================= */

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

/* =============================
   BEAUTIFUL NOTIFICATION
============================= */

function showNotification(text) {

    let note = document.createElement("div");
    note.className = "toast";
    note.innerText = text;

    document.body.appendChild(note);

    setTimeout(() => {
        note.classList.add("show");
    }, 100);

    setTimeout(() => {
        note.classList.remove("show");
        setTimeout(() => {
            note.remove();
        }, 300);
    }, 2500);
}

/* =============================
   INIT
============================= */

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    renderCart();
});