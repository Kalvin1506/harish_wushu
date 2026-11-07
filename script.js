const body = document.body;
const overlay = document.querySelector('.overlay');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const cartDrawer = document.querySelector('.cart-drawer');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const modal = document.querySelector('#enquiry-modal');
const toast = document.querySelector('.toast');
let cart = [];

function money(value) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value); }
function lock(yes = true) { body.classList.toggle('locked', yes); overlay.classList.toggle('open', yes); }
function closePanels() {
  cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden', 'true');
  modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
  if (!mobileMenu.classList.contains('open')) lock(false);
}

menuToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open)); mobileMenu.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('locked', open);
});
document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); lock(false);
}));

document.querySelector('.cart-button').addEventListener('click', () => { cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden', 'false'); lock(true); });
document.querySelector('.cart-close').addEventListener('click', closePanels);
overlay.addEventListener('click', () => { mobileMenu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); closePanels(); });

function showToast(message) { toast.querySelector('p').textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function addToCart(name, price, type = 'GEAR') {
  const found = cart.find(item => item.name === name);
  if (found) found.qty += 1; else cart.push({ name, price: Number(price), qty: 1, type });
  renderCart(); showToast(`${name} added to your bag`);
}
function renderCart() {
  const quantity = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = quantity;
  cartTotal.textContent = money(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart"><span>SB</span><h3>Your bag is feeling light.</h3><p>Add training gear or an ebook to get started.</p></div>'; return;
  }
  cartItems.innerHTML = cart.map((item, i) => `<div class="cart-line"><div class="cart-line-icon">${item.type === 'EBOOK' ? 'PDF' : 'SB'}</div><div><h4>${item.name}</h4><p>${item.type} · Qty ${item.qty} · ${money(item.price)}</p></div><button data-remove="${i}" aria-label="Remove ${item.name}">×</button></div>`).join('');
  cartItems.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}
document.querySelectorAll('.quick-add').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.name, button.dataset.price)));
document.querySelectorAll('.ebook-buy').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.name, button.dataset.price, 'EBOOK')));

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active')); button.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => card.classList.toggle('hidden', button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter));
}));

document.querySelectorAll('.course-enquire').forEach(button => button.addEventListener('click', () => {
  modal.querySelector('[name="course"]').value = button.dataset.course;
  modal.querySelector('#modal-title').textContent = `Interested in ${button.dataset.course}?`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); lock(true);
}));
document.querySelector('.modal-close').addEventListener('click', closePanels);

function successForm(form, message) {
  const submit = form.querySelector('button[type="submit"]'); const original = submit.innerHTML;
  submit.innerHTML = 'You’re all set ✓'; submit.disabled = true; showToast(message); form.reset();
  setTimeout(() => { submit.innerHTML = original; submit.disabled = false; if (form.id === 'enquiry-form') closePanels(); }, 2200);
}
document.querySelector('#class-form').addEventListener('submit', e => { e.preventDefault(); successForm(e.currentTarget, 'Your free class request is confirmed'); });
document.querySelector('#enquiry-form').addEventListener('submit', e => { e.preventDefault(); successForm(e.currentTarget, 'Your callback request is confirmed'); });
document.querySelector('#newsletter-form')?.addEventListener('submit', e => { e.preventDefault(); successForm(e.currentTarget, 'Welcome to the Slim Build newsletter'); });
document.querySelector('.checkout-button').addEventListener('click', () => showToast(cart.length ? 'Checkout is ready for payment integration' : 'Add an item before checkout'));
document.querySelector('.video-trigger').addEventListener('click', () => showToast('Brand story video ready for your final media'));

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
