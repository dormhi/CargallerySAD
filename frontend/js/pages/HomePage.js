/**
 * Home Page
 * Displays vehicle listing with filters, search, and sorting
 */
const HomePage = {
  async render() {
    const app = document.getElementById('app');

    // Show loading
    app.innerHTML = `
      <div class="container">
        <div class="loading">
          <div class="loading__spinner"></div>
          <p>Loading vehicles...</p>
        </div>
      </div>
    `;

    try {
      // Fetch categories for filter dropdown
      const catResponse = await api.getCategories();
      const categories = catResponse.data;

      // Build page structure
      app.innerHTML = `
        <div class="container">
          <div class="page-header">
            <h1 class="page-header__title">Browse Our Fleet</h1>
            <p class="page-header__subtitle">Find the perfect vehicle for your next trip</p>
          </div>
          ${VehicleFilter.render(categories)}
          <div class="actions-bar">
            <span class="actions-bar__count" id="vehicle-count"></span>
          </div>
          <div class="vehicle-grid" id="vehicle-grid"></div>
        </div>
      `;

      // Attach filter listeners
      VehicleFilter.attachListeners(() => this.loadVehicles());

      // Initial load
      await this.loadVehicles();
    } catch (error) {
      app.innerHTML = `
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon">⚠️</div>
            <p>Failed to load vehicles. Please try again.</p>
          </div>
        </div>
      `;
    }
  },

  /**
   * Load vehicles with current filter values
   */
  async loadVehicles() {
    const grid = document.getElementById('vehicle-grid');
    const countEl = document.getElementById('vehicle-count');

    if (!grid) return;

    grid.innerHTML = `
      <div class="loading" style="grid-column: 1 / -1;">
        <div class="loading__spinner"></div>
      </div>
    `;

    try {
      const params = VehicleFilter.getValues();
      const response = await api.getVehicles(params);
      const vehicles = response.data;

      countEl.textContent = `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} found`;

      if (vehicles.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state__icon">🔍</div>
            <p>No vehicles match your filters</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = vehicles.map((v) => VehicleCard.render(v)).join('');
    } catch (error) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state__icon">⚠️</div>
          <p>Failed to load vehicles</p>
        </div>
      `;
    }
  },
};
