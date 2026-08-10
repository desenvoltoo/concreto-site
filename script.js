// ===== CONFIGURAÇÃO RÁPIDA =====
// Formato: código do país + DDD + número, somente dígitos.
const WHATSAPP_NUMBER = '5511957196179';
const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de solicitar um orçamento para minha obra.';

function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const whatsappLinks = document.querySelectorAll('.js-whatsapp');
whatsappLinks.forEach((link) => {
  const message = link.dataset.message || DEFAULT_MESSAGE;
  link.href = whatsappUrl(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function closeMenu() {
  nav?.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
}

function openMenu() {
  nav?.classList.add('open');
  toggle?.setAttribute('aria-expanded', 'true');
  toggle?.setAttribute('aria-label', 'Fechar menu');
  document.body.classList.add('menu-open');
}

toggle?.addEventListener('click', () => {
  nav?.classList.contains('open') ? closeMenu() : openMenu();
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMenu();
});

document.addEventListener('click', (event) => {
  if (window.innerWidth > 980 || !nav?.classList.contains('open')) return;
  const target = event.target;
  if (target instanceof Node && !nav.contains(target) && !toggle?.contains(target)) closeMenu();
});
