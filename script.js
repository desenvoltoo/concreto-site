// ===== CONFIGURAÇÃO RÁPIDA =====
const WHATSAPP_NUMBER = '5511956023851';
const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de solicitar um orçamento para minha obra.';
const GOOGLE_ADS_ID = 'AW-18387900627';
const GOOGLE_ADS_SEND_TO = 'AW-18387900627/GyYTCIGm3OIcENOxhMBE';

// ===== CABEÇALHO GLOBAL ÚNICO =====
function getHeaderActivePage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return 'inicio';
  if (path === '/produtos' || path === '/concreto-usinado' || path === '/bombeamento-de-concreto') return 'produtos';
  if (path === '/sobre') return 'sobre';
  if (path === '/orcamento') return 'orcamento';
  return '';
}

function installGlobalHeader() {
  const active = getHeaderActivePage();
  const current = (name) => active === name ? ' aria-current="page"' : '';

  if (!document.getElementById('cb-global-header-style')) {
    const style = document.createElement('style');
    style.id = 'cb-global-header-style';
    style.textContent = `
      :root{--cb-header-orange:#f05a28;--cb-header-ink:#15202a;--cb-header-muted:#44515d}
      .cb-site-header{position:sticky!important;top:0!important;z-index:1000!important;width:100%!important;background:rgba(255,255,255,.94)!important;border-bottom:1px solid rgba(15,24,33,.07)!important;backdrop-filter:saturate(170%) blur(18px)!important;-webkit-backdrop-filter:saturate(170%) blur(18px)!important;box-shadow:none!important;transition:background .22s ease,box-shadow .22s ease!important}
      .cb-site-header.cb-scrolled{background:rgba(255,255,255,.985)!important;box-shadow:0 14px 36px rgba(15,24,33,.09)!important}
      .cb-topbar{display:block!important;background:#0d151d!important;color:#c7d0d7!important;font-family:Inter,Arial,sans-serif!important;font-size:11px!important;line-height:1!important}
      .cb-topbar-inner{height:32px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:20px!important}
      .cb-topbar span{display:inline!important;color:#c7d0d7!important}
      .cb-topbar a{color:#fff!important;font-size:11px!important;font-weight:800!important;letter-spacing:.02em!important;text-decoration:none!important}
      .cb-nav-row{height:78px!important;display:flex!important;align-items:center!important;gap:30px!important;position:relative!important}
      .cb-brand{display:inline-flex!important;align-items:center!important;gap:11px!important;flex:0 0 auto!important;text-decoration:none!important;color:inherit!important}
      .cb-brand-mark{display:flex!important;align-items:flex-end!important;gap:3px!important;height:35px!important}
      .cb-brand-mark i{display:block!important;width:8px!important;background:var(--cb-header-orange)!important;transform:skew(-18deg)!important;border-radius:1px!important}
      .cb-brand-mark i:nth-child(1){height:21px!important}.cb-brand-mark i:nth-child(2){height:28px!important}.cb-brand-mark i:nth-child(3){height:35px!important}
      .cb-brand-copy{display:flex!important;flex-direction:column!important;line-height:.92!important}
      .cb-brand-copy strong{font-family:Montserrat,Inter,sans-serif!important;font-size:17px!important;font-weight:800!important;letter-spacing:.04em!important;color:#18232f!important}
      .cb-brand-copy small{display:block!important;font-family:Inter,Arial,sans-serif!important;font-size:9px!important;line-height:1!important;letter-spacing:.34em!important;color:var(--cb-header-orange)!important;font-weight:900!important;margin-top:6px!important}
      .cb-menu{margin-left:auto!important;display:flex!important;align-items:center!important;gap:6px!important;position:static!important;transform:none!important;opacity:1!important;visibility:visible!important;background:transparent!important;padding:0!important;box-shadow:none!important}
      .cb-menu>a{position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:42px!important;padding:0 13px!important;border-radius:999px!important;color:var(--cb-header-muted)!important;background:transparent!important;font-family:Inter,Arial,sans-serif!important;font-size:13px!important;font-weight:750!important;line-height:1!important;text-decoration:none!important;transition:color .18s ease,background .18s ease!important}
      .cb-menu>a:hover{color:var(--cb-header-orange)!important;background:#fff3ee!important}
      .cb-menu>a[aria-current="page"]{color:var(--cb-header-orange)!important;background:#fff0e9!important}
      .cb-menu>a[aria-current="page"]::after{content:""!important;position:absolute!important;left:14px!important;right:14px!important;bottom:5px!important;height:2px!important;border-radius:999px!important;background:var(--cb-header-orange)!important}
      .cb-menu-mobile-cta{display:none!important}
      .cb-budget{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-height:46px!important;padding:0 20px!important;border:0!important;border-radius:999px!important;background:#15202a!important;color:#fff!important;font-family:Inter,Arial,sans-serif!important;font-size:12px!important;font-weight:850!important;line-height:1!important;text-transform:uppercase!important;letter-spacing:.04em!important;text-decoration:none!important;box-shadow:0 10px 25px rgba(15,24,33,.13)!important;transition:transform .18s ease,box-shadow .18s ease!important}
      .cb-budget:hover{transform:translateY(-1px)!important;box-shadow:0 14px 30px rgba(15,24,33,.18)!important}
      .cb-menu-toggle{display:none!important;width:46px!important;height:46px!important;padding:0!important;border:0!important;border-radius:14px!important;background:#f3f5f6!important;align-items:center!important;justify-content:center!important;flex-direction:column!important;gap:5px!important;cursor:pointer!important;box-shadow:none!important}
      .cb-menu-toggle i{display:block!important;width:21px!important;height:2px!important;background:#15202a!important;border-radius:999px!important;transition:transform .2s ease,opacity .2s ease!important}
      .cb-menu-toggle[aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)!important}.cb-menu-toggle[aria-expanded="true"] i:nth-child(2){opacity:0!important}.cb-menu-toggle[aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)!important}
      @media(max-width:980px){
        .cb-topbar{display:none!important}
        .cb-nav-row{height:70px!important;gap:14px!important}
        .cb-budget{margin-left:auto!important}
        .cb-menu-toggle{display:flex!important;flex:0 0 46px!important}
        .cb-menu{position:fixed!important;left:0!important;right:0!important;top:70px!important;bottom:0!important;margin:0!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:6px!important;padding:20px 18px calc(24px + env(safe-area-inset-bottom))!important;background:rgba(255,255,255,.99)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;transform:translateX(100%)!important;opacity:0!important;visibility:hidden!important;transition:transform .24s ease,opacity .24s ease!important;overflow:auto!important;z-index:1001!important}
        .cb-menu.cb-open{transform:translateX(0)!important;opacity:1!important;visibility:visible!important}
        .cb-menu>a{min-height:56px!important;justify-content:flex-start!important;padding:0 16px!important;border-radius:14px!important;font-size:17px!important}
        .cb-menu>a[aria-current="page"]::after{display:none!important}
        .cb-menu-mobile-cta{display:flex!important;margin-top:10px!important;background:#15202a!important;color:#fff!important;justify-content:center!important}
      }
      @media(max-width:650px){
        .cb-nav-row{height:66px!important}
        .cb-brand{gap:9px!important}.cb-brand-mark{height:29px!important}.cb-brand-mark i{width:7px!important}.cb-brand-mark i:nth-child(1){height:18px!important}.cb-brand-mark i:nth-child(2){height:23px!important}.cb-brand-mark i:nth-child(3){height:29px!important}
        .cb-brand-copy strong{font-size:14px!important}.cb-brand-copy small{font-size:7px!important;letter-spacing:.3em!important;margin-top:5px!important}
        .cb-budget{display:none!important}.cb-menu-toggle{margin-left:auto!important;width:44px!important;height:44px!important;flex-basis:44px!important}
        .cb-menu{top:66px!important;padding:18px 16px calc(20px + env(safe-area-inset-bottom))!important}
      }
    `;
    document.head.appendChild(style);
  }

  const markup = `
    <header class="cb-site-header" id="cb-site-header">
      <div class="cb-topbar">
        <div class="container cb-topbar-inner">
          <span>Concreto usinado e bombeamento para obras residenciais, comerciais e industriais</span>
          <a href="/orcamento/">Solicitar orçamento <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div class="container cb-nav-row">
        <a class="cb-brand" href="/" aria-label="Concreto Brasil - início">
          <span class="cb-brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="cb-brand-copy"><strong>CONCRETO</strong><small>BRASIL</small></span>
        </a>
        <nav class="cb-menu" id="cb-global-menu" aria-label="Navegação principal">
          <a href="/"${current('inicio')}>Início</a>
          <a href="/produtos/"${current('produtos')}>Produtos</a>
          <a href="/sobre/"${current('sobre')}>Sobre</a>
          <a href="/#faq">Dúvidas</a>
          <a class="cb-menu-mobile-cta" href="/orcamento/"${current('orcamento')}>Solicitar orçamento</a>
        </nav>
        <a class="cb-budget" href="/orcamento/"${current('orcamento')}>Orçamento</a>
        <button class="cb-menu-toggle" type="button" aria-label="Abrir menu" aria-controls="cb-global-menu" aria-expanded="false"><i></i><i></i><i></i></button>
      </div>
    </header>`;

  const oldHeader = document.querySelector('header');
  if (oldHeader) oldHeader.outerHTML = markup;
  else {
    const main = document.querySelector('main');
    if (main) main.insertAdjacentHTML('beforebegin', markup);
    else document.body.insertAdjacentHTML('afterbegin', markup);
  }
}

