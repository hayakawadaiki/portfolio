/**
 * animations.js
 * IntersectionObserver-based scroll animations
 * Replaces Framer Motion whileInView, SplitText, CurtainReveal, Parallax, CountUp
 */

(function () {
  'use strict';

  // ========================================
  // Curtain Reveal (IntersectionObserver)
  // ========================================
  function initCurtainReveal() {
    const elements = document.querySelectorAll('.curtain-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // ========================================
  // Split Text Animation
  // ========================================
  function initSplitText() {
    const elements = document.querySelectorAll('.split-text');

    elements.forEach((el) => {
      const text = el.textContent.trim();
      const splitType = el.dataset.split || 'char';

      el.textContent = '';
      el.setAttribute('aria-label', text);

      if (splitType === 'char') {
        // Split into characters, preserving spaces
        const chars = text.split('');
        chars.forEach((char, i) => {
          const span = document.createElement('span');
          span.classList.add('char');
          span.setAttribute('aria-hidden', 'true');

          const inner = document.createElement('span');
          inner.classList.add('char-inner');
          inner.textContent = char === ' ' ? '\u00A0' : char;
          inner.style.transitionDelay = `${0.3 + i * 0.04}s`;

          span.appendChild(inner);
          el.appendChild(span);
        });
      } else {
        // Split into words
        const words = text.split(/\s+/);
        words.forEach((word, i) => {
          const span = document.createElement('span');
          span.classList.add('word');
          span.setAttribute('aria-hidden', 'true');

          const inner = document.createElement('span');
          inner.classList.add('word-inner');
          inner.textContent = word;
          inner.style.transitionDelay = `${i * 0.03}s`;

          span.appendChild(inner);
          el.appendChild(span);
        });
      }
    });

    // Observe split text elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // ========================================
  // Parallax Effect
  // ========================================
  function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (elements.length === 0) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      elements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distance = elementCenter - viewportCenter;
        const offset = distance * speed;

        el.style.transform = `translateY(${offset}px)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    // Initial call
    updateParallax();
  }

  // ========================================
  // Count Up Animation
  // ========================================
  function initCountUp() {
    const elements = document.querySelectorAll('[data-count]');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500; // ms
    const startTime = performance.now();

    // Easing: ease-out-cubic
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.round(easedProgress * target);

      // Zero-pad to match target digit count
      const digits = String(target).length;
      el.textContent = String(currentValue).padStart(digits, '0') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========================================
  // Process Steps Animation
  // ========================================
  function initProcessSteps() {
    const steps = document.querySelectorAll('.process-step');
    if (steps.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    steps.forEach((step) => observer.observe(step));
  }

  // ========================================
  // Initialize All Animations
  // ========================================
  function init() {
    initSplitText();
    Portfolio.initScrollReveal();
    initCurtainReveal();
    initParallax();
    initCountUp();
    initProcessSteps();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
