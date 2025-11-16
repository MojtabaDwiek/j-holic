'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header sticky & back top btn active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = window.scrollY;
}

addEventOnElem(window, "scroll", headerSticky);



/**
 * scroll reveal effect
 */

const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.8 &&
      rect.bottom > window.innerHeight * 0.2;

    sections[i].classList.toggle("active", inView);
  }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);

document.querySelectorAll(".details-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;

    target.classList.toggle("active");

    const card = target.closest(".shop-card");
    if (card) {
      card.classList.toggle("details-open", target.classList.contains("active"));
    }
  });
});


/* ------------------------------
        CART SIDEBAR LOGIC
--------------------------------*/

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const openCartBtn = document.querySelector(".header-action-btn"); // your cart icon
const closeCartBtn = document.getElementById("closeCart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartBadge();
renderCart();

/* OPEN / CLOSE CART */
openCartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
});

closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
});

/* ADD TO CART BUTTONS */
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", function () {

    const item = {
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image,
      quantity: 1
    };

    const existing = cart.find(i => i.name === item.name);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push(item);
    }

    saveCart();
    updateCartBadge();
    renderCart();
  });
});

/* RENDER CART ITEMS */
function renderCart() {
  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.image}">
      <div class="cart-item-info">
        <p class="cart-item-title">${item.name}</p>
        <p class="cart-item-price">$${item.price} × ${item.quantity}</p>
      </div>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalEl.textContent = total.toFixed(2);

  // Remove item logic
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      saveCart();
      updateCartBadge();
      renderCart();
    });
  });
}

/* SAVE CART */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* UPDATE CART BADGE */
function updateCartBadge() {
  const badge = document.querySelector(".btn-badge");
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  badge.textContent = count;
}

/* WHATSAPP CHECKOUT */
const WHATSAPP_NUMBER = "96170123456"; // replace with your number

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let message = "🛒 *New Order*%0A%0A";

  cart.forEach((item, i) => {
    message += `${i + 1}) *${item.name}*%0AQty: ${item.quantity}%0APrice: $${item.price}%0A%0A`;
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  message += `*Total:* $${total.toFixed(2)}%0A%0A`;
  message += "Please confirm my order.";

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
});


// CATEGORY FILTER
const categoryBtns = document.querySelectorAll(".category-btn");
const productCards = document.querySelectorAll(".product-card");

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Button active state
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    let category = btn.dataset.category;

    productCards.forEach(card => {
      card.style.display =
        card.dataset.category.includes(category) ? "block" : "none";
    });
  });
});


/* -----------------------------------------
   LINK COLLECTION CARDS TO PRODUCT CATEGORIES
-------------------------------------------*/

document.querySelectorAll(".collection-card").forEach(card => {
  card.addEventListener("click", () => {

    const category = card.dataset.category; // get category

    // Activate correct category button
    const targetBtn = document.querySelector(`.category-btn[data-category="${category}"]`);

    if (targetBtn) {
      // remove active from all
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));

      // set active
      targetBtn.classList.add("active");

      // Filter products
      const productCards = document.querySelectorAll(".product-card");
      productCards.forEach(product => {
        product.style.display =
          product.dataset.category.includes(category) ? "block" : "none";
      });
    }

    // Scroll to shop section
    document.querySelector("#shop").scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });

  });
});


/**
 * Hero slider drag support with infinite scroll
 */

const heroSlider = document.querySelector(".hero .has-scrollbar");

if (heroSlider) {
  const originalSlides = Array.from(heroSlider.children);

  if (originalSlides.length > 1) {
    const beforeFragment = document.createDocumentFragment();
    const afterFragment = document.createDocumentFragment();

    // Clone slides on both sides to fake an endless track
    for (let i = originalSlides.length - 1; i >= 0; i--) {
      beforeFragment.appendChild(originalSlides[i].cloneNode(true));
    }

    originalSlides.forEach(slide => {
      afterFragment.appendChild(slide.cloneNode(true));
    });

    heroSlider.prepend(beforeFragment);
    heroSlider.append(afterFragment);

    const getSlideWidth = () => {
      const sample = heroSlider.querySelector(".scrollbar-item");
      return sample ? sample.offsetWidth : heroSlider.offsetWidth;
    };

    const slideCount = originalSlides.length;
    let slideWidth = getSlideWidth();
    let baseOffset = slideWidth * slideCount;

    const normalizeIndex = () => {
      if (!slideWidth) return 0;
      return (heroSlider.scrollLeft - baseOffset) / slideWidth;
    };

    const syncToMiddle = (index = 0) => {
      heroSlider.scrollLeft = baseOffset + index * slideWidth;
    };

    if (slideWidth) {
      syncToMiddle();
    }

    const updateMeasurements = () => {
      const currentIndex = normalizeIndex();
      const width = getSlideWidth();

      if (!width) return;

      slideWidth = width;
      baseOffset = slideWidth * slideCount;
      syncToMiddle(currentIndex);
    };

    window.addEventListener("load", updateMeasurements);
    window.addEventListener("resize", updateMeasurements);

    let isPointerDown = false;
    let startX = 0;
    let scrollStart = 0;
    let activePointer = null;

    const stopDrag = () => {
      if (!isPointerDown) return;

      isPointerDown = false;
      heroSlider.classList.remove("is-dragging");

      if (activePointer !== null && heroSlider.hasPointerCapture(activePointer)) {
        heroSlider.releasePointerCapture(activePointer);
      }

      activePointer = null;
    };

    heroSlider.addEventListener("pointerdown", event => {
      isPointerDown = true;
      startX = event.clientX;
      scrollStart = heroSlider.scrollLeft;
      activePointer = event.pointerId;

      heroSlider.classList.add("is-dragging");
      heroSlider.setPointerCapture(activePointer);
    });

    heroSlider.addEventListener("pointermove", event => {
      if (!isPointerDown) return;

      event.preventDefault();
      heroSlider.scrollLeft = scrollStart - (event.clientX - startX);
    });

    heroSlider.addEventListener("pointerup", stopDrag);
    heroSlider.addEventListener("pointercancel", stopDrag);
    heroSlider.addEventListener("pointerleave", stopDrag);

    const handleInfiniteScroll = () => {
      const totalWidth = slideWidth * slideCount;

      if (!totalWidth) return;

      if (heroSlider.scrollLeft <= slideWidth) {
        heroSlider.scrollLeft += totalWidth;
      } else {
        const maxScroll = baseOffset + totalWidth * 2 - slideWidth;

        if (heroSlider.scrollLeft >= maxScroll) {
          heroSlider.scrollLeft -= totalWidth;
        }
      }
    };

    heroSlider.addEventListener("scroll", handleInfiniteScroll);
  }
}
