/**
 * Vehicle Detail Page
 * Shows full vehicle information with specs and active reservations
 */
const VehicleDetailPage = {
  async render(params) {
    const app = document.getElementById('app');
    const vehicleId = Number(params.id);

    // Show loading
    app.innerHTML = `
      <div class="container">
        <div class="loading">
          <div class="loading__spinner"></div>
          <p>Loading vehicle details...</p>
        </div>
      </div>
    `;

    try {
      const response = await api.getVehicle(vehicleId);
      const vehicle = response.data;
      const categoryName = vehicle.category?.name || 'Uncategorized';
      const imageUrl = vehicle.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800';
      const statusClass = vehicle.available ? 'available' : 'unavailable';
      const statusText = vehicle.available ? 'Available' : 'Unavailable';

      // Build active reservations list
      let reservationsHTML = '';
      if (vehicle.reservations && vehicle.reservations.length > 0) {
        const rows = vehicle.reservations.map((r) => `
          <tr>
            <td>${r.customerName}</td>
            <td>${new Date(r.startDate).toLocaleDateString()}</td>
            <td>${new Date(r.endDate).toLocaleDateString()}</td>
            <td><span class="badge badge--${r.status}">${r.status}</span></td>
          </tr>
        `).join('');

        reservationsHTML = `
          <div style="margin-top: var(--space-2xl);">
            <h3 style="margin-bottom: var(--space-md);">Active Reservations</h3>
            <div class="table-wrapper">
              <table class="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        `;
      }

      app.innerHTML = `
        <div class="container">
          <a href="#/" class="back-link">← Back to vehicles</a>

          <div class="vehicle-detail">
            <img
              class="vehicle-detail__image"
              src="${imageUrl}"
              alt="${vehicle.brand} ${vehicle.model}"
              onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'"
            />
            <div class="vehicle-detail__info">
              <div>
                <span class="vehicle-card__category">${categoryName}</span>
                <h1 class="vehicle-detail__title">${vehicle.brand} ${vehicle.model}</h1>
              </div>

              <div class="vehicle-detail__price">
                $${Number(vehicle.pricePerDay).toFixed(2)} <span>/ day</span>
              </div>

              <div class="vehicle-detail__specs">
                <div class="vehicle-detail__spec">
                  <span class="vehicle-detail__spec-label">Year</span>
                  <span class="vehicle-detail__spec-value">${vehicle.year}</span>
                </div>
                <div class="vehicle-detail__spec">
                  <span class="vehicle-detail__spec-label">Fuel Type</span>
                  <span class="vehicle-detail__spec-value">${vehicle.fuelType}</span>
                </div>
                <div class="vehicle-detail__spec">
                  <span class="vehicle-detail__spec-label">Transmission</span>
                  <span class="vehicle-detail__spec-value">${vehicle.transmission}</span>
                </div>
                <div class="vehicle-detail__spec">
                  <span class="vehicle-detail__spec-label">Mileage</span>
                  <span class="vehicle-detail__spec-value">${vehicle.mileage.toLocaleString()} km</span>
                </div>
              </div>

              <div>
                <span class="vehicle-card__status vehicle-card__status--${statusClass}" style="font-size: 0.9rem;">
                  ${statusText}
                </span>
              </div>

              ${vehicle.available ? `
                <a href="#/reservation/${vehicle.id}" class="btn btn--primary btn--block">
                  Reserve This Vehicle
                </a>
              ` : `
                <button class="btn btn--secondary btn--block" disabled>
                  Currently Unavailable
                </button>
              `}
            </div>
          </div>

          ${reservationsHTML}
        </div>
      `;
    } catch (error) {
      app.innerHTML = `
        <div class="container">
          <a href="#/" class="back-link">← Back to vehicles</a>
          <div class="empty-state">
            <div class="empty-state__icon">🚫</div>
            <p>Vehicle not found</p>
          </div>
        </div>
      `;
    }
  },
};
