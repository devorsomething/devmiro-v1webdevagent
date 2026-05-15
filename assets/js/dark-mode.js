/* Dark Mode Toggle JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
});

/**
 * Dark Mode Configuration
 */
const darkModeConfig = {
  storageKey: 'devmiro-theme',
  cookieKey: 'devmiro-theme-cookie',
  
  init() {
    // Check for saved preference
    const saved = localStorage.getItem(this.storageKey);
    
    if (saved === 'dark') {
      this.enable();
    } else if (saved === 'light') {
      this.disable();
    } else {
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.enable();
      } else {
        this.disable();
      }
    }
    
    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        // Only auto-switch if no manual preference saved
        if (!localStorage.getItem(this.storageKey)) {
          if (e.matches) {
            this.enable();
          } else {
            this.disable();
          }
        }
      });
    
    // Update toggle button state
    this.updateToggleState();
  },
  
  enable() {
    document.documentElement.setAttribute('data-theme', 'dark');
    this.setCookie('dark');
    localStorage.setItem(this.storageKey, 'dark');
    this.updateToggleState();
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: 'dark' } }));
  },
  
  disable() {
    document.documentElement.removeAttribute('data-theme');
    this.setCookie('light');
    localStorage.setItem(this.storageKey, 'light');
    this.updateToggleState();
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: 'light' } }));
  },
  
  toggle() {
    if (document.documentElement.hasAttribute('data-theme')) {
      this.disable();
    } else {
      this.enable();
    }
  },
  
  setCookie(value) {
    document.cookie = `${this.cookieKey}=${value};path=/;max-age=31536000;SameSite=Strict`;
  },
  
  getCookie() {
    const match = document.cookie.match(new RegExp(`(^| )${this.cookieKey}=([^;]+)`));
    return match ? match[2] : null;
  },
  
  updateToggleState() {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
      const isDark = document.documentElement.hasAttribute('data-theme');
      toggle.setAttribute('aria-pressed', isDark);
      toggle.setAttribute('aria-label', isDark 
        ? (getDarkModeLang() === 'de' ? 'Hell-Modus aktivieren' : 'Enable light mode')
        : (getDarkModeLang() === 'de' ? 'Dunkel-Modus aktivieren' : 'Enable dark mode')
      );
    });
  }
};

/**
 * Get current language for dark mode
 */
function getDarkModeLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize dark mode
 */
function initDarkMode() {
  darkModeConfig.init();
  
  // Add click handlers to toggle buttons
  const toggles = document.querySelectorAll('.theme-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      darkModeConfig.toggle();
      
      // Track toggle
      if (window.journeyTrack) {
        window.journeyTrack.track('theme_toggle', {
          new_theme: document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light'
        });
      }
    });
  });
  
  // Keyboard support
  toggles.forEach(toggle => {
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        darkModeConfig.toggle();
      }
    });
  });
}

/**
 * Check if dark mode is active
 */
function isDarkMode() {
  return document.documentElement.hasAttribute('data-theme');
}

// Export for global use
window.darkModeConfig = darkModeConfig;
window.isDarkMode = isDarkMode;
window.toggleDarkMode = () => darkModeConfig.toggle();