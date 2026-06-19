// Cake data - matches your services.html + price table
const CAKES = [
  {
    id: 'custom',
    name: 'Custom Celebration Cake',
    price: 1250,
    leadTime: '7 days',
    img: 'images/dicson-cTQno9SZGcg-unsplash.png',
    desc: 'Designed around your theme, colours, and style.'
  },
  {
    id: 'luxury',
    name: 'Luxury Cake',
    price: 900,
    leadTime: '5 days',
    img: 'images/deva-williamson-5d2c-CvaBPk-unsplash.png',
    desc: 'Finest imported ingredients + exquisite designs.'
  },
  {
    id: 'bento',
    name: 'Bento Cake',
    price: 200,
    leadTime: '2 days',
    img: 'images/rehina-sultanova-rIiGJGOPLIw-unsplash.png',
    desc: 'Small, beautifully presented cakes for gifting.'
  }
];

// Cart storage - keeps items even after refresh
let cart = JSON.parse(localStorage.getItem('ldpCart')) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('ldpCart', JSON.stringify(cart));
}

// Add "Add to Cart" buttons to service cards
function injectCartButtons() {
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach((card, index) => {
    if (!CAKES[index]) return;

    const cake = CAKES[index];
    const body = card.querySelector('.service-card-body');

    // Add price + button if not already there
    if (!card.querySelector('.add-to-cart-btn')) {
      const priceDiv = document.createElement('div');
      priceDiv.style.marginTop = '1.5rem';
      priceDiv.innerHTML = `
        <p class="price-highlight" style="margin-bottom:0.8rem;">From R ${cake.price.toLocaleString()}</p>
        <button class="btn-gold add-to-cart-btn" data-id="${cake.id}">Add to Cart</button>
      `;
      body.appendChild(priceDiv);
    }
  });

  // Add click listeners
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      addToCart(id);
    });
  });
}

// Add item to cart
function addToCart(id) {
  const cake = CAKES.find(c => c.id === id);
  if (!cake) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({...cake, qty: 1});
  }

  saveCart();
  renderCart();
  showCart();

  // Button feedback
  const btn = document.querySelector(`[data-id="${id}"]`);
  const original = btn.textContent;
  btn.textContent = 'Added ✓';
  btn.style.background = 'var(--dark)';
  btn.style.color = 'var(--gold)';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--dark)';
  }, 1000);
}

// Create cart sidebar HTML - matches your dark + gold theme
function createCartHTML() {
  if (document.getElementById('ldp-cart')) return;

  const cartHTML = `
    <div id="ldp-cart" style="
      position:fixed;
      top:0;
      right:-400px;
      width:380px;
      max-width:90vw;
      height:100vh;
      background:var(--dark);
      border-left:2px solid var(--gold);
      z-index:9999;
      transition:right 0.4s var(--ease);
      display:flex;
      flex-direction:column;
      font-family:var(--sans);
    ">
      <div style="padding:2rem; border-bottom:1px solid rgba(201,149,90,0.3); display:flex; justify-content:space-between; align-items:center;">
        <h3 style="color:var(--sand-lt); font-family:var(--serif); font-style:italic; margin:0;">Your Order</h3>
        <button id="close-cart" style="background:none; border:none; color:var(--gold); font-size:1.5rem; cursor:pointer;">×</button>
      </div>

      <div id="cart-items" style="flex:1; overflow-y:auto; padding:2rem;"></div>

      <div style="padding:2rem; border-top:1px solid rgba(201,149,90,0.3); background:rgba(0,0,0,0.2);">
        <div style="display:flex; justify-content:space-between; margin-bottom:1rem; color:var(--sand-lt); font-size:0.9rem;">
          <span>Subtotal:</span>
          <span id="cart-total">R 0</span>
        </div>
        <p style="color:var(--pale); font-size:0.75rem; opacity:0.7; margin-bottom:1rem;">Final price confirmed after enquiry. Prices vary by size/design.</p>
        <button id="checkout-btn" class="btn-gold" style="width:100%;">Buy Online → Enquiry</button>
      </div>
    </div>

    <div id="cart-overlay" style="
      position:fixed;
      top:0;
      left:0;
      width:100vw;
      height:100vh;
      background:rgba(0,0,0,0.5);
      z-index:9998;
      opacity:0;
      pointer-events:none;
      transition:opacity 0.3s;
    "></div>
  `;

  document.body.insertAdjacentHTML('beforeend', cartHTML);

  document.getElementById('close-cart').onclick = hideCart;
  document.getElementById('cart-overlay').onclick = hideCart;
  document.getElementById('checkout-btn').onclick = checkout;
}

// Render cart items
function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  if (cart.length === 0) {
    container.innerHTML = `<p style="color:var(--pale); text-align:center; margin-top:3rem; opacity:0.6;">Your cart is empty<br><span style="font-size:0.8rem;">Add cakes from Services page</span></p>`;
    totalEl.textContent = 'R 0';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div style="margin-bottom:1.5rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(201,149,90,0.15);">
      <div style="display:flex; gap:1rem; align-items:start;">
        <img src="${item.img}" alt="${item.name}" style="width:60px; height:60px; object-fit:cover; border:1px solid var(--sand-lt);">
        <div style="flex:1;">
          <h4 style="color:var(--sand-lt); font-size:0.9rem; margin:0 0 0.3rem; font-family:var(--cond);">${item.name}</h4>
          <p style="color:var(--gold); font-size:0.8rem; margin:0;">R ${item.price.toLocaleString()} × ${item.qty}</p>
          <p style="color:var(--pale); font-size:0.7rem; opacity:0.6; margin:0.2rem 0 0;">Lead: ${item.leadTime}</p>
        </div>
        <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:var(--gold); cursor:pointer; font-size:1.2rem; padding:0;">×</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  totalEl.textContent = `R ${total.toLocaleString()}`;
}

