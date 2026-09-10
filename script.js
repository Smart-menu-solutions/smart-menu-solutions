const STORAGE_KEY = 'lang';
const DEFAULT_LANG = 'en';
const translationCache = new Map();

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

let currentLang = getStoredLanguage();

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('is-open');
  });
}

function getStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  } catch (error) {
    console.warn('Unable to read language preference:', error);
    return DEFAULT_LANG;
  }
}

function setStoredLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.warn('Unable to save language preference:', error);
  }
}

function applyTranslations(translations) {
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');

    if (translations[key]) {
      element.textContent = translations[key];
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const key = element.getAttribute('data-i18n-html');

    if (translations[key]) {
      element.innerHTML = translations[key];
    }
  });

  syncLanguageButtons();
}

async function getTranslations(lang) {
  if (translationCache.has(lang)) {
    return translationCache.get(lang);
  }

  const response = await fetch(`assets/i18n/${lang}.json`);

  if (!response.ok) {
    throw new Error(`Could not load translations for "${lang}".`);
  }

  const translations = await response.json();
  translationCache.set(lang, translations);

  return translations;
}

async function loadTranslations(lang) {
  try {
    currentLang = lang;
    applyTranslations(await getTranslations(lang));
  } catch (error) {
    console.error('Translation loading error:', error);

    if (lang !== DEFAULT_LANG) {
      try {
        currentLang = DEFAULT_LANG;
        setStoredLanguage(DEFAULT_LANG);
        applyTranslations(await getTranslations(DEFAULT_LANG));
      } catch (fallbackError) {
        console.error('Default translation fallback failed:', fallbackError);
      }
    }
  }
}

async function switchLanguage(lang) {
  if (!lang || lang === currentLang) {
    syncLanguageButtons();
    return;
  }

  currentLang = lang;
  setStoredLanguage(lang);
  await loadTranslations(lang);
}

function syncLanguageButtons() {
  document.querySelectorAll('[data-lang]').forEach((button) => {
    const isActive = button.dataset.lang === currentLang;

    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

document.addEventListener('click', (event) => {
  const languageButton = event.target.closest('[data-lang]');

  if (languageButton) {
    event.preventDefault();
    switchLanguage(languageButton.dataset.lang);
    return;
  }

  const skipLink = event.target.closest('.skip-link');

  if (!skipLink) {
    return;
  }

  const targetSelector = skipLink.getAttribute('href');

  if (!targetSelector || !targetSelector.startsWith('#')) {
    return;
  }

  const target = document.querySelector(targetSelector);

  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
});

window.switchLanguage = switchLanguage;

syncLanguageButtons();
loadTranslations(currentLang).catch((error) => {
  console.error('Translation initialization error:', error);
});
