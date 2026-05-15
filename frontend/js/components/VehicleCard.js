/**
 * VehicleCard Component
 * Renders a single vehicle card for the grid listing
 */
const VehicleCard = {
  /**
   * Generate HTML for a vehicle card
   * @param {object} vehicle - Vehicle data object
   * @returns {string} HTML string
   */
  render(vehicle) {
    const statusClass = vehicle.available ? 'available' : 'unavailable';
    const statusText = vehicle.available ? 'Available' : 'Unavailable';
    const categoryName = vehicle.category?.name || 'Uncategorized';
    const imageUrl = vehicle.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800';

    return `
      <article class="vehicle-card" onclick="Router.navigate('/vehicles/${vehicle.id}')" id="vehicle-card-${vehicle.id}">
        <img
          class="vehicle-card__image"
          src="${imageUrl}"
          alt="${vehicle.brand} ${vehicle.model}"
          onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'"
        />
        <div class="vehicle-card__body">
          <span class="vehicle-card__category">${categoryName}</span>
          <h3 class="vehicle-card__title">${vehicle.brand} ${vehicle.model}</h3>
          <div class="vehicle-card__specs">
            <span class="vehicle-card__spec">📅 ${vehicle.year}</span>
            <span class="vehicle-card__spec">⛽ ${vehicle.fuelType}</span>
            <span class="vehicle-card__spec">⚙️ ${vehicle.transmission}</span>
            <span class="vehicle-card__spec">🛣️ ${vehicle.mileage.toLocaleString()} km</span>
          </div>
          <div class="vehicle-card__footer">
            <div class="vehicle-card__price">
              $${Number(vehicle.pricePerDay).toFixed(2)} <span>/ day</span>
            </div>
            <span class="vehicle-card__status vehicle-card__status--${statusClass}">
              ${statusText}
            </span>
          </div>
        </div>
      </article>
    `;
  },
};