// Remove from cart
window.removeFromCart = function(id) {
  cart = cart.filter(item => item.id!== id);
  saveCart();
  renderCart();
}

// Show/hide cart
function showCart() {
  document.getElementById('ldp-cart').style.right = '0';
  document.getElementById('cart-overlay').style.opacity = '1';
  document.getElementById('cart-overlay').style.pointerEvents = 'auto';
}

function hideCart() {
  document.getElementById('ldp-cart').style.right = '-400px';
  document.getElementById('cart-overlay').style.opacity = '0';
  document.getElementById('cart-overlay').style.pointerEvents = 'none';
}

// Checkout → Fill enquiries form + redirect
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty. Add some cakes first!');
    return;
  }

  // Save cart to sessionStorage for enquiries page
  sessionStorage.setItem('ldpCheckout', JSON.stringify(cart));

  // Redirect to enquiries page
  window.location.href = 'enquiries.html';
}

// Auto-fill enquiries form if coming from checkout
function autofillEnquiry() {
  const checkoutData = sessionStorage.getItem('ldpCheckout');
  if (!checkoutData) return;

  const items = JSON.parse(checkoutData);
  const typeSelect = document.getElementById('enq-type');
  const designTextarea = document.getElementById('enq-design');

  if (typeSelect && items.length > 0) {
    // Select first item type
    typeSelect.value = items[0].id;
  }

  if (designTextarea) {
    const summary = items.map(i => `${i.qty}x ${i.name} - R ${i.price.toLocaleString()} each`).join('\n');
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    designTextarea.value = `Order from Cart:\n${summary}\n\nSubtotal: R ${total.toLocaleString()}\n\n[Please confirm final quote based on size & design details]`;
  }

  // Clear session storage after filling
  sessionStorage.removeItem('ldpCheckout');

  // Scroll to form
  document.querySelector('.enq-form')?.scrollIntoView({ behavior: 'smooth' });
}

//Add floating cart icon to all pages
function addCartIcon() {
  if (document.getElementById('cart-icon')) return;

  const icon = document.createElement('button');
  icon.id = 'cart-icon';
  icon.innerHTML = `🛒 <span id="cart-count">0</span>`;
  icon.style.cssText = `
    position:fixed;
    bottom:2rem;
    right:2rem;
    background:var(--gold);
    color:var(--dark);
    border:none;
    border-radius:50px;
    padding:1rem 1.5rem;
    font-family:var(--sans);
    font-size:0.7rem;
    letter-spacing:0.1em;
    text-transform:uppercase;
    cursor:pointer;
    z-index:9997;
    box-shadow:0 4px 20px rgba(0,0,0,0.3);
    transition:all 0.3s var(--ease);
  `;

  icon.onmouseover = () => icon.style.transform = 'translateY(-3px)';
  icon.onmouseout = () => icon.style.transform = 'translateY(0)';
  icon.onclick = () => {
    renderCart();
    showCart();
  };

  document.body.appendChild(icon);
  updateCartCount();
}

// Update cart count badge
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
}

// Lightbox Gallery for cake images
function initLightbox() {
  const images = document.querySelectorAll('.service-card img, .gallery img');
  
  images.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.style.cssText = `
        position:fixed; top:0; left:0; width:100vw; height:100vh;
        background:rgba(0,0,0,0.9); z-index:10000; display:flex;
        align-items:center; justify-content:center; cursor:pointer;
      `;
      lightbox.innerHTML = `
        <img src="${img.src}" style="max-width:90%; max-height:90%; border:3px solid var(--gold);">
        <span style="position:absolute; top:2rem; right:3rem; color:var(--gold); font-size:3rem;">×</span>
      `;
      lightbox.onclick = () => lightbox.remove();
      document.body.appendChild(lightbox);
    });
  });
}

// Form Validation for enquiries and contact
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const errors = [];

    // Name validation
    const name = form.querySelector('input[name="name"], #enq-name');
    if (name && name.value.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
      valid = false;
    }

    // Email validation
    const email = form.querySelector('input[type="email"], #enq-email');
    if (email && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Enter a valid email address');
      valid = false;
    }

    // Phone validation
    const phone = form.querySelector('input[type="tel"], #enq-phone');
    if (phone && !phone.value.match(/^[0-9+\s()-]{10,}$/)) {
      errors.push('Enter a valid phone number');
      valid = false;
    }

    // Show errors or submit
    if (!valid) {
      alert('Please fix these errors:\n\n' + errors.join('\n'));
    } else {
      alert('Thank you! Your enquiry has been sent. We will contact you within 24 hours.');
      form.reset();
      // For real site: form.submit() or AJAX here
    }
  });
}

validateForm('enquiry-form');
validateForm('contact-form');

// Search + Filter for services page
function initSearch() {
  const searchInput = document.getElementById('cake-search');
  const cards = document.querySelectorAll('.service-card');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? 'block' : 'none';
    });
  });
}
initSearch();

// Init - runs on page load
document.addEventListener('DOMContentLoaded', () => {
  createCartHTML();
  addCartIcon();
  injectCartButtons();
  renderCart();
  updateCartCount();
  autofillEnquiry();
  initLightbox();
});

// Update count whenever cart changes
const originalSaveCart = saveCart;
saveCart = function() {
  originalSaveCart();
  updateCartCount();
}

// AJAX-style form submission for enquiries.html
document.querySelector('form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thank you! Your enquiry has been submitted. We will contact you soon.');
  this.reset();
});