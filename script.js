// ===== CONFIGURAÇÃO RÁPIDA =====
// Formato: código do país + DDD + número, somente dígitos.
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

    // Nunca bloqueia o atendimento caso a tag do Google demore.
    window.setTimeout(go, 1200);
    return true;
  }

  window.location.href = url;
  return true;
}

const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  const nameInput = quoteForm.querySelector('[name="name"]');
  const phoneInput = quoteForm.querySelector('[name="phone"]');
  const errorBox = quoteForm.querySelector('.form-error');

  phoneInput?.addEventListener('input', () => {
    let digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
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
    const url = whatsappUrl(message);

    reportGoogleAdsConversion(url, { name, phone: normalizedPhone });
  });
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

// Transparência e navegação: links permanentes para páginas institucionais.
const footerBottom = document.querySelector('.footer-bottom');
if (footerBottom && !footerBottom.querySelector('.legal-links')) {
  const legal = document.createElement('span');
  legal.className = 'legal-links';
  legal.innerHTML = '<a href="/produtos/">Produtos</a> · <a href="/sobre/">Sobre nós</a> · <a href="/politica-de-privacidade/">Privacidade</a> · <a href="/termos/">Termos de uso</a>';
  footerBottom.appendChild(legal);
}

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
