/**
 * shared.js
 * Common portfolio utilities exposed on window.Portfolio
 */
(function () {
  'use strict';

  var Portfolio = {};

  // ========================================
  // Header Scroll Effect
  // ========================================
  Portfolio.initHeader = function (opts) {
    opts = opts || {};
    var headerId = opts.headerId || 'header';
    var threshold = opts.threshold || 50;
    var onScroll = opts.onScroll || null;

    var header = document.getElementById(headerId);
    if (!header) return;

    function updateHeader() {
      var scrollY = window.scrollY;

      if (scrollY > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (typeof onScroll === 'function') {
        onScroll(scrollY);
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  };

  // ========================================
  // Mobile Navigation
  // ========================================
  Portfolio.initMobileNav = function (opts) {
    opts = opts || {};
    var btnId = opts.btnId || 'mobileMenuBtn';
    var menuId = opts.menuId || 'mobileMenu';
    var linkSelector = opts.linkSelector || '.mobile-menu-link';
    var activeClass = opts.activeClass || 'active';
    var openClass = opts.openClass || 'active';

    var btn = document.getElementById(btnId);
    var menu = document.getElementById(menuId);
    if (!btn || !menu) return;

    var links = menu.querySelectorAll(linkSelector);
    var isOpen = false;

    function openMenu() {
      isOpen = true;
      btn.classList.add(activeClass);
      menu.classList.add(openClass);
      if (menu.hasAttribute('aria-hidden')) {
        menu.setAttribute('aria-hidden', 'false');
      }
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'メニューを閉じる');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      btn.classList.remove(activeClass);
      menu.classList.remove(openClass);
      if (menu.hasAttribute('aria-hidden')) {
        menu.setAttribute('aria-hidden', 'true');
      }
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });
  };

  // ========================================
  // Smooth Scroll
  // ========================================
  Portfolio.initSmoothScroll = function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };

  // ========================================
  // Scroll Reveal (IntersectionObserver)
  // ========================================
  Portfolio.initScrollReveal = function (opts) {
    opts = opts || {};
    var selector = opts.selector || '.scroll-reveal';
    var threshold = opts.threshold !== undefined ? opts.threshold : 0.15;
    var rootMargin = opts.rootMargin || '0px 0px -50px 0px';

    var elements = document.querySelectorAll(selector);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: rootMargin,
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  };

  // ========================================
  // Contact Form
  // ========================================
  Portfolio.initContactForm = function (opts) {
    opts = opts || {};
    var formId = opts.formId || 'contactForm';
    var successId = opts.successId || 'formSuccess';
    var iframeId = opts.iframeId || 'hidden_iframe';

    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    var hiddenIframe = document.getElementById(iframeId);

    if (!form) return;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', function (e) {
      var isValid = true;

      // Reset errors
      form.querySelectorAll('.form-group').forEach(function (group) {
        group.classList.remove('has-error');
      });

      // Validate name
      var nameField = form.querySelector('#name');
      if (nameField && !nameField.value.trim()) {
        nameField.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate email
      var emailField = form.querySelector('#email');
      if (emailField && !emailRegex.test(emailField.value.trim())) {
        emailField.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
        return;
      }
    });

    if (hiddenIframe) {
      hiddenIframe.addEventListener('load', function () {
        if (!form.dataset.submitted) return;
        form.style.display = 'none';
        if (success) success.classList.add('active');
      });

      form.addEventListener('submit', function () {
        form.dataset.submitted = 'true';
      });
    }

    // Remove error on input
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        input.closest('.form-group').classList.remove('has-error');
      });
    });
  };

  // Expose
  window.Portfolio = Portfolio;
})();
