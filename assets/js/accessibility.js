/* Accessibility & Inclusive Design JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initAccessibility();
});

/**
 * Accessibility Configuration
 */
const accessibilityConfig = {
  enablePreferencesPanel: true,
  enableSkipLinks: true,
  enableHighContrast: true,
  enableReducedMotion: true,
  enableDyslexiaFont: true,
  enableKeyboardNav: true,
  
  // Font size presets
  fontSizes: {
    small: '14px',
    normal: '16px',
    large: '18px',
    'extra-large': '20px'
  },
  
  // Line height presets
  lineHeights: {
    normal: '1.5',
    relaxed: '1.75',
    loose: '2'
  },
  
  // Letter spacing presets
  letterSpacings: {
    normal: '0',
    wide: '0.05em',
    'extra-wide': '0.1em'
  }
};

/**
 * Accessibility State
 */
let accessibilityState = {
  fontSize: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  highContrast: false,
  reducedMotion: false,
  dyslexiaFont: false,
  keyboardNav: false,
  visibleFocus: false
};

/**
 * Initialize accessibility features
 */
function initAccessibility() {
  // Load preferences
  loadAccessibilityPreferences();
  
  // Apply preferences
  applyAccessibilityPreferences();
  
  // Initialize skip links
  if (accessibilityConfig.enableSkipLinks) {
    initSkipLinks();
  }
  
  // Initialize preferences panel
  if (accessibilityConfig.enablePreferencesPanel) {
    initAccessibilityPanel();
  }
  
  // Initialize keyboard navigation
  if (accessibilityConfig.enableKeyboardNav) {
    initKeyboardNavigation();
  }
  
  // Check system preferences
  checkSystemPreferences();
  
  // Listen for preference changes
  listenForPreferenceChanges();
}

/**
 * Load accessibility preferences
 */
function loadAccessibilityPreferences() {
  const saved = localStorage.getItem('devmiro_accessibility');
  if (saved) {
    accessibilityState = { ...accessibilityState, ...JSON.parse(saved) };
  }
}

/**
 * Save accessibility preferences
 */
function saveAccessibilityPreferences() {
  localStorage.setItem('devmiro_accessibility', JSON.stringify(accessibilityState));
}

/**
 * Apply accessibility preferences
 */
function applyAccessibilityPreferences() {
  // Font size
  if (accessibilityState.fontSize !== 'normal') {
    document.documentElement.style.setProperty('--font-size-base', accessibilityConfig.fontSizes[accessibilityState.fontSize]);
    document.documentElement.style.fontSize = accessibilityConfig.fontSizes[accessibilityState.fontSize];
  }
  
  // Line height
  if (accessibilityState.lineHeight !== 'normal') {
    document.documentElement.style.setProperty('--line-height', accessibilityConfig.lineHeights[accessibilityState.lineHeight]);
  }
  
  // Letter spacing
  if (accessibilityState.letterSpacing !== 'normal') {
    document.documentElement.style.letterSpacing = accessibilityConfig.letterSpacings[accessibilityState.letterSpacing];
  }
  
  // High contrast
  if (accessibilityState.highContrast) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
  
  // Reduced motion
  if (accessibilityState.reducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }
  
  // Dyslexia font
  if (accessibilityState.dyslexiaFont) {
    document.documentElement.classList.add('dyslexia-friendly');
  } else {
    document.documentElement.classList.remove('dyslexia-friendly');
  }
  
  // Visible focus
  if (accessibilityState.visibleFocus) {
    document.documentElement.setAttribute('data-visible-focus', 'true');
  } else {
    document.documentElement.removeAttribute('data-visible-focus');
  }
}

/**
 * Initialize skip links
 */
function initSkipLinks() {
  const skipLinks = document.createElement('nav');
  skipLinks.className = 'skip-links';
  skipLinks.setAttribute('aria-label', 'Skip links');
  skipLinks.innerHTML = `
    <a href="#main-content" class="skip-link">${getLocalizedText('skipToContent')}</a>
    <a href="#main-navigation" class="skip-link">${getLocalizedText('skipToNav')}</a>
    <a href="#search" class="skip-link">${getLocalizedText('skipToSearch')}</a>
  `;
  
  document.body.insertBefore(skipLinks, document.body.firstChild);
  
  // Add skip link styles
  const style = document.createElement('style');
  style.textContent = `
    .skip-links { position: fixed; top: 0; left: 0; z-index: 10000; }
    .skip-link { position: absolute; top: -100px; left: var(--space-4); padding: var(--space-3) var(--space-4); background: var(--color-primary); color: white; text-decoration: none; font-weight: 600; border-radius: 0 0 var(--radius-md) var(--radius-md); transition: top 0.3s ease; }
    .skip-link:focus { top: 0; outline: 3px solid gold; }
  `;
  document.head.appendChild(style);
}

