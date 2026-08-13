/* ==========================================================================
   LUMINA SALON - INTERACTIVE SCRIPT
   Location: Savile Row, Mayfair, London
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBeforeAfterSliders();
  initTestimonialsCarousel();
  initGalleryFilters();
  initBookingForm();
  initContactForm();
  initMobileMenu();
});

/* 1. STICKY NAVBAR & SMOOTH SCROLL */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* 2. SCROLL ENTRY ANIMATIONS */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.2
  });

  revealElements.forEach(el => observer.observe(el));
}

/* 3. INTERACTIVE BEFORE & AFTER SLIDERS */
function initBeforeAfterSliders() {
  const baContainers = document.querySelectorAll('.ba-container');

  baContainers.forEach(container => {
    const beforeWrapper = container.querySelector('.ba-before-wrapper');
    const handle = container.querySelector('.ba-handle');
    let isDragging = false;

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      let offsetX = x - rect.left;

      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeWrapper.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    // Touch & Mouse Drag Handlers
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  });
}

/* 4. TESTIMONIALS AUTO-ROTATING CAROUSEL */
function initTestimonialsCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const carouselContainer = document.querySelector('.testimonial-carousel-container');
  
  if (!slides.length) return;

  let currentIndex = 0;
  let intervalId = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i]?.classList.remove('active');
    });

    slides[index].classList.add('active');
    dots[index]?.classList.add('active');
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startAutoplay() {
    if (!intervalId) {
      intervalId = setInterval(nextSlide, 6000);
    }
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Dots navigation click
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      stopAutoplay();
      setTimeout(startAutoplay, 3000);
    });
  });

  // Pause on hover
  carouselContainer.addEventListener('mouseenter', stopAutoplay);
  carouselContainer.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* 5. GALLERY CATEGORY FILTERING */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.ba-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* 6. BOOKING FORM VALIDATION & SUCCESS STATE */
function initBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  const successOverlay = document.getElementById('bookingSuccessOverlay');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const timeChips = document.querySelectorAll('.time-chip');
  const timeInput = document.getElementById('preferredTime');

  if (!bookingForm) return;

  const name = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const service = document.getElementById('service');
  const date = document.getElementById('preferredDate');

  const requiredFields = [name, email, phone, service, date].filter(Boolean);

  // Clear errors on page load
  requiredFields.forEach(field => {
    field.classList.remove('error');
    
    // Clear error state on user input/typing
    field.addEventListener('input', () => {
      field.classList.remove('error');
    });

    field.addEventListener('change', () => {
      field.classList.remove('error');
    });

    // Validate only when user leaves field (blur)
    field.addEventListener('blur', () => {
      validateField(field);
    });
  });

  function validateField(field) {
    if (!field) return true;
    let valid = true;

    if (!field.value.trim()) {
      valid = false;
    } else if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = emailRegex.test(field.value.trim());
    }

    if (!valid) {
      field.classList.add('error');
    } else {
      field.classList.remove('error');
    }
    return valid;
  }

  // Time chip selector
  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      if (timeInput) {
        timeInput.value = chip.getAttribute('data-time');
      }
    });
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalid = null;

    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!isValid) {
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Submit animation feedback
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.style.transform = 'scale(0.97)';
    submitBtn.innerHTML = `Confirming Reservation...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.style.transform = 'scale(1)';
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Show success modal overlay
      if (successOverlay) {
        successOverlay.classList.add('active');
      }
      bookingForm.reset();
      requiredFields.forEach(f => f.classList.remove('error'));
    }, 800);
  });

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      successOverlay.classList.remove('active');
    });
  }
}

/* 7. CONTACT FORM VALIDATION & SUCCESS STATE */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cName');
    const email = document.getElementById('cEmail');
    const message = document.getElementById('cMessage');

    let isValid = true;

    [name, email, message].forEach(input => {
      if (!input) return;
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });

    if (!isValid) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = `Sending Message...`;

    setTimeout(() => {
      submitBtn.innerHTML = `Send Message`;
      contactSuccess.style.display = 'block';
      contactForm.reset();

      setTimeout(() => {
        contactSuccess.style.display = 'none';
      }, 5000);
    }, 800);
  });
}

/* 8. MOBILE MENU TOGGLE */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}
