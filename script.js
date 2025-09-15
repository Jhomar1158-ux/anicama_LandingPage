// ===== CONFIGURATION =====
const CONFIG = {
  whatsapp: {
    number: '51978150649',
    message: 'Hola, me interesa conocer más sobre sus servicios de asesoría contable y tributaria.'
  },
  analytics: {
    enabled: true,
    gaId: 'GA_MEASUREMENT_ID' // TODO: Replace with actual GA ID
  },
  form: {
    endpoint: '', // TODO: Configure form submission endpoint
    timeout: 10000
  }
};

// ===== UTILITY FUNCTIONS =====
const utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Smooth scroll to element
  scrollToElement(element, offset = 70) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  },

  // Format phone number for WhatsApp
  formatWhatsAppNumber(number) {
    return number.replace(/[^\d]/g, '');
  },

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (simple format)
  isValidPhone(phone) {
    const phoneRegex = /^[9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Validate RUC (11 digits)
  isValidRUC(ruc) {
    const rucRegex = /^\d{11}$/;
    return rucRegex.test(ruc.replace(/\s/g, ''));
  }
};

// ===== ANALYTICS & TRACKING =====
const analytics = {
  // Initialize Google Analytics
  init() {
    if (CONFIG.analytics.enabled && typeof gtag !== 'undefined') {
      console.log('Analytics initialized');
    }
  },

  // Track events
  trackEvent(eventName, parameters = {}) {
    if (CONFIG.analytics.enabled && typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'engagement',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        ...parameters
      });
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, parameters);
  },

  // Track CTA clicks
  trackCTA(ctaType, location) {
    this.trackEvent('cta_click', {
      cta_type: ctaType,
      location: location,
      event_category: 'conversion'
    });
  },

  // Track form interactions
  trackFormView() {
    this.trackEvent('form_view', {
      event_category: 'form'
    });
  },

  trackFormSubmit(success, errorType = null) {
    const eventName = success ? 'form_submit_success' : 'form_submit_error';
    this.trackEvent(eventName, {
      event_category: 'form',
      error_type: errorType
    });
  },

  // Track WhatsApp clicks
  trackWhatsApp() {
    this.trackEvent('whatsapp_click', {
      event_category: 'contact'
    });
  }
};

// ===== NAVIGATION =====
const navigation = {
  init() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupStickyHeader();
    this.setupActiveNavLinks();
  },

  setupMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');

    // Open menu
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
        // Trap focus in menu
        this.trapFocus(navMenu);
      });
    }

    // Close menu
    if (navClose) {
      navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
      });
    }

    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('show-menu');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
        navToggle.focus();
      }
    });
  },

  setupSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          utils.scrollToElement(targetElement);
          
          // Update URL without triggering scroll
          if (history.pushState) {
            history.pushState(null, null, `#${targetId}`);
          }
        }
      });
    });
  },

  setupStickyHeader() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    const handleScroll = utils.throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add/remove sticky class based on scroll position
      if (scrollTop > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }

      lastScrollTop = scrollTop;
    }, 10);

    window.addEventListener('scroll', handleScroll);
  },

  setupActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const handleScroll = utils.throttle(() => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, 100);

    window.addEventListener('scroll', handleScroll);
  },

  // Trap focus within an element (for accessibility)
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
};

// ===== FORM VALIDATION & SUBMISSION =====
const formHandler = {
  init() {
    this.setupFormValidation();
    this.setupFormSubmission();
    this.trackFormView();
    this.setupHeroFormValidation();
    this.setupHeroFormSubmission();
  },

  setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', utils.debounce(() => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      }, 300));
    });
  },

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    }

    // Specific field validations
    if (value && isValid) {
      switch (fieldName) {
        case 'email':
          if (!utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Ingrese un email válido';
          }
          break;
        
        case 'telefono':
        case 'celular':
          if (!utils.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Ingrese un celular válido (debe empezar con 9 y tener 9 dígitos)';
          }
          break;
          
        case 'ruc':
          if (!utils.isValidRUC(value)) {
            isValid = false;
            errorMessage = 'El RUC debe tener exactamente 11 dígitos';
          }
          break;
        
        case 'nombres':
          if (value.length < 2) {
            isValid = false;
            errorMessage = 'El nombre debe tener al menos 2 caracteres';
          }
          break;
        
        case 'empresa':
          if (value.length < 2) {
            isValid = false;
            errorMessage = 'El nombre de la empresa debe tener al menos 2 caracteres';
          }
          break;
        
        case 'cargo':
          if (value.length < 2) {
            isValid = false;
            errorMessage = 'El cargo debe tener al menos 2 caracteres';
          }
          break;
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  },

  showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.setAttribute('aria-live', 'polite');
    }
  },

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.removeAttribute('aria-live');
    }
  },

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  },

  setupFormSubmission() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!this.validateForm(form)) {
        analytics.trackFormSubmit(false, 'validation_error');
        this.showToast('Por favor, corrija los errores en el formulario', 'error');
        return;
      }

      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Enviando...';
      submitButton.disabled = true;

      try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Submit form (placeholder - implement actual submission)
        const success = await this.submitLead(data);
        
        if (success) {
          analytics.trackFormSubmit(true);
          this.showToast('¡Gracias! Hemos recibido su consulta. Nos contactaremos pronto.', 'success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        analytics.trackFormSubmit(false, 'submission_error');
        this.showToast('Hubo un error al enviar el formulario. Por favor, inténtelo nuevamente.', 'error');
        console.error('Form submission error:', error);
      } finally {
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  },

  // TODO: Implement actual form submission logic
  async submitLead(data) {
    // Placeholder implementation
    console.log('Form data to submit:', data);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate success (replace with actual API call)
        resolve(true);
      }, 1000);
    });
    
    // Example implementation for future integration:
    /*
    try {
      const response = await fetch(CONFIG.form.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(CONFIG.form.timeout)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Submission error:', error);
      return false;
    }
    */
  },

  setupHeroFormValidation() {
    const form = document.getElementById('hero-contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', utils.debounce(() => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      }, 300));
    });
  },

  setupHeroFormSubmission() {
    const form = document.getElementById('hero-contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!this.validateForm(form)) {
        analytics.trackFormSubmit(false, 'validation_error');
        this.showToast('Por favor, corrija los errores en el formulario', 'error');
        return;
      }

      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Enviando...';
      submitButton.disabled = true;

      try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Submit form (placeholder - implement actual submission)
        const success = await this.submitLead(data);
        
        if (success) {
          analytics.trackFormSubmit(true);
          this.showToast('¡Gracias! Hemos recibido su consulta. Nos contactaremos pronto.', 'success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        analytics.trackFormSubmit(false, 'submission_error');
        this.showToast('Hubo un error al enviar el formulario. Por favor, inténtelo nuevamente.', 'error');
        console.error('Form submission error:', error);
      } finally {
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  },

  trackFormView() {
    const forms = [
      document.getElementById('contact-form'),
      document.getElementById('hero-contact-form')
    ];

    forms.forEach(form => {
      if (!form) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            analytics.trackFormView();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(form);
    });
  },

  showToast(message, type = 'info') {
    toastManager.show(message, type);
  }
};

// ===== TOAST NOTIFICATIONS =====
const toastManager = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 5000) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast);
    }, duration);

    return toast;
  },

  createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    };

    toast.innerHTML = `
      <span class="toast__icon" aria-hidden="true">${icons[type] || icons.info}</span>
      <div class="toast__content">
        <div class="toast__title">${titles[type] || titles.info}</div>
        <div class="toast__message">${message}</div>
      </div>
      <button class="toast__close" aria-label="Cerrar notificación">×</button>
    `;

    // Close button functionality
    const closeButton = toast.querySelector('.toast__close');
    closeButton.addEventListener('click', () => {
      this.remove(toast);
    });

    return toast;
  },

  remove(toast) {
    if (toast && toast.parentNode) {
      toast.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }
};

