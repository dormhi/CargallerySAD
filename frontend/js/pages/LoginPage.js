/**
 * Login Page
 */
const LoginPage = {
  async render() {
    const app = document.getElementById('app');
    if (Auth.isLoggedIn()) {
      Router.navigate('/dashboard');
      return;
    }

    app.innerHTML = `
      <div class="container">
        <div class="auth-card">
          <h1 class="auth-card__title">Welcome Back</h1>
          <p class="auth-card__subtitle">Sign in to your account</p>
          <form class="form" id="login-form">
            <div class="form__group">
              <label class="form__label" for="login-email">Email / Username</label>
              <input type="text" id="login-email" class="form__input" placeholder="your@email.com" required />
            </div>
            <div class="form__group">
              <label class="form__label" for="login-password">Password</label>
              <input type="password" id="login-password" class="form__input" placeholder="••••••••" required />
            </div>
            <span class="form__error" id="login-error"></span>
            <button type="submit" class="btn btn--primary btn--block" id="login-btn">Sign In</button>
          </form>
          <p class="auth-card__footer">Don't have an account? <a href="#/register">Sign up</a></p>
        </div>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');

      // Client-side validation
      if (!email) { errorEl.textContent = 'Email is required'; return; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { errorEl.textContent = 'Please enter a valid email address'; return; }
      if (!password) { errorEl.textContent = 'Password is required'; return; }
      errorEl.textContent = '';

      const btn = document.getElementById('login-btn');
      btn.disabled = true;
      btn.textContent = 'Signing in...';

      try {
        const response = await api.login(email, password);
        Auth.setUser(response.data);
        Toast.success(`Welcome, ${response.data.name}!`);
        Navbar.render();
        Router.navigate(Auth.isAdmin() ? '/admin' : '/dashboard');
      } catch (error) {
        errorEl.textContent = error.message;
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });
  },
};