/**
 * Get localized text
 */
function getLocalizedText(key) {
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  const texts = {
    skipToContent: { de: 'Zum Hauptinhalt springen', en: 'Skip to main content' },
    skipToNav: { de: 'Zur Navigation springen', en: 'Skip to navigation' },
    skipToSearch: { de: 'Zur Suche springen', en: 'Skip to search' },
    fontSize: { de: 'Schriftgröße', en: 'Font Size' },
    lineHeight: { de: 'Zeilenabstand', en: 'Line Height' },
    letterSpacing: { de: 'Zeichenabstand', en: 'Letter Spacing' },
    highContrast: { de: 'Hoher Kontrast', en: 'High Contrast' },
    reducedMotion: { de: 'Weniger Bewegung', en: 'Reduced Motion' },
    dyslexiaFont: { de: 'Dyslexie-Schrift', en: 'Dyslexia Font' },
    keyboardNav: { de: 'Tastaturnavigation', en: 'Keyboard Navigation' }
  };
  
  return texts[key]?.[lang] || texts[key]?.en || key;
}

/**
 * Initialize accessibility panel
 */
function initAccessibilityPanel() {
  const panel = document.createElement('div');
  panel.className = 'accessibility-panel';
  panel.innerHTML = `
    <button class="accessibility-panel__toggle" aria-label="Accessibility settings" onclick="toggleAccessibilityMenu()">
      ♿
    </button>
    <div class="accessibility-panel__menu" id="accessibility-menu" hidden>
      <div class="accessibility-panel__header">
        <h3>♿ ${getLocalizedText('accessibility') || 'Accessibility'}</h3>
      </div>
      
      <div class="accessibility-option">
        <span class="accessibility-option__label">${getLocalizedText('fontSize')}</span>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn btn--small" onclick="setFontSize('small')" data-size="small">A</button>
          <button class="btn btn--small" onclick="setFontSize('normal')" data-size="normal">A</button>
          <button class="btn btn--small" onclick="setFontSize('large')" data-size="large">A</button>
          <button class="btn btn--small" onclick="setFontSize('extra-large')" data-size="extra-large">A</button>
        </div>
      </div>
      
      <div class="accessibility-option">
        <span class="accessibility-option__label">${getLocalizedText('highContrast')}</span>
        <div class="toggle-switch ${accessibilityState.highContrast ? 'active' : ''}" 
          onclick="toggleAccessibility('highContrast')" role="switch" aria-checked="${accessibilityState.highContrast}"></div>
      </div>
      
      <div class="accessibility-option">
        <span class="accessibility-option__label">${getLocalizedText('reducedMotion')}</span>
        <div class="toggle-switch ${accessibilityState.reducedMotion ? 'active' : ''}" 
          onclick="toggleAccessibility('reducedMotion')" role="switch" aria-checked="${accessibilityState.reducedMotion}"></div>
      </div>
      
      <div class="accessibility-option">
        <span class="accessibility-option__label">${getLocalizedText('dyslexiaFont')}</span>
        <div class="toggle-switch ${accessibilityState.dyslexiaFont ? 'active' : ''}" 
          onclick="toggleAccessibility('dyslexiaFont')" role="switch" aria-checked="${accessibilityState.dyslexiaFont}"></div>
      </div>
      
      <div class="accessibility-option">
        <span class="accessibility-option__label">${getLocalizedText('keyboardNav')}</span>
        <div class="toggle-switch ${accessibilityState.keyboardNav ? 'active' : ''}" 
          onclick="toggleAccessibility('keyboardNav')" role="switch" aria-checked="${accessibilityState.keyboardNav}"></div>
      </div>
      
      <div style="margin-top: var(--space-3); text-align: center;">
        <button class="btn btn--secondary btn--small" onclick="resetAccessibility()">
          Reset
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(panel);
}

/**
 * Toggle accessibility menu
 */
function toggleAccessibilityMenu() {
  const menu = document.getElementById('accessibility-menu');
  if (menu) {
    const isHidden = menu.hidden;
    menu.hidden = !isHidden;
    if (isHidden) menu.classList.add('active');
    else menu.classList.remove('active');
  }
}

/**
 * Set font size
 */
function setFontSize(size) {
  accessibilityState.fontSize = size;
  saveAccessibilityPreferences();
  applyAccessibilityPreferences();
  
  // Update button states
  document.querySelectorAll('[data-size]').forEach(btn => {
    btn.classList.toggle('btn--primary', btn.dataset.size === size);
    btn.classList.toggle('btn--secondary', btn.dataset.size !== size);
  });
}

/**
 * Toggle accessibility option
 */
function toggleAccessibility(option) {
  accessibilityState[option] = !accessibilityState[option];
  saveAccessibilityPreferences();
  applyAccessibilityPreferences();
  
  // Update toggle state
  const toggles = document.querySelectorAll('.toggle-switch');
  toggles.forEach(toggle => {
    const label = toggle.closest('.accessibility-option')?.querySelector('.accessibility-option__label')?.textContent;
    if (label === getLocalizedText(option)) {
      toggle.classList.toggle('active', accessibilityState[option]);
    }
  });
}

/**
 * Reset accessibility preferences
 */
function resetAccessibility() {
  accessibilityState = {
    fontSize: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    highContrast: false,
    reducedMotion: false,
    dyslexiaFont: false,
    keyboardNav: false,
    visibleFocus: false
  };
  
  saveAccessibilityPreferences();
  applyAccessibilityPreferences();
  
  showToast('Accessibility settings reset', 'success');
}

/**
 * Initialize keyboard navigation
 */
function initKeyboardNavigation() {
  // Track tab key presses
  let tabCount = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      tabCount++;
      
      if (tabCount === 1) {
        accessibilityState.keyboardNav = true;
        
        // Show indicator
        const indicator = document.querySelector('.keyboard-nav-indicator');
        if (indicator) {
          indicator.classList.add('active');
          setTimeout(() => indicator.classList.remove('active'), 3000);
        }
      }
    }
  });
  
  // Create keyboard nav indicator
  const indicator = document.createElement('div');
  indicator.className = 'keyboard-nav-indicator';
  indicator.textContent = '⌨️ Keyboard Navigation';
  document.body.appendChild(indicator);
  
  // Make all interactive elements keyboard accessible
  document.querySelectorAll('button, a, input, select, textarea, [tabindex]').forEach(el => {
    el.addEventListener('focus', () => {
      el.classList.add('keyboard-focus');
    });
    el.addEventListener('blur', () => {
      el.classList.remove('keyboard-focus');
    });
  });
  
  // Add keyboard focus styles
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-focus { outline: 3px solid var(--color-primary) !important; outline-offset: 2px !important; }
    *:focus { outline: none; }
  `;
  document.head.appendChild(style);
}

