/**
 * Navbar Component
 * Renders role-based navigation links
 */
const Navbar = {
  render() {
    const linksEl = document.getElementById('navbar-links');
    if (!linksEl) return;

    const user = Auth.getUser();

    let links = `<li><a href="#/" class="navbar__link" data-page="home">Home</a></li>`;

    if (user) {
      links += `<li><a href="#/dashboard" class="navbar__link" data-page="dashboard">Dashboard</a></li>`;

      if (Auth.isAdmin()) {
        links += `<li><a href="#/admin" class="navbar__link" data-page="admin">Admin</a></li>`;
      }

      links += `
        <li class="navbar__user">
          <span class="navbar__user-name">$${Number(user.balance).toFixed(0)} • ${user.name}</span>
          <a href="#" class="navbar__link navbar__logout" id="logout-btn">Logout</a>
        </li>
      `;
    } else {
      links += `
        <li><a href="#/login" class="navbar__link" data-page="login">Login</a></li>
        <li><a href="#/register" class="navbar__link" data-page="register">Register</a></li>
      `;
    }

    linksEl.innerHTML = links;

    // Logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
        Navbar.render();
        Router.navigate('/');
        Toast.success('Logged out');
      });
    }

    // Highlight active link
    Navbar.setActive();
  },

  setActive() {
    const hash = window.location.hash || '#/';
    const page = hash.replace('#/', '').split('/')[0] || 'home';

    document.querySelectorAll('.navbar__link').forEach((link) => {
      link.classList.toggle('active', link.dataset.page === page);
    });
  },
};
