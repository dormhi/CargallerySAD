/**
 * Reservation Page
 * Booking form with client-side validation and price preview
 */
const ReservationPage = {
  vehicle: null,

  async render(params) {
    const app = document.getElementById('app');
    const vehicleId = Number(params.id);

    app.innerHTML = `
      <div class="container">
        <div class="loading">
          <div class="loading__spinner"></div>
          <p>Loading vehicle info...</p>
        </div>
      </div>
    `;

    try {
      const response = await api.getVehicle(vehicleId);
      this.vehicle = response.data;

      if (!this.vehicle.available) {
        app.innerHTML = `
          <div class="container">
            <a href="#/vehicles/${vehicleId}" class="back-link">← Back to vehicle</a>
            <div class="empty-state">
              <div class="empty-state__icon">🚫</div>
              <p>This vehicle is not available for reservation</p>
            </div>
          </div>
        `;
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      app.innerHTML = `
        <div class="container">
          <a href="#/vehicles/${vehicleId}" class="back-link">← Back to vehicle</a>

          <div class="page-header">
            <h1 class="page-header__title">Reserve ${this.vehicle.brand} ${this.vehicle.model}</h1>
            <p class="page-header__subtitle">Fill in your details to book this vehicle</p>
          </div>

          <div class="vehicle-detail" style="max-width: 900px;">
            <div>
              <div class="reservation-card">
                <h3 class="reservation-card__title">Booking Details</h3>
                <form class="form" id="reservation-form">
                  <div class="form__group">
                    <label class="form__label" for="res-name">Full Name *</label>
                    <input type="text" id="res-name" class="form__input" placeholder="John Doe" required />
                    <span class="form__error" id="error-name"></span>
                  </div>

                  <div class="form__group">
                    <label class="form__label" for="res-phone">Phone Number *</label>
                    <input type="tel" id="res-phone" class="form__input" placeholder="+90 555 123 4567" required />
                    <span class="form__error" id="error-phone"></span>
                  </div>

                  <div class="form__row">
                    <div class="form__group">
                      <label class="form__label" for="res-start">Start Date *</label>
                      <input type="date" id="res-start" class="form__input" min="${today}" required />
                      <span class="form__error" id="error-start"></span>
                    </div>
                    <div class="form__group">
                      <label class="form__label" for="res-end">End Date *</label>
                      <input type="date" id="res-end" class="form__input" min="${today}" required />
                      <span class="form__error" id="error-end"></span>
                    </div>
                  </div>

                  <span class="form__error" id="error-general"></span>

                  <button type="submit" class="btn btn--primary btn--block" id="res-submit">
                    Confirm Reservation
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div class="reservation-card">
                <h3 class="reservation-card__title">Price Summary</h3>
                <div class="reservation-card__row">
                  <span class="reservation-card__label">Vehicle</span>
                  <span class="reservation-card__value">${this.vehicle.brand} ${this.vehicle.model}</span>
                </div>
                <div class="reservation-card__row">
                  <span class="reservation-card__label">Price per day</span>
                  <span class="reservation-card__value">$${Number(this.vehicle.pricePerDay).toFixed(2)}</span>
                </div>
                <div class="reservation-card__row">
                  <span class="reservation-card__label">Duration</span>
                  <span class="reservation-card__value" id="res-days">— days</span>
                </div>
                <div class="reservation-card__total">
                  <span>Total</span>
                  <span class="reservation-card__total-price" id="res-total">$0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      this.attachListeners();
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

  attachListeners() {
    const startInput = document.getElementById('res-start');
    const endInput = document.getElementById('res-end');
    const form = document.getElementById('reservation-form');

    // Update price preview on date change
    startInput.addEventListener('change', () => this.updatePricePreview());
    endInput.addEventListener('change', () => this.updatePricePreview());

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  updatePricePreview() {
    const start = document.getElementById('res-start').value;
    const end = document.getElementById('res-end').value;
    const daysEl = document.getElementById('res-days');
    const totalEl = document.getElementById('res-total');

    if (!start || !end) {
      daysEl.textContent = '— days';
      totalEl.textContent = '$0.00';
      return;
    }

    const diffTime = new Date(end) - new Date(start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      daysEl.textContent = '— days';
      totalEl.textContent = '$0.00';
      return;
    }

    const total = days * Number(this.vehicle.pricePerDay);
    daysEl.textContent = `${days} day${days !== 1 ? 's' : ''}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  },

  /**
   * Client-side validation
   * @returns {boolean}
   */
  validateForm() {
    let isValid = true;
    const name = document.getElementById('res-name').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const start = document.getElementById('res-start').value;
    const end = document.getElementById('res-end').value;

    // Clear previous errors
    document.querySelectorAll('.form__error').forEach((el) => (el.textContent = ''));

    if (name.length < 2) {
      document.getElementById('error-name').textContent = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!/^[0-9+\-() ]{7,20}$/.test(phone)) {
      document.getElementById('error-phone').textContent = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!start) {
      document.getElementById('error-start').textContent = 'Start date is required';
      isValid = false;
    }

    if (!end) {
      document.getElementById('error-end').textContent = 'End date is required';
      isValid = false;
    }

    if (start && end && new Date(end) <= new Date(start)) {
      document.getElementById('error-end').textContent = 'End date must be after start date';
      isValid = false;
    }

    return isValid;
  },

  async handleSubmit() {
    if (!this.validateForm()) return;

    const submitBtn = document.getElementById('res-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
      await api.createReservation({
        vehicleId: this.vehicle.id,
        customerName: document.getElementById('res-name').value.trim(),
        customerPhone: document.getElementById('res-phone').value.trim(),
        startDate: document.getElementById('res-start').value,
        endDate: document.getElementById('res-end').value,
      });

      Toast.success('Reservation created successfully!');
      Router.navigate(`/vehicles/${this.vehicle.id}`);
    } catch (error) {
      document.getElementById('error-general').textContent = error.message;
      Toast.error(error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Reservation';
    }
  },
};
