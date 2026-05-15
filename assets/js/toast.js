/* Toast Notification JavaScript */

class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.maxVisible = 3;
    this.defaultDuration = 5000;
    this.init();
  }

  init() {
    // Create container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.toast-container');
    }
  }

  show(options = {}) {
    const {
      type = 'info',
      title = '',
      message = '',
      duration = this.defaultDuration,
      action = null,
      icon = null
    } = options;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__icon">
        ${icon || this.getDefaultIcon(type)}
      </div>
      <div class="toast__content">
        ${title ? `<div class="toast__title">${title}</div>` : ''}
        <div class="toast__message">${message}</div>
        ${action ? `
          <div class="toast__action">
            <button class="toast__action-btn" data-action="${action.callback}">${action.label}</button>
          </div>
        ` : ''}
      </div>
      <button class="toast__close" aria-label="Schließen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      ${duration > 0 ? `<div class="toast__progress"></div>` : ''}
    `;

    // Event Listeners
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => this.remove(toast));

    const actionBtn = toast.querySelector('.toast__action-btn');
    if (actionBtn && action.callback) {
      actionBtn.addEventListener('click', () => {
        action.callback();
        this.remove(toast);
      });
    }

    // Add to container
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Remove excess toasts
    this.cleanup();

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }

    return toast;
  }

  remove(toast) {
    if (!toast || !toast.parentElement) return;

    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 300);
  }

  cleanup() {
    const visibleToasts = this.container.querySelectorAll('.toast:not(.removing)');
    if (visibleToasts.length > this.maxVisible) {
      const toRemove = visibleToasts.length - this.maxVisible;
      for (let i = 0; i < toRemove; i++) {
        this.remove(visibleToasts[i]);
      }
    }
  }

  getDefaultIcon(type) {
    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>`,
      error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>`
    };
    return icons[type] || icons.info;
  }

  // Convenience methods
  success(message, options = {}) {
    return this.show({ type: 'success', message, ...options });
  }

  error(message, options = {}) {
    return this.show({ type: 'error', message, ...options });
  }

  warning(message, options = {}) {
    return this.show({ type: 'warning', message, ...options });
  }

  info(message, options = {}) {
    return this.show({ type: 'info', message, ...options });
  }
}

// Initialize globally
const toast = new ToastManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToastManager;
}

// Add to window for script tag usage
window.toast = toast;