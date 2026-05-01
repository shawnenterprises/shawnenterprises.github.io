let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartCount() {
  const count = getCartItemCount();
  document.querySelectorAll("#cart-count").forEach(el => {
    el.textContent = count;
  });
}

function addToCart(name, size, price, image) {
  const existingItem = cart.find(
    item => item.name === name && item.size === size
  );

  if (existingItem) {
    existingItem.qty += 1;
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

  if (typeof openCartDrawer === "function") {
    openCartDrawer();
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCartDrawer();
  renderCartPage();
}

function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartCount();
  renderCartDrawer();
  renderCartPage();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateShippingStatus(total) {
  const threshold = 70;
  const remaining = threshold - total;

  const statusText = document.getElementById("shippingStatusText");
  const progressBar = document.getElementById("shippingProgressBar");

  if (!statusText || !progressBar) return;

  if (total >= threshold) {
    statusText.textContent = "ELIGIBLE FOR FREE SHIPPING";
    progressBar.style.width = "100%";
  } else {
    statusText.textContent = `SPEND $${remaining.toFixed(2)} MORE AND GET FREE SHIPPING`;
    progressBar.style.width = `${Math.min((total / threshold) * 100, 100)}%`;
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cartDrawerItems");
  const totalEl = document.getElementById("cartDrawerTotal");

  if (!container || !totalEl) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p style="font-size:14px; color:#666;">Your cart is empty.</p>`;
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

function renderCartPage() {
  const container = document.getElementById("cartPageItems");
  const totalEl = document.getElementById("cartPageTotal");

  if (!container || !totalEl) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    totalEl.textContent = "0.00";
    return;
  }

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-page-row";

    row.innerHTML = `
      <div class="cart-page-product">
        <img src="${item.image}" alt="${item.name}" class="cart-page-image">
        <div>
          <p class="cart-page-name">${item.name}</p>
          <p class="cart-page-size">Size: ${item.size}</p>
          <p class="cart-page-price">$${item.price.toFixed(2)}</p>
        </div>
      </div>

      <div class="cart-page-qty">
        <button onclick="changeQty(${index}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>

      <div class="cart-page-line-total">
        $${(item.price * item.qty).toFixed(2)}
      </div>
    `;

    container.appendChild(row);
  });

  totalEl.textContent = getCartTotal().toFixed(2);
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

document.addEventListener("DOMContentLoaded", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCount();
  renderCartDrawer();
  renderCartPage();
});

cart.map(item => `
  <div class="cart-item">
    <img src="${item.image}">
    <div class="cart-item-info">
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-price">$${item.price}</div>
      <div class="cart-item-size">Size: ${item.size}</div>

      <div class="cart-qty">
        <button onclick="decreaseQty(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQty(${item.id})">+</button>
      </div>

      <div class="cart-remove" onclick="removeItem(${item.id})">
        Remove
      </div>
    </div>
  </div>
`).join("")
