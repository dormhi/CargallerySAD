/**
 * Reservation Page
 * Booking form with balance check and auto-fill user info
 */
const ReservationPage = {
  vehicle: null,

  async render(params) {
    const app = document.getElementById('app');
    const vehicleId = Number(params.id);

    // Require login
    if (!Auth.isLoggedIn()) {
      Toast.warning('Please login to make a reservation');
      Router.navigate('/login');
      return;
    }

    app.innerHTML = `<div class="container"><div class="loading"><div class="loading__spinner"></div></div></div>`;

    try {
      const [vehicleRes, profileRes] = await Promise.all([
        api.getVehicle(vehicleId),
        api.getProfile(),
      ]);
      ReservationPage.vehicle = vehicleRes.data;
      const user = profileRes.data;
      Auth.setUser(user);

      if (!ReservationPage.vehicle.available) {
        app.innerHTML = `
          <div class="container">
            <a href="#/vehicles/${vehicleId}" class="back-link">← Back to vehicle</a>
            <div class="empty-state"><div class="empty-state__icon">🚫</div><p>This vehicle is not available</p></div>
          </div>
        `;
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      app.innerHTML = `
        <div class="container">
          <a href="#/vehicles/${vehicleId}" class="back-link">← Back to vehicle</a>
          <div class="page-header">
            <h1 class="page-header__title">Reserve ${ReservationPage.vehicle.brand} ${ReservationPage.vehicle.model}</h1>
            <p class="page-header__subtitle">Your balance: <strong>$${Number(user.balance).toFixed(2)}</strong></p>
          </div>

          <div class="vehicle-detail" style="max-width: 900px;">
            <div>
              <div class="reservation-card">
                <h3 class="reservation-card__title">Booking Details</h3>
                <form class="form" id="reservation-form">
                  <div class="form__group">
                    <label class="form__label">Renting As</label>
                    <input type="text" class="form__input" value="${user.name}" disabled />
                  </div>
                  <div class="form__row">
                    <div class="form__group">
                      <label class="form__label" for="res-start-date">Start Date *</label>
                      <input type="date" id="res-start-date" class="form__input" min="${today}" required />
                    </div>
                    <div class="form__group">
                      <label class="form__label" for="res-start-time">Start Time *</label>
                      <input type="time" id="res-start-time" class="form__input" value="09:00" required />
                    </div>
                  </div>
                  <div class="form__row">
                    <div class="form__group">
                      <label class="form__label" for="res-end-date">End Date *</label>
                      <input type="date" id="res-end-date" class="form__input" min="${today}" required />
                    </div>
                    <div class="form__group">
                      <label class="form__label" for="res-end-time">End Time *</label>
                      <input type="time" id="res-end-time" class="form__input" value="09:00" required />
                    </div>
                  </div>
                  <span class="form__error" id="error-general"></span>
                  <button type="submit" class="btn btn--primary btn--block" id="res-submit">Confirm Reservation</button>
                </form>
              </div>
            </div>
            <div>
              <div class="reservation-card">
                <h3 class="reservation-card__title">Price Summary</h3>
                <div class="reservation-card__row">
                  <span class="reservation-card__label">Vehicle</span>
                  <span class="reservation-card__value">${ReservationPage.vehicle.brand} ${ReservationPage.vehicle.model}</span>
                </div>
                <div class="reservation-card__row">
                  <span class="reservation-card__label">Price per day</span>
                  <span class="reservation-card__value">$${Number(ReservationPage.vehicle.pricePerDay).toFixed(2)}</span>
                </div>
                <div class="reservation-card__row">
                  <span class="reservation-card__label">Duration</span>
                  <span class="reservation-card__value" id="res-days">— days</span>
                </div>
                <div class="reservation-card__row">
                  <span class="reservation-card__label">Your Balance</span>
                  <span class="reservation-card__value">$${Number(user.balance).toFixed(2)}</span>
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

      document.getElementById('res-start-date').addEventListener('change', () => ReservationPage.updatePreview());
      document.getElementById('res-end-date').addEventListener('change', () => ReservationPage.updatePreview());
      document.getElementById('res-start-time').addEventListener('change', () => ReservationPage.updatePreview());
      document.getElementById('res-end-time').addEventListener('change', () => ReservationPage.updatePreview());
      document.getElementById('reservation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        ReservationPage.handleSubmit();
      });
    } catch (error) {
      app.innerHTML = `<div class="container"><a href="#/" class="back-link">← Back</a><div class="empty-state"><p>Vehicle not found</p></div></div>`;
    }
  },

  updatePreview() {
    const startDate = document.getElementById('res-start-date').value;
    const endDate = document.getElementById('res-end-date').value;
    const daysEl = document.getElementById('res-days');
    const totalEl = document.getElementById('res-total');

    if (!startDate || !endDate) { daysEl.textContent = '— days'; totalEl.textContent = '$0.00'; return; }
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if (days <= 0) { daysEl.textContent = '— days'; totalEl.textContent = '$0.00'; return; }
    const total = days * Number(ReservationPage.vehicle.pricePerDay);
    daysEl.textContent = `${days} day${days !== 1 ? 's' : ''}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  },

  async handleSubmit() {
    const startDate = document.getElementById('res-start-date').value;
    const startTime = document.getElementById('res-start-time').value;
    const endDate = document.getElementById('res-end-date').value;
    const endTime = document.getElementById('res-end-time').value;
    const errorEl = document.getElementById('error-general');

    if (!startDate || !endDate) { errorEl.textContent = 'Please select valid dates'; return; }

    const startFull = new Date(`${startDate}T${startTime}`);
    const endFull = new Date(`${endDate}T${endTime}`);
    const now = new Date();

    // Past date check
    if (startFull < now) {
      errorEl.textContent = 'Start date/time cannot be in the past';
      return;
    }
    if (endFull <= startFull) {
      errorEl.textContent = 'End date must be after start date';
      return;
    }

    const submitBtn = document.getElementById('res-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
      await api.createReservation({
        vehicleId: ReservationPage.vehicle.id,
        startDate: startFull.toISOString(),
        endDate: endFull.toISOString(),
      });
      Toast.success('Reservation created! Balance deducted.');
      Navbar.render();
      Router.navigate('/dashboard');
    } catch (error) {
      errorEl.textContent = error.message;
      Toast.error(error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Reservation';
    }
  },
};
