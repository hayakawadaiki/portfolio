/**
 * top.js
 * Top page interactions: smooth scroll, scroll reveal, header effect,
 * mobile nav, card glow, scroll indicator
 */

(function () {
  'use strict';

  // ========================================
  // Card Glow Effect (mouse follow)
  // ========================================
  function initCardGlow() {
    var cards = document.querySelectorAll('.project-card:not(.project-card--placeholder)');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var inner = card.querySelector('.project-card-inner');
        if (!inner) return;
        var rect = inner.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        inner.style.setProperty('--mouse-x', x + 'px');
        inner.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  // ========================================
  // Scroll Indicator Hide
  // ========================================
  function initScrollIndicator() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    function updateIndicator() {
      if (window.scrollY > 100) {
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
      } else {
        indicator.style.opacity = '';
        indicator.style.pointerEvents = '';
      }
    }

    window.addEventListener('scroll', updateIndicator, { passive: true });
  }

  // ========================================
  // Initialize
  // ========================================
  function init() {
    // Shared modules
    Portfolio.initHeader({ headerId: 'topHeader' });
    Portfolio.initMobileNav({
      btnId: 'mobileMenuBtn',
      menuId: 'mobileNavOverlay',
      linkSelector: '.mobile-nav-link',
      activeClass: 'is-active',
      openClass: 'is-open'
    });
    Portfolio.initSmoothScroll();
    Portfolio.initScrollReveal({
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });
    Portfolio.initContactForm();

    // Site-specific modules
    initCardGlow();
    initScrollIndicator();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