/**
 * Check system preferences
 */
function checkSystemPreferences() {
  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches && !localStorage.getItem('devmiro_accessibility')) {
    accessibilityState.reducedMotion = true;
    applyAccessibilityPreferences();
  }
  
  // Check prefers-contrast
  const prefersContrast = window.matchMedia('(prefers-contrast: more)');
  if (prefersContrast.matches) {
    accessibilityState.highContrast = true;
    applyAccessibilityPreferences();
  }
}

/**
 * Listen for preference changes
 */
function listenForPreferenceChanges() {
  // Listen for system preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
      accessibilityState.reducedMotion = true;
    } else {
      accessibilityState.reducedMotion = false;
    }
    applyAccessibilityPreferences();
  });
  
  window.matchMedia('(prefers-contrast: more)').addEventListener('change', (e) => {
    if (e.matches) {
      accessibilityState.highContrast = true;
    } else {
      accessibilityState.highContrast = false;
    }
    applyAccessibilityPreferences();
  });
}

/**
 * Get accessibility state
 */
function getAccessibilityState() {
  return {
    ...accessibilityState,
    config: accessibilityConfig,
    isKeyboardUser: accessibilityState.keyboardNav
  };
}

// Export for global use
window.accessibilityConfig = accessibilityConfig;
window.accessibilityState = accessibilityState;
window.toggleAccessibilityMenu = toggleAccessibilityMenu;
window.setFontSize = setFontSize;
window.toggleAccessibility = toggleAccessibility;
window.resetAccessibility = resetAccessibility;
window.getAccessibilityState = getAccessibilityState;