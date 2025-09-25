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
    googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbx8Wl2glRNG7AU1vKOcr7U8UtUneCaHKe3JxthHdqBuTxqteeFP9UyVgEMYVtQi_f6DiA/exec',
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

  // Validate phone number (strict format: only numbers, max 9 digits)
  isValidPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove all non-digits
    const phoneRegex = /^\d{1,9}$/; // Only digits, max 9 digits
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 7; // Min 7, max 9 digits
  },

  // Validate RUC (more flexible - 8 to 11 digits)
  isValidRUC(ruc) {
    const cleanRuc = ruc.replace(/[\s\-]/g, ''); // Remove spaces and dashes
    const rucRegex = /^\d{8,11}$/; // Accept 8-11 digits (DNI or RUC)
    return rucRegex.test(cleanRuc);
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

      // Validación especial para campos de celular: solo números y máximo 9 dígitos
      if (input.name === 'celular' || input.name === 'telefono') {
        input.addEventListener('input', (e) => {
          // Remover todo lo que no sea número
          let value = e.target.value.replace(/\D/g, '');
          // Limitar a 9 dígitos máximo
          if (value.length > 9) {
            value = value.slice(0, 9);
          }
          e.target.value = value;
        });
      }
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
            errorMessage = 'Ingrese solo números, entre 7 y 9 dígitos (ej: 987654321)';
          }
          break;
          
        case 'ruc':
          if (!utils.isValidRUC(value)) {
            isValid = false;
            errorMessage = 'Ingrese un RUC/DNI válido (8-11 dígitos)';
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
    const failedFields = [];

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
        failedFields.push(`${input.name}: "${input.value}"`);
      }
    });

    // Debug: mostrar qué campos fallaron
    if (!isValid) {
      console.log('Campos que fallaron la validación:', failedFields);
    }

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
      this.setButtonLoading(submitButton, true);

      try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Submit form
        const success = await this.submitLead(data);
        
        if (success) {
          analytics.trackFormSubmit(true);
          
          // Show success states (sin redundancia)
          this.setButtonLoading(submitButton, false);
          this.showLightSuccessMessage(form);
          
          // Reset form after que el usuario vea el mensaje
          setTimeout(() => {
            form.reset();
          }, 4000);
          
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        analytics.trackFormSubmit(false, 'submission_error');
        this.setButtonLoading(submitButton, false);
        this.showToast('Hubo un error al enviar el formulario. Por favor, inténtelo nuevamente.', 'error');
        console.error('Form submission error:', error);
      }
    });
  },

  // Enviar datos a Google Apps Script para integración con Google Sheets
  async submitLead(data) {
    console.log('Form data to submit:', data);
    
    // Validar que la URL de Google Apps Script esté configurada
    if (!CONFIG.form.googleAppsScriptUrl) {
      console.error('Google Apps Script URL not configured');
      this.showToast('Error de configuración. Por favor, contacte al administrador.', 'error');
      return false;
    }
    
    try {
      // Preparar los datos para enviar a Google Apps Script
      const scriptData = {
        timestamp: new Date().toISOString(),
        source: 'anicama_landing_page',
        form_type: data.empresa ? 'hero_form' : 'contact_form',
        nombres: data.nombres || '',
        email: data.email || '',
        celular: data.celular || data.telefono || '',
        empresa: data.empresa || '',
        ruc: data.ruc || '',
        cargo: data.cargo || '',
        mensaje: data.mensaje || '',
        // Información adicional para el seguimiento
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'Direct'
      };

      // Realizar la petición a Google Apps Script
      // Nota: Usamos mode: 'no-cors' para evitar problemas de CORS con Google Apps Script
      const response = await fetch(CONFIG.form.googleAppsScriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Importante para Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scriptData),
        signal: AbortSignal.timeout(CONFIG.form.timeout)
      });
      
      // Con mode: 'no-cors', no podemos verificar response.ok o leer el JSON
      // Pero si llega aquí sin error, significa que se envió correctamente
      console.log('Lead successfully sent to Google Sheets');
      return true;
      
    } catch (error) {
      console.error('Error sending data to Google Apps Script:', error);
      
      // Manejo específico de errores
      if (error.name === 'AbortError') {
        this.showToast('La solicitud tardó demasiado tiempo. Por favor, inténtelo nuevamente.', 'error');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        this.showToast('Error de conexión. Verifique su conexión a internet.', 'error');
      } else {
        this.showToast('Error al procesar la solicitud. Por favor, inténtelo más tarde.', 'error');
      }
      
      return false;
    }
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

      // Validación especial para campos de celular: solo números y máximo 9 dígitos
      if (input.name === 'celular' || input.name === 'telefono') {
        input.addEventListener('input', (e) => {
          // Remover todo lo que no sea número
          let value = e.target.value.replace(/\D/g, '');
          // Limitar a 9 dígitos máximo
          if (value.length > 9) {
            value = value.slice(0, 9);
          }
          e.target.value = value;
        });
      }
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
      this.setButtonLoading(submitButton, true);

      try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Submit form
        const success = await this.submitLead(data);
        
        if (success) {
          analytics.trackFormSubmit(true);
          
          // Show success states (sin redundancia)
          this.setButtonLoading(submitButton, false);
          this.showLightSuccessMessage(form);
          
          // Reset form after que el usuario vea el mensaje
          setTimeout(() => {
            form.reset();
          }, 4000);
          
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        analytics.trackFormSubmit(false, 'submission_error');
        this.setButtonLoading(submitButton, false);
        this.showToast('Hubo un error al enviar el formulario. Por favor, inténtelo nuevamente.', 'error');
        console.error('Form submission error:', error);
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
  },

  // ===== UI/UX HELPERS =====
  setButtonLoading(button, isLoading, originalText = null) {
    if (isLoading) {
      button.dataset.originalText = originalText || button.textContent;
      button.textContent = 'Enviando...';
      button.classList.add('btn-submit--loading');
      button.disabled = true;
    } else {
      // Transición suave de regreso al estado normal
      button.textContent = button.dataset.originalText || 'Solicitar Consulta Gratuita';
      button.classList.remove('btn-submit--loading');
      
      // Pequeña pausa antes de habilitar de nuevo (para evitar double-submit)
      setTimeout(() => {
        button.disabled = false;
      }, 1000);
      
      delete button.dataset.originalText;
    }
  },

  setButtonSuccess(button, duration = 3000) {
    const originalText = button.dataset.originalText || button.textContent;
    button.textContent = '¡Enviado!';
    button.classList.add('btn-submit--success');
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('btn-submit--success');
      button.disabled = false;
    }, duration);
  },

  showLightSuccessMessage(form) {
    // Remover mensaje anterior si existe
    const existingSuccess = form.querySelector('.form-success-light');
    if (existingSuccess) {
      existingSuccess.remove();
    }

    // Crear mensaje ligero
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-light';
    successDiv.innerHTML = `
      <span class="form-success-light__icon">✓</span>
      <span class="form-success-light__text">¡Consulta enviada! Te contactaremos pronto.</span>
    `;

    // Agregar después del botón de envío
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(successDiv, submitButton.nextSibling);

    // Agregar efecto sutil al formulario
    const formCard = form.closest('.form-card');
    if (formCard) {
      formCard.style.transform = 'scale(1.02)';
      formCard.style.transition = 'transform 0.3s ease-out';
      
      // Restaurar después de un momento
      setTimeout(() => {
        formCard.style.transform = 'scale(1)';
      }, 300);
    }

    // Auto-remover mensaje después de 5 segundos (más tiempo para leer)
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (successDiv.parentNode) {
            successDiv.remove();
          }
        }, 300);
      }
    }, 5000);
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