installGlobalHeader();

// ===== GOOGLE ADS =====
function ensureGoogleTag() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GOOGLE_ADS_ID);
  }
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(script);
  }
}
ensureGoogleTag();

function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function normalizeBrazilPhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('55') && digits.length >= 12) return `+${digits}`;
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  return null;
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
  return { firstName: parts[0] || '', lastName: parts.length > 1 ? parts.slice(1).join(' ') : '' };
}

function setEnhancedConversionUserData({ name, phone }) {
  if (typeof window.gtag !== 'function') return false;
  const phoneNumber = normalizeBrazilPhone(phone);
  if (!phoneNumber) return false;
  const { firstName, lastName } = splitName(name);
  const userData = { phone_number: phoneNumber };
  if (firstName || lastName) {
    userData.address = {
      ...(firstName ? { first_name: firstName } : {}),
      ...(lastName ? { last_name: lastName } : {}),
      country: 'BR'
    };
  }
  window.gtag('set', 'user_data', userData);
  return true;
}

function reportGoogleAdsConversion(url, userData = null) {
  if (userData) setEnhancedConversionUserData(userData);
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
    window.setTimeout(go, 1200);
    return true;
  }
  window.location.href = url;
  return true;
}

// ===== FORMULÁRIO =====
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  const nameInput = quoteForm.querySelector('[name="name"]');
  const phoneInput = quoteForm.querySelector('[name="phone"]');
  const errorBox = quoteForm.querySelector('.form-error');

  phoneInput?.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 10) phoneInput.value = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    else if (digits.length > 6) phoneInput.value = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    else if (digits.length > 2) phoneInput.value = digits.replace(/(\d{2})(\d+)/, '($1) $2');
    else if (digits.length) phoneInput.value = digits.replace(/(\d{0,2})/, '($1');
  });

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const normalizedPhone = normalizeBrazilPhone(phone);
    if (name.length < 2 || !normalizedPhone) {
      if (errorBox) {
        errorBox.textContent = 'Informe seu nome e um telefone válido com DDD.';
        errorBox.hidden = false;
      }
      return;
    }
    if (errorBox) errorBox.hidden = true;
    const message = `Olá! Quero solicitar um orçamento de concreto.\nNome: ${name}\nTelefone: ${normalizedPhone}\nMinha cidade é: `;
    reportGoogleAdsConversion(whatsappUrl(message), { name, phone: normalizedPhone });
  });
}

