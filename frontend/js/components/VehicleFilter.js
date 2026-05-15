/**
 * VehicleFilter Component
 * Renders filter controls and handles filter/sort/search state
 */
const VehicleFilter = {
  /**
   * Generate HTML for the filter panel
   * @param {Array} categories - List of categories for the dropdown
   * @returns {string} HTML string
   */
  render(categories) {
    const categoryOptions = categories
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join('');

    return `
      <div class="filters" id="vehicle-filters">
        <div class="filters__row">
          <div class="filters__group">
            <label class="filters__label" for="filter-search">Search</label>
            <input
              type="text"
              id="filter-search"
              class="form__input"
              placeholder="Brand or model..."
            />
          </div>
          <div class="filters__group">
            <label class="filters__label" for="filter-category">Category</label>
            <select id="filter-category" class="form__select">
              <option value="">All Categories</option>
              ${categoryOptions}
            </select>
          </div>
          <div class="filters__group">
            <label class="filters__label" for="filter-fuel">Fuel Type</label>
            <select id="filter-fuel" class="form__select">
              <option value="">All</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div class="filters__group">
            <label class="filters__label" for="filter-transmission">Transmission</label>
            <select id="filter-transmission" class="form__select">
              <option value="">All</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div class="filters__group">
            <label class="filters__label" for="filter-sort">Sort By</label>
            <select id="filter-sort" class="form__select">
              <option value="">Default</option>
              <option value="pricePerDay-asc">Price: Low to High</option>
              <option value="pricePerDay-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest</option>
              <option value="year-asc">Year: Oldest</option>
              <option value="mileage-asc">Mileage: Low to High</option>
            </select>
          </div>
          <div class="filters__group">
            <label class="filters__label">&nbsp;</label>
            <button class="btn btn--secondary btn--sm" id="filter-reset">Reset</button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Get current filter values from the DOM
   * @returns {object} Filter parameters
   */
  getValues() {
    const search = document.getElementById('filter-search')?.value || '';
    const categoryId = document.getElementById('filter-category')?.value || '';
    const fuelType = document.getElementById('filter-fuel')?.value || '';
    const transmission = document.getElementById('filter-transmission')?.value || '';
    const sortValue = document.getElementById('filter-sort')?.value || '';

    const params = { search, categoryId, fuelType, transmission };

    if (sortValue) {
      const [sort, order] = sortValue.split('-');
      params.sort = sort;
      params.order = order;
    }

    return params;
  },

  /**
   * Attach change event listeners to all filter inputs
   * @param {Function} onChange - Callback when any filter changes
   */
  attachListeners(onChange) {
    const ids = ['filter-search', 'filter-category', 'filter-fuel', 'filter-transmission', 'filter-sort'];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const event = id === 'filter-search' ? 'input' : 'change';
      el.addEventListener(event, onChange);
    });

    // Reset button
    const resetBtn = document.getElementById('filter-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        ids.forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        onChange();
      });
    }
  },
};
