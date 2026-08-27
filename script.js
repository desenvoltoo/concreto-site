// ===== CONFIGURAÇÃO RÁPIDA =====
const WHATSAPP_NUMBER = '5511956023851';
const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de solicitar um orçamento para minha obra.';

// Google Ads: conversão "Lead - WhatsApp ConcretoBrasils".
const GOOGLE_ADS_ID = 'AW-18387900627';
const GOOGLE_ADS_SEND_TO = 'AW-18387900627/GyYTCIGm3OIcENOxhMBE';

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
  return {
    firstName: parts[0] || '',
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : ''
  };
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

// ===== FORMULÁRIO DE ORÇAMENTO =====
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  const nameInput = quoteForm.querySelector('[name="name"]');
  const phoneInput = quoteForm.querySelector('[name="phone"]');
  const errorBox = quoteForm.querySelector('.form-error');

  phoneInput?.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 10) {
      phoneInput.value = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else if (digits.length > 6) {
      phoneInput.value = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else if (digits.length > 2) {
      phoneInput.value = digits.replace(/(\d{2})(\d+)/, '($1) $2');
    } else if (digits.length) {
      phoneInput.value = digits.replace(/(\d{0,2})/, '($1');
    }
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

// ===== LINKS DE WHATSAPP =====
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

// ===== LINKS INSTITUCIONAIS =====
const footerBottom = document.querySelector('.footer-bottom');
if (footerBottom && !footerBottom.querySelector('.legal-links')) {
  const legal = document.createElement('span');
  legal.className = 'legal-links';
  legal.innerHTML = '<a href="/produtos/">Produtos</a> · <a href="/sobre/">Sobre nós</a> · <a href="/politica-de-privacidade/">Privacidade</a> · <a href="/termos/">Termos de uso</a>';
  footerBottom.appendChild(legal);
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// ===== MENU MOBILE =====
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function closeMenu({ restoreFocus = false } = {}) {
  nav?.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
  if (restoreFocus) toggle?.focus();
}

function openMenu() {
  nav?.classList.add('open');
  toggle?.setAttribute('aria-expanded', 'true');
  toggle?.setAttribute('aria-label', 'Fechar menu');
  document.body.classList.add('menu-open');
  window.setTimeout(() => nav?.querySelector('a')?.focus(), 80);
}

toggle?.addEventListener('click', () => {
  nav?.classList.contains('open') ? closeMenu() : openMenu();
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) closeMenu({ restoreFocus: true });
});

document.addEventListener('click', (event) => {
  if (window.innerWidth > 980 || !nav?.classList.contains('open')) return;
  const target = event.target;
  if (target instanceof Node && !nav.contains(target) && !toggle?.contains(target)) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMenu();
});

// ===== ROLAGEM, REVEAL E PROGRESSO =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.header');
const progress = document.getElementById('scroll-progress');
let scrollTicking = false;

function updateScrollUI() {
  const y = window.scrollY || 0;
  header?.classList.toggle('is-scrolled', y > 18);

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
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => observer.observe(item));
}

// ===== ÂNCORAS COM HEADER FIXO =====
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    const target = id ? document.querySelector(id) : null;
    if (!target) return;

    event.preventDefault();
    const headerHeight = header?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 14;
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

// ===== SHELL GLOBAL PREMIUM =====
(function installPremiumShell(){
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const active = path === '/produtos' ? 'produtos' : path === '/sobre' ? 'sobre' : path === '/orcamento' ? 'orcamento' : path === '/' ? 'inicio' : '';
  const activeAttr = (name) => active === name ? ' aria-current="page"' : '';

  const style = document.createElement('style');
  style.id = 'premium-shell-style';
  style.textContent = `
    .premium-header{position:sticky;top:0;z-index:500;background:rgba(255,255,255,.92);border-bottom:1px solid rgba(15,24,33,.07);backdrop-filter:saturate(170%) blur(18px);-webkit-backdrop-filter:saturate(170%) blur(18px);transition:box-shadow .25s ease,background .25s ease}
    .premium-header.is-scrolled{background:rgba(255,255,255,.97);box-shadow:0 12px 35px rgba(15,24,33,.08)}
    .premium-topbar{background:#0d151d;color:#c5cdd4;font-size:11px}.premium-topbar .container{height:32px;display:flex;align-items:center;justify-content:space-between;gap:20px}.premium-topbar a{color:#fff;font-weight:800;letter-spacing:.02em}
    .premium-nav{height:78px;display:flex;align-items:center;gap:34px}.premium-brand{display:inline-flex;align-items:center;gap:11px;flex-shrink:0}.premium-brand-mark{display:flex;align-items:flex-end;gap:3px;height:35px}.premium-brand-mark i{display:block;width:8px;background:#f05a28;transform:skew(-18deg);border-radius:1px}.premium-brand-mark i:nth-child(1){height:21px}.premium-brand-mark i:nth-child(2){height:28px}.premium-brand-mark i:nth-child(3){height:35px}.premium-brand-copy{display:flex;flex-direction:column;line-height:.92}.premium-brand-copy strong{font-family:Montserrat,Inter,sans-serif;font-size:17px;letter-spacing:.04em;color:#18232f}.premium-brand-copy small{font-size:9px;letter-spacing:.34em;color:#f05a28;font-weight:900;margin-top:6px}
    .premium-menu{margin-left:auto;display:flex;align-items:center;gap:8px}.premium-menu>a{position:relative;display:inline-flex;align-items:center;min-height:42px;padding:0 13px;border-radius:999px;color:#39444e;font-size:13px;font-weight:750;transition:color .2s ease,background .2s ease}.premium-menu>a:hover{color:#f05a28;background:#fff4ef}.premium-menu>a[aria-current="page"]{color:#f05a28;background:#fff1eb}.premium-menu>a[aria-current="page"]:after{content:"";position:absolute;left:14px;right:14px;bottom:5px;height:2px;border-radius:999px;background:#f05a28}
    .premium-budget{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:999px;background:#15202a;color:#fff;font-size:12px;font-weight:850;text-transform:uppercase;letter-spacing:.04em;box-shadow:0 10px 25px rgba(15,24,33,.13);transition:transform .2s ease,box-shadow .2s ease}.premium-budget:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(15,24,33,.18)}
    .premium-toggle{display:none;width:46px;height:46px;border:0;border-radius:14px;background:#f4f6f7;align-items:center;justify-content:center;flex-direction:column;gap:5px;margin-left:auto}.premium-toggle i{width:21px;height:2px;background:#15202a;border-radius:999px;transition:.2s}.premium-toggle[aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}.premium-toggle[aria-expanded="true"] i:nth-child(2){opacity:0}.premium-toggle[aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
    @media(max-width:980px){.premium-topbar{display:none}.premium-nav{height:70px}.premium-budget{margin-left:auto}.premium-toggle{display:flex}.premium-menu{position:fixed;inset:70px 0 0;background:rgba(255,255,255,.985);backdrop-filter:blur(18px);display:flex;flex-direction:column;align-items:stretch;gap:6px;padding:20px 18px calc(24px + env(safe-area-inset-bottom));transform:translateX(100%);opacity:0;visibility:hidden;transition:transform .25s ease,opacity .25s ease;overflow:auto}.premium-menu.open{transform:none;opacity:1;visibility:visible}.premium-menu>a{min-height:56px;border-radius:14px;font-size:17px;padding:0 16px}.premium-menu>a[aria-current="page"]:after{display:none}}
    @media(max-width:650px){.premium-nav{height:66px}.premium-brand-copy strong{font-size:14px}.premium-brand-copy small{font-size:7px}.premium-brand-mark{height:29px}.premium-brand-mark i:nth-child(1){height:18px}.premium-brand-mark i:nth-child(2){height:23px}.premium-brand-mark i:nth-child(3){height:29px}.premium-budget{display:none}.premium-menu{inset:66px 0 0}.premium-toggle{width:44px;height:44px}.internal-hero{padding-top:72px!important}.internal-content{padding-top:46px!important}}
  `;
  document.head.appendChild(style);

  const markup = `
    <header class="premium-header" id="site-header">
      <div class="premium-topbar"><div class="container"><span>Concreto usinado e bombeamento para obras residenciais, comerciais e industriais</span><a href="/orcamento/">Solicitar orçamento →</a></div></div>
      <div class="container premium-nav">
        <a class="premium-brand" href="/" aria-label="Concreto Brasil - início">
          <span class="premium-brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="premium-brand-copy"><strong>CONCRETO</strong><small>BRASIL</small></span>
        </a>
        <nav class="premium-menu" id="premium-menu" aria-label="Navegação principal">
          <a href="/"${activeAttr('inicio')}>Início</a>
          <a href="/produtos/"${activeAttr('produtos')}>Produtos</a>
          <a href="/sobre/"${activeAttr('sobre')}>Sobre</a>
          <a href="/orcamento/"${activeAttr('orcamento')}>Orçamento</a>
        </nav>
        <a class="premium-budget" href="/orcamento/">Solicitar orçamento</a>
        <button class="premium-toggle" type="button" aria-label="Abrir menu" aria-controls="premium-menu" aria-expanded="false"><i></i><i></i><i></i></button>
      </div>
    </header>`;

  const oldHeader = document.querySelector('header.header, header.premium-header');
  if (oldHeader) oldHeader.outerHTML = markup;
  else document.body.insertAdjacentHTML('afterbegin', markup);

  const shellHeader = document.getElementById('site-header');
  const shellMenu = document.getElementById('premium-menu');
  const shellToggle = document.querySelector('.premium-toggle');

  const shellClose = () => {
    shellMenu?.classList.remove('open');
    shellToggle?.setAttribute('aria-expanded','false');
    shellToggle?.setAttribute('aria-label','Abrir menu');
    document.body.classList.remove('menu-open');
  };
  const shellOpen = () => {
    shellMenu?.classList.add('open');
    shellToggle?.setAttribute('aria-expanded','true');
    shellToggle?.setAttribute('aria-label','Fechar menu');
    document.body.classList.add('menu-open');
  };

  shellToggle?.addEventListener('click',()=>shellMenu?.classList.contains('open')?shellClose():shellOpen());
  shellMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',shellClose));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')shellClose()});
  document.addEventListener('click',e=>{
    if(window.innerWidth>980||!shellMenu?.classList.contains('open'))return;
    if(e.target instanceof Node&&!shellMenu.contains(e.target)&&!shellToggle?.contains(e.target))shellClose();
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>980)shellClose()});
  window.addEventListener('scroll',()=>shellHeader?.classList.toggle('is-scrolled',window.scrollY>16),{passive:true});
})();
