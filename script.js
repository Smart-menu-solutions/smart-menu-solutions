console.log("SCRIPT GELADEN");

document.addEventListener('DOMContentLoaded', function () {
  // Mobile Navigation Toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Sprachschalter-Funktion
function switchLanguage(lang) {
  console.log("Sprache gewechselt zu: " + lang);
  
  // Hier kannst du festlegen, was beim Sprachwechsel passieren soll.
  // Wenn du z.B. separate Dateien für Deutsch hast (wie index-de.html):
  var currentPath = window.location.pathname;
  
  if (lang === 'de') {
    // Logik für Deutsch (z.B. Weiterleitung auf die deutsche Version, falls vorhanden)
    // window.location.href = currentPath.replace('.html', '-de.html');
  } else {
    // Logik für Englisch (Standard)
    // window.location.href = currentPath.replace('-de.html', '.html');
  }
}
