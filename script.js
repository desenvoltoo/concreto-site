// ===== CONFIGURAÇÃO RÁPIDA =====
// Formato: código do país + DDD + número, somente dígitos.
const WHATSAPP_NUMBER = '5511956023851';
const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de solicitar um orçamento para minha obra.';

// Google Ads: conversão "Lead - WhatsApp ConcretoBrasils".
const GOOGLE_ADS_SEND_TO = 'AW-18387900627/GyYTCIGm3OIcENOxhMBE';

function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function reportGoogleAdsConversion(url) {
  if (GOOGLE_ADS_SEND_TO && typeof window.gtag === 'function') {
    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      window.location.href = url;
    };

    window.gtag('event', 'conversion', {
      send_to: GOOGLE_ADS_SEND_TO,
      value: 1.0,
      currency: 'BRL',
      event_callback: go
    });

    window.setTimeout(go, 1000);
    return true;
  }

  window.location.href = url;
  return true;
}

const whatsappLinks = document.querySelectorAll('.js-whatsapp');
whatsappLinks.forEach((link) => {
  const message = link.dataset.message || DEFAULT_MESSAGE;
  const url = whatsappUrl(message);
  link.href = url;
  link.removeAttribute('target');
  link.removeAttribute('rel');

  link.addEventListener('click', (event) => {
    event.preventDefault();
    reportGoogleAdsConversion(url);
  });
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
