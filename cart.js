let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  document.querySelectorAll("#cart-count").forEach(el => {
    el.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  });
}

function addToCart(name, size, price, image) {
  const existing = cart.find(item => item.name === name && item.size === size);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name,
      size,
      price,
      image,
      qty: 1
    });
  }

  saveCart();
  updateCartCount();
  renderCartDrawer();
  openCartDrawer();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCartDrawer();
}

function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartCount();
  renderCartDrawer();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateShippingStatus(total) {
  const freeShippingThreshold = 75;
  const remaining = freeShippingThreshold - total;

  const statusText = document.getElementById("shippingStatusText");
  const progressBar = document.getElementById("shippingProgressBar");

  if (!statusText || !progressBar) return;

  if (total >= freeShippingThreshold) {
    statusText.textContent = "ELIGIBLE FOR FREE SHIPPING";
    progressBar.style.width = "100%";
  } else {
    statusText.textContent = `SPEND $${remaining.toFixed(2)} MORE AND GET FREE SHIPPING`;
    const progressPercent = Math.min((total / freeShippingThreshold) * 100, 100);
    progressBar.style.width = `${progressPercent}%`;
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cartDrawerItems");
  const totalEl = document.getElementById("cartDrawerTotal");

  if (!container || !totalEl) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <p style="font-size:14px; color:#666; margin:10px 0 0;">
        Your cart is empty.
      </p>
    `;
    totalEl.textContent = "0.00";
    updateShippingStatus(0);
    return;
  }

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">

      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <p class="cart-item-size">Size: ${item.size}</p>

        <div class="cart-item-controls">
          <div class="qty-box">
            <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
          </div>

          <button class="remove-btn" onclick="removeItem(${index})">🗑</button>
        </div>
      </div>
    `;

    container.appendChild(row);
  });

  const total = getCartTotal();
  totalEl.textContent = total.toFixed(2);
  updateShippingStatus(total);
}

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");

  if (drawer) drawer.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");

  if (drawer) drawer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function checkout() {
  window.location.href = "cart.html";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartDrawer();
});
