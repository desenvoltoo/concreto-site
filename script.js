// ===== CONFIGURAÇÃO RÁPIDA =====
// Formato: código do país + DDD + número, somente dígitos.
const WHATSAPP_NUMBER = '5511956023851';
const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de solicitar um orçamento para minha obra.';

// Google Ads: informe aqui o valor no formato AW-XXXXXXXXX/XXXXXXXXXXXXXXX
// quando a ação de conversão de clique no WhatsApp estiver criada no Google Ads.
// Enquanto estiver vazio, o site continua funcionando normalmente e abre o WhatsApp.
const GOOGLE_ADS_SEND_TO = '';

function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function reportGoogleAdsConversion(url) {
  // Se a tag do Google Ads e o identificador da conversão estiverem configurados,
  // registra o clique e só então segue para o WhatsApp.
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

    // Evita que uma falha/bloqueio da tag impeça o WhatsApp de abrir.
    window.setTimeout(go, 800);
    return true;
  }

  window.location.href = url;
  return true;
}

const whatsappLinks = document.querySelectorAll('.js-whatsapp');
whatsappLinks.forEach((link) => {
  const message = link.dataset.message || DEFAULT_MESSAGE;
  const url = whatsappUrl(message);

  // A página de destino do Google Ads permanece sendo a landing page normal.
  // O WhatsApp só é acessado depois do clique do usuário.
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
