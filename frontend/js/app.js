/**
 * App Entry Point
 * Registers all routes and initializes the SPA
 */
document.addEventListener('DOMContentLoaded', () => {
  // Register routes (arrow wrappers preserve object context)
  Router.add('/', (params) => HomePage.render(params));
  Router.add('/vehicles/:id', (params) => VehicleDetailPage.render(params));
  Router.add('/reservation/:id', (params) => ReservationPage.render(params));
  Router.add('/admin', (params) => AdminPage.render(params));

  // Initialize router
  Router.init();
});