// ===== ANIMATIONS & INTERACTIONS =====
const animations = {
  init() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupHoverEffects();
  },

  setupScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
      element.classList.add('fade-in');
      observer.observe(element);
    });
  },

  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      observer.observe(counter);
    });
  },

  setupHoverEffects() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .servicio-card, .pilar, .cliente-logo');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-2px)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
      });
    });
  }
};

// ===== CTA TRACKING =====
const ctaTracker = {
  init() {
    this.setupCTATracking();
    this.setupWhatsAppTracking();
  },

  setupCTATracking() {
    const ctaButtons = document.querySelectorAll('[data-cta]');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ctaType = button.getAttribute('data-cta');
        const location = this.getElementLocation(button);
        analytics.trackCTA(ctaType, location);
      });
    });
  },

  setupWhatsAppTracking() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-float, [href*="wa.me"], [href*="whatsapp"]');
    
    whatsappButtons.forEach(button => {
      button.addEventListener('click', () => {
        analytics.trackWhatsApp();
      });
    });

    // Update WhatsApp links with configured number and message
    const whatsappLinks = document.querySelectorAll('[href*="wa.me"]');
    whatsappLinks.forEach(link => {
      const number = utils.formatWhatsAppNumber(CONFIG.whatsapp.number);
      const message = encodeURIComponent(CONFIG.whatsapp.message);
      link.href = `https://wa.me/${number}?text=${message}`;
    });
  },

  getElementLocation(element) {
    // Determine the section/location of the CTA
    const section = element.closest('section, header, footer');
    return section ? section.id || section.className.split(' ')[0] : 'unknown';
  }
};

// ===== PERFORMANCE OPTIMIZATIONS =====
const performance = {
  init() {
    this.setupLazyLoading();
    this.preloadCriticalResources();
  },

  setupLazyLoading() {
    // Native lazy loading is already implemented in HTML
    // This is a fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) {
      return; // Native lazy loading is supported
    }

    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  },

  preloadCriticalResources() {
    // Preload critical images
    const criticalImages = [
      'assets/hero-image.jpg',
      'assets/logo.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
};

// ===== ACCESSIBILITY ENHANCEMENTS =====
const accessibility = {
  init() {
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
  },

  setupKeyboardNavigation() {
    // Handle keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
      // Handle Enter key on buttons
      if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
      }
    });
  },

  setupScreenReaderSupport() {
    // Add screen reader announcements for dynamic content
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announceToScreenReader = (message) => {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    };
  },

  setupFocusManagement() {
    // Ensure focus is visible
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
};

// ===== MAIN INITIALIZATION =====
class AnicamaWebsite {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      analytics.init();
      toastManager.init();
      navigation.init();
      formHandler.init();
      animations.init();
      ctaTracker.init();
      performance.init();
      accessibility.init();

      // Add skip link for accessibility
      this.addSkipLink();

      console.log('Anicama website initialized successfully');
    } catch (error) {
      console.error('Error initializing website:', error);
    }
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main';
    }
  }
}

// ===== GLOBAL ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  analytics.trackEvent('javascript_error', {
    error_message: e.message,
    error_filename: e.filename,
    error_lineno: e.lineno
  });
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  analytics.trackEvent('promise_rejection', {
    error_message: e.reason?.message || 'Unknown promise rejection'
  });
});

// ===== INITIALIZE WEBSITE =====
const website = new AnicamaWebsite();

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    utils,
    analytics,
    navigation,
    formHandler,
    toastManager,
    animations,
    ctaTracker,
    performance,
    accessibility,
    AnicamaWebsite
  };
}
