// -----------------------------
// Mobile Navigation Toggle
// -----------------------------
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('open');
  });
}

// -----------------------------
// Language Switching (i18n)
// -----------------------------
let currentLang = localStorage.getItem('lang') || 'en';

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  loadTranslations(lang);
}

async function loadTranslations(lang) {
  try {
    const response = await fetch(`assets/i18n/${lang}.json`);
    const translations = await response.json();

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });
  } catch (error) {
    console.error("Translation loading error:", error);
  }
}

// Load language on page start
loadTranslations(currentLang);

// -----------------------------
// Smooth Scroll for Skip Link
// -----------------------------
document.querySelectorAll('.skip-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