// ===== WHATSAPP =====
document.querySelectorAll('.js-whatsapp').forEach((link) => {
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

// ===== RODAPÉ =====
const footerBottom = document.querySelector('.footer-bottom');
if (footerBottom && !footerBottom.querySelector('.legal-links')) {
  const legal = document.createElement('span');
  legal.className = 'legal-links';
  legal.innerHTML = '<a href="/produtos/">Produtos</a> · <a href="/sobre/">Sobre nós</a> · <a href="/politica-de-privacidade/">Privacidade</a> · <a href="/termos/">Termos de uso</a>';
  footerBottom.appendChild(legal);
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// ===== MENU GLOBAL MOBILE =====
const menuToggle = document.querySelector('.cb-menu-toggle');
const globalMenu = document.querySelector('.cb-menu');

function closeGlobalMenu({ restoreFocus = false } = {}) {
  globalMenu?.classList.remove('cb-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuToggle?.focus();
}
function openGlobalMenu() {
  globalMenu?.classList.add('cb-open');
  menuToggle?.setAttribute('aria-expanded', 'true');
  menuToggle?.setAttribute('aria-label', 'Fechar menu');
  document.body.classList.add('menu-open');
  window.setTimeout(() => globalMenu?.querySelector('a')?.focus(), 60);
}
menuToggle?.addEventListener('click', () => globalMenu?.classList.contains('cb-open') ? closeGlobalMenu() : openGlobalMenu());
globalMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeGlobalMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && globalMenu?.classList.contains('cb-open')) closeGlobalMenu({ restoreFocus: true });
});
document.addEventListener('click', (event) => {
  if (window.innerWidth > 980 || !globalMenu?.classList.contains('cb-open')) return;
  const target = event.target;
  if (target instanceof Node && !globalMenu.contains(target) && !menuToggle?.contains(target)) closeGlobalMenu();
});
window.addEventListener('resize', () => { if (window.innerWidth > 980) closeGlobalMenu(); });

// ===== SCROLL / REVEAL =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const siteHeader = document.querySelector('.cb-site-header');
const progress = document.getElementById('scroll-progress');
let scrollTicking = false;

function updateScrollUI() {
  const y = window.scrollY || 0;
  siteHeader?.classList.toggle('cb-scrolled', y > 18);
  if (progress) {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
  }
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollUI);
  }
}, { passive: true });
updateScrollUI();

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) revealItems.forEach((item) => item.classList.add('is-visible'));
else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach((item) => observer.observe(item));
}

// ===== ÂNCORAS =====
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    const target = id ? document.querySelector(id) : null;
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (siteHeader?.offsetHeight || 0) - 14;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });
});

// ===== FALLBACK DE IMAGENS =====
document.querySelectorAll('img.product-img').forEach((img) => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.style.background = 'linear-gradient(135deg,#263644,#111a23)';
      parent.classList.add('image-fallback');
    }
  }, { once: true });
});
