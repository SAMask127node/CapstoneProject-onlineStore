//-------------------------------------------------
//  tiny client‑side “store”  (localStorage)
//-------------------------------------------------
const STORAGE_KEY = 'petpalate_cart';

function getCart()        { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveCart(cart)   { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
function addToCart(item)  {
  const cart = getCart();
  const existing = cart.find(c => c.name === item.name);
  if (existing) existing.qty += 1;
  else cart.push({...item, qty:1});
  saveCart(cart);
  updateNavCount();
}

//-------------------------------------------------
//  helpers for every page
//-------------------------------------------------
function updateNavCount() {
  const count = getCart().reduce((sum,i)=>sum+i.qty,0);
  const el = document.querySelector('#nav‑count');
  if (el) el.textContent = count;
}

// run on every page load
updateNavCount();

//-------------------------------------------------
//  PAGE‑SPECIFIC LOGIC
//-------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  // --- index.html ---
  if (document.querySelector('#shop‑now')) {
    document.querySelector('#shop‑now').addEventListener('click', () => {
      window.location.href = 'products.html';
    });
  }

  // --- products.html ---
  if (document.querySelector('#product‑grid')) {
    // sample dataset
    const products = [
      {name:'Salmon Bites', price:29.99, img:'assets/images/salmon-bites.png'},
      {name:'Grain‑Free Turkey', price:34.99, img:'assets/images/grainfree-turkey.png'},
      {name:'Puppy Starter', price:22.99, img:'assets/images/puppy-starter.png'},
      {name:'Kitten Formula', price:18.99, img:'assets/images/kitten-formula.png'}
    ];

    const grid = document.getElementById('product‑grid');
    grid.innerHTML = products.map(p => `
      <div class="card">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">$${p.price.toFixed(2)}</p>
        <button data-name="${p.name}">Add to Cart</button>
      </div>`).join('');

    grid.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') {
        const name = e.target.dataset.name;
        const product = products.find(p => p.name === name);
        addToCart(product);
        alert('Added to cart!');
      }
    });
  }

  // --- cart.html ---
  if (document.querySelector('#cart‑list')) {
    renderCart();
    document.getElementById('checkout‑btn').addEventListener('click', () => {
      alert('Checkout successful!');
      saveCart([]);
      renderCart();
    });
  }

  // --- login.html ---
  if (document.getElementById('login‑form')) {
    document.getElementById('login‑form').addEventListener('submit', e => {
      e.preventDefault();
      alert('Pretend login successful 😊');
      window.location.href = 'index.html';
    });
  }

});

// helper used on cart page
function renderCart() {
  const list   = document.getElementById('cart‑list');
  const total  = document.getElementById('cart‑total');
  const cart   = getCart();

  if (!cart.length) {
    list.innerHTML = '<p style="margin-left:64px">Your cart is empty.</p>';
    total.textContent = '0.00';
    updateNavCount();
    return;
  }

  list.innerHTML = cart.map(item => `
      <li>
        <span>${item.name}</span>
        <span>x${item.qty} — $${(item.price*item.qty).toFixed(2)}</span>
      </li>`).join('');

  total.textContent = cart.reduce((sum,i)=>sum + i.price*i.qty, 0).toFixed(2);
  updateNavCount();
}