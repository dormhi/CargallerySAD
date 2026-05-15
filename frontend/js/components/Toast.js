/**
 * Toast Component
 * Shows temporary notification messages
 */
const Toast = {
  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - 'success' | 'error' | 'warning'
   * @param {number} duration - Auto-dismiss time in ms
   */
  show(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__message">${message}</span>
      <button class="toast__close">&times;</button>
    `;

    // Close on click
    toast.querySelector('.toast__close').addEventListener('click', () => {
      this.dismiss(toast);
    });

    container.appendChild(toast);

    // Auto dismiss
    setTimeout(() => this.dismiss(toast), duration);
  },

  /**
   * Dismiss a toast with animation
   */
  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  },

  success(message) { this.show(message, 'success'); },
  error(message) { this.show(message, 'error', 4000); },
  warning(message) { this.show(message, 'warning'); },
};
