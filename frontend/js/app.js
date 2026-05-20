/**
 * App Entry Point
 * Registers all routes and initializes the SPA
 */
document.addEventListener('DOMContentLoaded', () => {
  // Register routes
  Router.add('/', (params) => HomePage.render(params));
  Router.add('/login', (params) => LoginPage.render(params));
  Router.add('/register', (params) => RegisterPage.render(params));
  Router.add('/dashboard', (params) => DashboardPage.render(params));
  Router.add('/vehicles/:id', (params) => VehicleDetailPage.render(params));
  Router.add('/reservation/:id', (params) => ReservationPage.render(params));
  Router.add('/admin', (params) => AdminPage.render(params));

  // Render navbar based on auth state
  Navbar.render();

  // Initialize router
  Router.init();
});
