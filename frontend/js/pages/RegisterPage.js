/**
 * Register Page
 */
const RegisterPage = {
  async render() {
    const app = document.getElementById('app');
    if (Auth.isLoggedIn()) {
      Router.navigate('/dashboard');
      return;
    }

    app.innerHTML = `
      <div class="container">
        <div class="auth-card">
          <h1 class="auth-card__title">Create Account</h1>
          <p class="auth-card__subtitle">Start renting vehicles today</p>
          <form class="form" id="register-form">
            <div class="form__group">
              <label class="form__label" for="reg-name">Full Name</label>
              <input type="text" id="reg-name" class="form__input" placeholder="John Doe" required />
            </div>
            <div class="form__group">
              <label class="form__label" for="reg-email">Email</label>
              <input type="text" id="reg-email" class="form__input" placeholder="your@email.com" required />
            </div>
            <div class="form__group">
              <label class="form__label" for="reg-phone">Phone</label>
              <input type="tel" id="reg-phone" class="form__input" placeholder="+90 555 123 4567" />
            </div>
            <div class="form__group">
              <label class="form__label" for="reg-password">Password</label>
              <input type="password" id="reg-password" class="form__input" placeholder="Min 4 characters" required minlength="4" />
            </div>
            <span class="form__error" id="reg-error"></span>
            <button type="submit" class="btn btn--primary btn--block" id="reg-btn">Create Account</button>
          </form>
          <p class="auth-card__footer">Already have an account? <a href="#/login">Sign in</a></p>
        </div>
      </div>
    `;

    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('reg-btn');
      btn.disabled = true;
      btn.textContent = 'Creating account...';

      try {
        const response = await api.register({
          name: document.getElementById('reg-name').value.trim(),
          email: document.getElementById('reg-email').value.trim(),
          phone: document.getElementById('reg-phone').value.trim(),
          password: document.getElementById('reg-password').value,
        });
        Auth.setUser(response.data);
        Toast.success('Account created! You have $10,000 starting balance.');
        Navbar.render();
        Router.navigate('/dashboard');
      } catch (error) {
        document.getElementById('reg-error').textContent = error.message;
        btn.disabled = false;
        btn.textContent = 'Create Account';
      }
    });
  },
};
