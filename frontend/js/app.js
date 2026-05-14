/**
 * App Entry Point
 * Registers all routes and initializes the SPA
 */
document.addEventListener('DOMContentLoaded', () => {
  // Register routes
  Router.add('/', HomePage.render);
  Router.add('/vehicles/:id', VehicleDetailPage.render);
  Router.add('/reservation/:id', ReservationPage.render);
  Router.add('/admin', AdminPage.render);

  // Initialize router
  Router.init();
});
