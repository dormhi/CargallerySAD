/**
 * SPA Router
 * Hash-based routing for single page application
 * Listens to hashchange events and renders the matching page
 */
const Router = {
  routes: [],

  /**
   * Register a route
   * @param {string} path - Hash path pattern (e.g. '/vehicles/:id')
   * @param {Function} handler - Page render function
   */
  add(path, handler) {
    this.routes.push({ path, handler });
  },

  /**
   * Parse the current hash and extract params
   * @param {string} pattern - Route pattern with :param placeholders
   * @param {string} hash - Current hash value
   * @returns {object|null} Extracted params or null if no match
   */
  matchRoute(pattern, hash) {
    const patternParts = pattern.split('/');
    const hashParts = hash.split('/');

    if (patternParts.length !== hashParts.length) return null;

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = hashParts[i];
      } else if (patternParts[i] !== hashParts[i]) {
        return null;
      }
    }

    return params;
  },

  /**
   * Resolve and render the current route
   */
  async resolve() {
    const hash = window.location.hash.slice(1) || '/';

    for (const route of this.routes) {
      const params = this.matchRoute(route.path, hash);
      if (params !== null) {
        try {
          await route.handler(params);
        } catch (error) {
          console.error('Router error:', error);
          document.getElementById('app').innerHTML = `
            <div class="container">
              <div class="empty-state">
                <div class="empty-state__icon">⚠️</div>
                <p>Something went wrong. Please try again.</p>
              </div>
            </div>
          `;
        }
        Navbar.setActive(hash);
        return;
      }
    }

    // 404 - No matching route
    document.getElementById('app').innerHTML = `
      <div class="container">
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <p>Page not found</p>
          <a href="#/" class="btn btn--primary" style="margin-top: 1rem;">Go Home</a>
        </div>
      </div>
    `;
  },

  /**
   * Navigate to a hash path
   * @param {string} path - Target path
   */
  navigate(path) {
    window.location.hash = path;
  },

  /**
   * Initialize the router
   */
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },
};
