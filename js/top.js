/**
 * top.js
 * Top page interactions: smooth scroll, scroll reveal, header effect,
 * mobile nav, card glow, scroll indicator
 */

(function () {
  'use strict';

  // ========================================
  // Header Scroll Effect
  // ========================================
  function initHeader() {
    var header = document.getElementById('topHeader');
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // ========================================
  // Mobile Navigation
  // ========================================
  function initMobileNav() {
    var btn = document.getElementById('mobileMenuBtn');
    var overlay = document.getElementById('mobileNavOverlay');
    if (!btn || !overlay) return;

    var links = overlay.querySelectorAll('.mobile-nav-link');

    function openMenu() {
      btn.classList.add('is-active');
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'メニューを閉じる');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      btn.classList.remove('is-active');
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (overlay.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // ========================================
  // Smooth Scroll
  // ========================================
  function initSmoothScroll() {
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
  }

  // ========================================
  // Scroll Reveal (IntersectionObserver)
  // ========================================
  function initScrollReveal() {
    var elements = document.querySelectorAll('.top-reveal');

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
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

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
  // Contact Form
  // ========================================
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var success = document.getElementById('formSuccess');
    var hiddenIframe = document.getElementById('hidden_iframe');
    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      // Reset errors
      form.querySelectorAll('.top-form-group').forEach(function (group) {
        group.classList.remove('has-error');
      });

      var nameInput = form.querySelector('#name');
      var emailInput = form.querySelector('#email');
      var valid = true;

      if (!nameInput.value.trim()) {
        nameInput.closest('.top-form-group').classList.add('has-error');
        valid = false;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        emailInput.closest('.top-form-group').classList.add('has-error');
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        return;
      }

      // Valid: let the form submit natively to hidden iframe
    });

    if (hiddenIframe) {
      hiddenIframe.addEventListener('load', function () {
        // Skip the initial empty load
        if (!form.dataset.submitted) return;
        form.style.display = 'none';
        success.classList.add('active');
      });

      form.addEventListener('submit', function () {
        form.dataset.submitted = 'true';
      });
    }
  }

  // ========================================
  // Initialize
  // ========================================
  function init() {
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initScrollReveal();
    initCardGlow();
    initScrollIndicator();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
