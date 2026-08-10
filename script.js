// ===== CONFIGURAÇÃO RÁPIDA =====
// Troque apenas o número abaixo antes de publicar.
// Formato: código do país + DDD + número, somente dígitos.
const WHATSAPP_NUMBER = '5511999999999';
const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de solicitar um orçamento para minha obra.';

function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('.js-whatsapp').forEach((link) => {
  const message = link.dataset.message || DEFAULT_MESSAGE;
  link.href = whatsappUrl(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});