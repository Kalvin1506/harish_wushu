const body = document.body;
const overlay = document.querySelector('.overlay');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const modal = document.querySelector('#enquiry-modal');
const toast = document.querySelector('.toast');

function showToast(message) {
  toast.querySelector('p').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}
function closePanels() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('open');
  body.classList.remove('locked');
}
menuToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('locked', open);
});
document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  body.classList.remove('locked');
}));
document.querySelectorAll('.course-enquire').forEach(button => button.addEventListener('click', () => {
  modal.querySelector('[name="course"]').value = button.dataset.course;
  modal.querySelector('#modal-title').textContent = `Interested in ${button.dataset.course}?`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  body.classList.add('locked');
}));
document.querySelector('.modal-close').addEventListener('click', closePanels);
overlay.addEventListener('click', closePanels);
document.querySelector('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  showToast('Your callback request is confirmed');
  event.currentTarget.reset();
  closePanels();
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .1 });
document.querySelectorAll('.reveal:not(.visible)').forEach(element => observer.observe(element));
