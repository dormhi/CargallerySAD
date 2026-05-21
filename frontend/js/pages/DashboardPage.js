/**
 * Dashboard Page
 * Shows user balance, add balance form, and rental history with remaining days
 */
const DashboardPage = {
  async render() {
    const app = document.getElementById('app');
    if (!Auth.isLoggedIn()) {
      Router.navigate('/login');
      return;
    }

    app.innerHTML = `<div class="container"><div class="loading"><div class="loading__spinner"></div></div></div>`;

    try {
      const [profileRes, reservationsRes] = await Promise.all([
        api.getProfile(),
        api.getReservations(),
      ]);

      const user = profileRes.data;
      // Update stored user data
      Auth.setUser(user);

      const myReservations = reservationsRes.data.filter((r) => r.userId === user.id);
      const today = new Date();

      const reservationRows = myReservations.length === 0
        ? `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No rentals yet</td></tr>`
        : myReservations.map((r) => {
            const endDate = new Date(r.endDate);
            const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            const remaining = r.status === 'cancelled' ? '—' : diffDays > 0 ? `${diffDays} days` : 'Completed';
            const statusLabel = r.status === 'cancel_requested' ? 'Cancel Req.' : r.status;
            const canRequestCancel = (r.status === 'pending' || r.status === 'approved') && diffDays > 0;
            return `
              <tr>
                <td>${r.vehicle?.brand || ''} ${r.vehicle?.model || ''}</td>
                <td>${new Date(r.startDate).toLocaleDateString()}</td>
                <td>${endDate.toLocaleDateString()}</td>
                <td>$${Number(r.totalPrice).toFixed(2)}</td>
                <td><span class="badge badge--${r.status}">${statusLabel}</span></td>
                <td>${remaining}</td>
                <td>
                  ${canRequestCancel ? `<button class="btn btn--danger btn--sm req-cancel" data-id="${r.id}">Request Cancel</button>` : ''}
                  ${r.status === 'cancel_requested' ? '<span style="color:var(--warning);font-size:0.8rem;">⏳ Awaiting admin</span>' : ''}
                </td>
              </tr>
            `;
          }).join('');

      app.innerHTML = `
        <div class="container">
          <div class="page-header">
            <h1 class="page-header__title">My Dashboard</h1>
            <p class="page-header__subtitle">Welcome back, ${user.name}</p>
          </div>

          <div class="dashboard-grid">
            <div class="reservation-card">
              <h3 class="reservation-card__title">💰 Balance</h3>
              <div class="dashboard-balance">$${Number(user.balance).toFixed(2)}</div>
              <form class="form" id="balance-form" style="margin-top:var(--space-lg);">
                <div class="form__row">
                  <div class="form__group">
                    <input type="number" id="balance-amount" class="form__input" placeholder="Amount ($)" min="1" step="0.01" required />
                  </div>
                  <div class="form__group">
                    <button type="submit" class="btn btn--primary">Add Balance</button>
                  </div>
                </div>
              </form>
            </div>

            <div class="reservation-card">
              <h3 class="reservation-card__title">📊 Stats</h3>
              <div class="reservation-card__row">
                <span class="reservation-card__label">Total Rentals</span>
                <span class="reservation-card__value">${myReservations.length}</span>
              </div>
              <div class="reservation-card__row">
                <span class="reservation-card__label">Active</span>
                <span class="reservation-card__value">${myReservations.filter((r) => r.status !== 'cancelled').length}</span>
              </div>
              <div class="reservation-card__row">
                <span class="reservation-card__label">Role</span>
                <span class="reservation-card__value" style="text-transform:capitalize;">${user.role.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div style="margin-top:var(--space-2xl);">
            <h2 style="margin-bottom:var(--space-lg);">My Rentals</h2>
            <div class="table-wrapper">
              <table class="table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Remaining</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>${reservationRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      // Add balance form
      document.getElementById('balance-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = Number(document.getElementById('balance-amount').value);
        try {
          await api.addBalance(amount);
          Toast.success(`$${amount.toFixed(2)} added to your balance!`);
          DashboardPage.render();
        } catch (error) {
          Toast.error(error.message);
        }
      });

      // Cancel request buttons
      document.querySelectorAll('.req-cancel').forEach((btn) => btn.addEventListener('click', async () => {
        if (!confirm('Request cancellation for this reservation? Admin will review your request.')) return;
        try {
          await api.updateReservationStatus(btn.dataset.id, 'cancel_requested');
          Toast.success('Cancellation request sent to admin');
          DashboardPage.render();
        } catch (error) {
          Toast.error(error.message);
        }
      }));
    } catch (error) {
      app.innerHTML = `<div class="container"><div class="empty-state"><p>Failed to load dashboard</p></div></div>`;
    }
  },
};
