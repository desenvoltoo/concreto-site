// Concreto Brasil — JS global
const WHATSAPP_NUMBER = '5511956023851';
const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de solicitar um orçamento para minha obra.';
const GOOGLE_ADS_ID = 'AW-18387900627';
const GOOGLE_ADS_SEND_TO = 'AW-18387900627/GyYTCIGm3OIcENOxhMBE';

function ensureGoogleTag(){
  window.dataLayer = window.dataLayer || [];
  if(typeof window.gtag !== 'function'){
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GOOGLE_ADS_ID);
  }
  if(!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}"]`)){
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(s);
  }
}
ensureGoogleTag();

function whatsappUrl(message = DEFAULT_MESSAGE){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function normalizeBrazilPhone(value){
  let digits = String(value || '').replace(/\D/g,'');
  if(digits.startsWith('00')) digits = digits.slice(2);
  if(digits.startsWith('55') && digits.length >= 12) return `+${digits}`;
  if(digits.length === 10 || digits.length === 11) return `+55${digits}`;
  return null;
}

function splitName(fullName){
  const parts = String(fullName || '').trim().replace(/\s+/g,' ').split(' ').filter(Boolean);
  return {firstName:parts[0] || '', lastName:parts.length > 1 ? parts.slice(1).join(' ') : ''};
}

function setEnhancedConversionUserData({name, phone}){
  if(typeof window.gtag !== 'function') return false;
  const phoneNumber = normalizeBrazilPhone(phone);
  if(!phoneNumber) return false;
  const {firstName,lastName} = splitName(name);
  const userData = {phone_number:phoneNumber};
  if(firstName || lastName){
    userData.address = {
      ...(firstName ? {first_name:firstName} : {}),
      ...(lastName ? {last_name:lastName} : {}),
      country:'BR'
    };
  }
  window.gtag('set','user_data',userData);
  return true;
}

function reportGoogleAdsConversion(url,userData=null){
  if(userData) setEnhancedConversionUserData(userData);
  if(GOOGLE_ADS_SEND_TO && typeof window.gtag === 'function'){
    let navigated = false;
    const go = () => {
      if(navigated) return;
      navigated = true;
      window.location.href = url;
    };
    window.gtag('event','conversion',{send_to:GOOGLE_ADS_SEND_TO,value:1.0,currency:'BRL',event_callback:go});
    window.setTimeout(go,1200);
    return true;
  }
  window.location.href = url;
  return true;
}

function currentSection(){
  const p = window.location.pathname.replace(/\/+$/,'') || '/';
  if(p === '/') return 'inicio';
  if(p === '/produtos' || p === '/concreto-usinado' || p === '/bombeamento-de-concreto') return 'produtos';
  if(p === '/sobre') return 'sobre';
  if(p === '/orcamento') return 'orcamento';
  return '';
}

function installShell(){
  document.querySelectorAll('header').forEach(el => el.remove());

  if(!document.querySelector('link[href^="/shell.css"]')){
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/shell.css?v=20260827-1';
    document.head.appendChild(link);
  }

  const active = currentSection();
  const current = name => active === name ? ' aria-current="page"' : '';
  const shell = document.createElement('header');
  shell.className = 'cb-shell';
  shell.id = 'site-header';
  shell.innerHTML = `
    <div class="cb-topbar">
      <div class="cb-topbar-inner">
        <span>Concreto usinado e bombeamento para obras residenciais, comerciais e industriais</span>
        <a href="/orcamento/">Solicitar orçamento <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <div class="cb-nav">
      <a class="cb-brand" href="/" aria-label="Concreto Brasil - início">
        <span class="cb-brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="cb-brand-copy"><strong>CONCRETO</strong><small>BRASIL</small></span>
      </a>
      <nav class="cb-menu" id="cb-main-nav" aria-label="Navegação principal">
        <a href="/"${current('inicio')}>Início</a>
        <a href="/produtos/"${current('produtos')}>Produtos</a>
        <a href="/sobre/"${current('sobre')}>Sobre</a>
        <a href="/#faq">Dúvidas</a>
        <a class="cb-mobile-budget" href="/orcamento/"${current('orcamento')}>Solicitar orçamento</a>
      </nav>
      <a class="cb-budget" href="/orcamento/"${current('orcamento')}>Orçamento</a>
      <button class="cb-toggle" type="button" aria-label="Abrir menu" aria-controls="cb-main-nav" aria-expanded="false"><i></i><i></i><i></i></button>
    </div>`;

  const skip = document.querySelector('.skip-link');
  if(skip) skip.insertAdjacentElement('afterend',shell);
  else document.body.prepend(shell);

  const nav = shell.querySelector('.cb-menu');
  const toggle = shell.querySelector('.cb-toggle');

  const closeMenu = ({restoreFocus=false}={}) => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Abrir menu');
    document.body.classList.remove('cb-menu-open');
    if(restoreFocus) toggle.focus();
  };
  const openMenu = () => {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Fechar menu');
    document.body.classList.add('cb-menu-open');
    window.setTimeout(() => nav.querySelector('a')?.focus(),70);
  };

  toggle.addEventListener('click',() => nav.classList.contains('open') ? closeMenu() : openMenu());
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click',() => closeMenu()));
  document.addEventListener('keydown',e => { if(e.key === 'Escape' && nav.classList.contains('open')) closeMenu({restoreFocus:true}); });
  document.addEventListener('click',e => {
    if(window.innerWidth > 980 || !nav.classList.contains('open')) return;
    if(!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
  window.addEventListener('resize',() => { if(window.innerWidth > 980) closeMenu(); });

  const update = () => shell.classList.toggle('is-scrolled',(window.scrollY || 0) > 16);
  update();
  window.addEventListener('scroll',update,{passive:true});
}

function setupQuoteForm(){
  const quoteForm = document.getElementById('quote-form');
  if(!quoteForm) return;
  const nameInput = quoteForm.querySelector('[name="name"]');
  const phoneInput = quoteForm.querySelector('[name="phone"]');
  const errorBox = quoteForm.querySelector('.form-error');

  phoneInput?.addEventListener('input',() => {
    const digits = phoneInput.value.replace(/\D/g,'').slice(0,11);
    if(digits.length > 10) phoneInput.value = digits.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3').replace(/-$/,'');
    else if(digits.length > 6) phoneInput.value = digits.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3').replace(/-$/,'');
    else if(digits.length > 2) phoneInput.value = digits.replace(/(\d{2})(\d+)/,'($1) $2');
    else if(digits.length) phoneInput.value = digits.replace(/(\d{0,2})/,'($1');
  });

  quoteForm.addEventListener('submit',event => {
    event.preventDefault();
    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const normalizedPhone = normalizeBrazilPhone(phone);
    if(name.length < 2 || !normalizedPhone){
      if(errorBox){ errorBox.textContent = 'Informe seu nome e um telefone válido com DDD.'; errorBox.hidden = false; }
      return;
    }
    if(errorBox) errorBox.hidden = true;
    const message = `Olá! Quero solicitar um orçamento de concreto.\nNome: ${name}\nTelefone: ${normalizedPhone}\nMinha cidade é: `;
    reportGoogleAdsConversion(whatsappUrl(message),{name,phone:normalizedPhone});
  });
}

function setupWhatsappLinks(){
  document.querySelectorAll('.js-whatsapp').forEach(link => {
    const url = whatsappUrl(link.dataset.message || DEFAULT_MESSAGE);
    link.href = url;
    link.removeAttribute('target');
    link.removeAttribute('rel');
    link.addEventListener('click',event => {
      event.preventDefault();
      reportGoogleAdsConversion(url);
    });
  });
}

function setupReveal(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');
  if(reduceMotion || !('IntersectionObserver' in window)){
    items.forEach(i => i.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  items.forEach(i => obs.observe(i));
}

function setupProgress(){
  const progress = document.getElementById('scroll-progress');
  if(!progress) return;
  let ticking = false;
  const update = () => {
    const max = Math.max(1,document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${Math.min(1,(window.scrollY || 0)/max)})`;
    ticking = false;
  };
  window.addEventListener('scroll',() => {
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  },{passive:true});
  update();
}

function setupAnchors(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click',event => {
      const target = document.querySelector(link.getAttribute('href'));
      if(!target) return;
      event.preventDefault();
      const headerHeight = document.getElementById('site-header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({top,behavior:reduceMotion ? 'auto' : 'smooth'});
      history.replaceState(null,'',link.getAttribute('href'));
    });
  });
}

function setupFooterLegal(){
  const footerBottom = document.querySelector('.footer-bottom');
  if(!footerBottom || footerBottom.querySelector('.legal-links')) return;
  const legal = document.createElement('span');
  legal.className = 'legal-links';
  legal.innerHTML = '<a href="/produtos/">Produtos</a> · <a href="/sobre/">Sobre nós</a> · <a href="/politica-de-privacidade/">Privacidade</a> · <a href="/termos/">Termos de uso</a>';
  footerBottom.appendChild(legal);
}

function setupImageFallback(){
  document.querySelectorAll('img.product-img').forEach(img => {
    img.addEventListener('error',() => {
      img.style.display = 'none';
      if(img.parentElement){
        img.parentElement.style.background = 'linear-gradient(135deg,#263644,#111a23)';
        img.parentElement.classList.add('image-fallback');
      }
    },{once:true});
  });
}

function boot(){
  installShell();
  setupQuoteForm();
  setupWhatsappLinks();
  setupReveal();
  setupProgress();
  setupAnchors();
  setupFooterLegal();
  setupImageFallback();
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot);
else boot();
