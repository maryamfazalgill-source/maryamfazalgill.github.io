// ==========================================================================
// PORTFOLIO SITE SCRIPT
// Handles: mobile nav toggle, smooth scrolling, scroll-reveal animation,
// portfolio filtering, case-study/portfolio modal popups, and contact
// form validation.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ *
   * 1. MOBILE NAV TOGGLE
   * ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav after a link is clicked
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 2. SMOOTH SCROLL FOR IN-PAGE NAV LINKS
   * (native `scroll-behavior: smooth` already handles most cases, this
   *  adds a graceful fallback + accounts for the sticky header height)
   * ------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------------ *
   * 3. SCROLL-REVEAL ANIMATION
   * ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything if IntersectionObserver isn't supported
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ------------------------------------------------------------------ *
   * 4. PORTFOLIO FILTER
   * ------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // update active state
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // show/hide cards
      portfolioCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  /* ------------------------------------------------------------------ *
   * 5. MODAL POPUPS (case studies + portfolio items)
   * ------------------------------------------------------------------ */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');
  const modalClose = document.getElementById('modal-close');

  // Content shown for each modal trigger. Keyed by the data-modal id
  // referenced on the triggering element.
  const modalContent = {
    'modal-1': {
      title: 'Cosmetics Store Landing Page Design',
      desc: 'A vibrant, conversion-focused landing page for a cosmetics brand, featuring category navigation, trending product carousels, and a bold hero banner built to highlight seasonal campaigns.',
      img: 'work/Cosmetics Store.png'
    },
    'modal-2': {
      title: 'Luxury Fashion Ecommerce Landing Page',
      desc: 'An elegant ecommerce experience for a luxury fashion label, combining editorial-style imagery with clear category entry points and a refined, minimal checkout flow.',
      img: 'work/Fashion Ecommerce.png'
    },
    'modal-3': {
      title: 'TuneHive — Music Streaming App',
      desc: 'A music streaming app concept with a dark, immersive UI, mood-based playlist discovery, and an onboarding flow designed to get listeners to their first track in seconds.',
      img: 'work/TuneHive App.png',
      link: 'https://www.figma.com/proto/288C944hsg4c3YEwJ9eKai/music-app?node-id=0-1&t=Xoxgq5usSk8EoS6H-1'
    },
    'modal-4': {
      title: 'Gronur — Grocery Delivery App',
      desc: 'A fresh, friendly grocery delivery app UI with an emphasis on quick reordering, clear category browsing, and a streamlined cart-to-checkout journey.',
      img: 'work/Grocery Delivery App.png',
      link: 'https://www.figma.com/proto/s62cuG0JRhXaa7owqEuQ0u/grocery-app?node-id=7-128&t=tK8sIL1WpVp705SD-1&starting-point-node-id=1%3A5'
    },
    'modal-5': {
      title: 'Stylo — Fashion Brand Identity',
      desc: 'A bold brand identity system for a fashion label, including logo, color system, and print collateral designed to feel confident and editorial.',
      img: 'work/Stylo Branding.png',
      link: 'https://www.figma.com/proto/Q6VTZBapgP5zVWBxn1SaQa/Stylo-Fashion-app?node-id=2-2&t=KFSb4qmkt9tCsvLd-1&starting-point-node-id=2%3A2'
    },
    'modal-6': {
      title: 'Beauty Salon Booking App',
      desc: 'A soft, welcoming booking app for a beauty salon, with service browsing, stylist selection, and appointment scheduling designed to feel effortless.',
      img: 'work/Beauty Salon.png',
      link: 'https://www.figma.com/proto/blv8ngIvRVi9u0mxH0fWmV/Salon-App?node-id=0-1&t=t87Ak1FMRdzVK5eE-1'
    },
    'modal-7': {
      title: 'Food Delivery App',
      desc: 'A high-contrast food delivery app concept with bold typography, appetite-driving imagery, and a fast, minimal ordering flow.',
      img: 'work/Food Delivery App.png',
      link: 'https://www.figma.com/proto/jWnJxQGB7rJL8m3betFekZ/food?node-id=15-19&t=zlpL3DGqaYdgwmHw-1'
    }
  };

  let lastFocusedElement = null;

  function openModal(key) {
    const data = modalContent[key];
    if (!data || !modalOverlay) return;

    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    if (modalLink) {
      modalLink.hidden = !data.link;
      modalLink.href = data.link || '#';
    }

    lastFocusedElement = document.activeElement;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => openModal(trigger.dataset.modal));
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  /* ------------------------------------------------------------------ *
   * 6. CONTACT FORM VALIDATION
   * ------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  function setError(fieldId, message) {
    const errEl = document.getElementById(`err-${fieldId}`);
    if (errEl) errEl.textContent = message;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidUrl(value) {
    if (!value) return true; // website is optional
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`);
      return true;
    } catch {
      return false;
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const website = document.getElementById('website');
      const message = document.getElementById('message');

      let isValid = true;

      // reset errors
      ['name', 'email', 'website', 'message'].forEach(id => setError(id, ''));
      successMsg.textContent = '';

      if (!name.value.trim()) {
        setError('name', 'Please enter your name.');
        isValid = false;
      }

      if (!email.value.trim()) {
        setError('email', 'Please enter your email.');
        isValid = false;
      } else if (!isValidEmail(email.value.trim())) {
        setError('email', 'Please enter a valid email address.');
        isValid = false;
      }

      if (!isValidUrl(website.value.trim())) {
        setError('website', 'Please enter a valid URL.');
        isValid = false;
      }

      if (!message.value.trim()) {
        setError('message', 'Please enter a message.');
        isValid = false;
      }

      if (!isValid) return;

      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      form.submit();
    });
  }

  /* ------------------------------------------------------------------ *
   * 7. FOOTER YEAR + BACK TO TOP
   * ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
