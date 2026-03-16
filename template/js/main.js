/**
 * main.js
 * Site-specific interactions
 */
(function () {
  'use strict';

  function init() {
    // Shared modules
    Portfolio.initHeader();
    Portfolio.initMobileNav();
    Portfolio.initSmoothScroll();
    Portfolio.initScrollReveal();
    Portfolio.initContactForm();

    // Site-specific modules go here
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
