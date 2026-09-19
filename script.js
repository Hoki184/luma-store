const cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartBtn = document.querySelector(".cart-btn");
const cartBackdrop = document.getElementById("cartBackdrop");
const clearCartBtn = document.querySelector(".clear-cart-btn");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutButton = document.getElementById("checkoutButton");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const filterButtons = document.querySelectorAll(".filter-btn");
const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

let activeFilter = "all";

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


function updateCartUI() {
  if (cartCount) {
    cartCount.textContent = cart.length;
  }

  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
  }

  if (!cartItems || !cartTotal) {
    return;
  }

  let total = 0;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart-message">
        Ваш кошик порожній
      </p>
    `;    
  }

  cart.forEach(function (item, index) {
    total += item.price;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <span>${item.price} грн</span>
        <button class="remove-item" data-index="${index}">✕</button>
      </div>
    `;

    cartItems.appendChild(row);
  });

  cartTotal.textContent = total + " грн";
}

function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  updateCartUI();
}

function filterProducts() {
  const products = document.querySelectorAll(".product-card");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  products.forEach(function (product) {
    const name = product.dataset.name.toLowerCase();
    const category = product.dataset.category;
    const matchesSearch = name.includes(query);
    const matchesFilter = activeFilter === "all" || category === activeFilter;

    product.classList.toggle("hidden", !(matchesSearch && matchesFilter));
  });
}

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    addToCart(name, price);

    button.textContent = "Додано до кошика";
    button.classList.add("added");

    setTimeout(function () {
      button.textContent = "Додати в кошик";
      button.classList.remove("added");
    }, 2000);
  });
});

if (closeCart) {
  closeCart.addEventListener("click", function () {
    if (cartPanel) {
      cartPanel.classList.remove("open");
    }

    if (cartBackdrop) {
      cartBackdrop.classList.remove("open");
    }
  });
}

if (cartBackdrop) {
  cartBackdrop.addEventListener("click", function () {
    if (cartPanel) {
      cartPanel.classList.remove("open");
    }

    cartBackdrop.classList.remove("open");
  });
}

if (cartBtn) {
  cartBtn.addEventListener("click", function () {
    if (cartPanel) {
      cartPanel.classList.toggle("open");
    }
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", function () {
    cart.length = 0;
    saveCart();
    updateCartUI();
  });
}

if (cartItems) {
  cartItems.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-item")) {
      const index = Number(event.target.dataset.index);

      cart.splice(index, 1);
      saveCart();
      updateCartUI();
    }
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(checkoutForm);

    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const address = formData.get("address");

    if (!name || !phone || !email || !address) {
      alert("Заповніть всі поля форми");
      return;
    }

    if (cart.length === 0) {
      alert("Спочатку додайте товар у кошик");
      return;
    }

    alert("Дякуємо, " + name + "! Ваше замовлення оформлене.");
    cart.length = 0;
    saveCart();
    updateCartUI();
    checkoutForm.reset();

    if (cartPanel) {
      cartPanel.classList.remove("open");
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("input", filterProducts);
}

if (searchButton) {
  searchButton.addEventListener("click", function () {
    const shopSection = document.getElementById("shop");

    shopSection.scrollIntoView({
      behavior: "smooth"
    });

    searchInput.focus();
  });
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    activeFilter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.toggle("active", btn === button);
    });

    filterProducts();
  });
});

if (menuButton && mainNav) {
  menuButton.addEventListener("click", function () {
    mainNav.classList.toggle("open");
  });
}

if (mainNav) {
  const navLinks = mainNav.querySelectorAll("a");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
    });
  });
}

updateCartUI();
filterProducts();