let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, size) {
  cart.push({ name, size, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("SUPPLY ADDED");
}

function updateCartCount() {
  document.querySelectorAll("#cart-count").forEach(el => {
    el.innerText = cart.length;
  });
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

updateCartCount();
