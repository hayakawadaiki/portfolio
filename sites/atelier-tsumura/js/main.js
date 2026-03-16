/**
 * main.js
 * Core functionality: header, nav, cursor, lightbox, carousel, form, mobile CTA
 */

(function () {
  'use strict';

  // ========================================
  // Custom Cursor
  // ========================================
  function initCustomCursor() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = document.getElementById('customCursor');
    const cursorText = document.getElementById('cursorText');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const lerp = 0.15; // Smoothing factor (replaces spring animation)

    function updateCursor() {
      // Lerp interpolation for smooth following
      cursorX += (mouseX - cursorX) * lerp;
      cursorY += (mouseY - cursorY) * lerp;

      const size = cursor.classList.contains('expanded')
        ? 80
        : cursor.classList.contains('interactive')
        ? 40
        : 16;
      const offset = size / 2;

      cursor.style.transform = `translate(${cursorX - offset}px, ${cursorY - offset}px)`;

      requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursor.classList.contains('visible')) {
        cursor.classList.add('visible');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });

    // Detect interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor], a, button, .work-card');

      if (target) {
        const customText = target.dataset.cursor;
        if (customText) {
          cursor.classList.remove('default', 'interactive');
          cursor.classList.add('expanded');
          if (cursorText) cursorText.textContent = customText;
        } else {
          cursor.classList.remove('default', 'expanded');
          cursor.classList.add('interactive');
          if (cursorText) cursorText.textContent = '';
        }
      } else {
        cursor.classList.remove('interactive', 'expanded');
        cursor.classList.add('default');
        if (cursorText) cursorText.textContent = '';
      }

      // Toggle light cursor on dark sections
      const darkSection = e.target.closest('[data-cursor-theme="light"]');
      if (darkSection) {
        cursor.classList.add('cursor-light');
      } else {
        cursor.classList.remove('cursor-light');
      }
    });

    requestAnimationFrame(updateCursor);
  }

  // ========================================
  // Magnetic Buttons
  // ========================================
  function initMagneticButtons() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const buttons = document.querySelectorAll('.magnetic-btn');
    const strength = 0.3;

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ========================================
  // Lightbox
  // ========================================
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox) return;

    const workCards = document.querySelectorAll('.work-card');

    workCards.forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.work-card-image');
        const title = card.querySelector('.work-card-title');

        if (img && lightboxImage) {
          lightboxImage.src = img.src;
          lightboxImage.alt = img.alt;
        }

        if (title && lightboxCaption) {
          lightboxCaption.textContent = title.textContent;
        }

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ========================================
  // Testimonials Carousel
  // ========================================
  function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('testimonialsDots');

    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.testimonial-slide');
    const dots = dotsContainer.querySelectorAll('.testimonials-dot');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayTimer = null;

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide((currentIndex + 1) % totalSlides);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Dot clicks
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index, 10);
        goToSlide(index);
        startAutoplay(); // Reset autoplay timer
      });
    });

    // Pause on hover
    const carousel = track.closest('.testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  // ========================================
  // Mobile CTA
  // ========================================
  function initMobileCTA() {
    const mobileCta = document.getElementById('mobileCta');
    if (!mobileCta) return;

    function updateVisibility() {
      const threshold = window.innerHeight * 0.5;

      if (window.scrollY > threshold) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
  }

  // ========================================
  // Initialize All
  // ========================================
  function init() {
    // Shared modules
    var scrollProgress = document.getElementById('scrollProgress');
    Portfolio.initHeader({
      headerId: 'header',
      onScroll: function (scrollY) {
        if (scrollProgress) {
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? scrollY / docHeight : 0;
          scrollProgress.style.transform = 'scaleX(' + progress + ')';
        }
      }
    });
    Portfolio.initMobileNav({
      btnId: 'mobileMenuBtn',
      menuId: 'mobileMenu',
      linkSelector: '.mobile-menu-link'
    });
    Portfolio.initSmoothScroll();
    Portfolio.initContactForm();

    // Site-specific modules
    initCustomCursor();
    initMagneticButtons();
    initLightbox();
    initTestimonials();
    initMobileCTA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
