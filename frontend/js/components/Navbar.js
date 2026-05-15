/**
 * Navbar Component
 * Handles active link highlighting based on current route
 */
const Navbar = {
  /**
   * Set the active navbar link based on current hash
   * @param {string} hash - Current hash path
   */
  setActive(hash) {
    const links = document.querySelectorAll('.navbar__link');
    links.forEach((link) => {
      link.classList.remove('active');

      const page = link.dataset.page;
      if (page === 'home' && (hash === '/' || hash.startsWith('/vehicles'))) {
        link.classList.add('active');
      } else if (page === 'admin' && hash === '/admin') {
        link.classList.add('active');
      }
    });
  },
};
