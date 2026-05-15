/**
 * Modal Component
 * Reusable modal dialog for forms and confirmations
 */
const Modal = {
  /**
   * Open the modal with title and body content
   * @param {string} title - Modal title
   * @param {string} bodyHTML - HTML content for modal body
   */
  open(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-overlay').classList.add('active');
  },

  /**
   * Close the modal
   */
  close() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('modal-body').innerHTML = '';
  },

  /**
   * Initialize modal event listeners
   */
  init() {
    // Close on X button
    document.getElementById('modal-close').addEventListener('click', () => this.close());

    // Close on overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') this.close();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => Modal.init());
