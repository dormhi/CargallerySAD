/**
 * Admin Page
 * Tabbed CRUD interface for managing categories, vehicles, and reservations
 */
const AdminPage = {
  activeTab: 'vehicles',

  async render() {
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="container">
        <div class="page-header">
          <h1 class="page-header__title">Admin Panel</h1>
          <p class="page-header__subtitle">Manage vehicles, categories, and reservations</p>
        </div>

        <div class="tabs" id="admin-tabs">
          <button class="tabs__tab active" data-tab="vehicles">Vehicles</button>
          <button class="tabs__tab" data-tab="categories">Categories</button>
          <button class="tabs__tab" data-tab="reservations">Reservations</button>
        </div>

        <div id="admin-content"></div>
      </div>
    `;

    // Tab switching
    document.getElementById('admin-tabs').addEventListener('click', (e) => {
      if (e.target.classList.contains('tabs__tab')) {
        document.querySelectorAll('.tabs__tab').forEach((t) => t.classList.remove('active'));
        e.target.classList.add('active');
        this.activeTab = e.target.dataset.tab;
        this.loadTab();
      }
    });

    await this.loadTab();
  },

  async loadTab() {
    const content = document.getElementById('admin-content');
    content.innerHTML = `<div class="loading"><div class="loading__spinner"></div></div>`;

    try {
      switch (this.activeTab) {
        case 'vehicles':
          await this.renderVehicles(content);
          break;
        case 'categories':
          await this.renderCategories(content);
          break;
        case 'reservations':
          await this.renderReservations(content);
          break;
      }
    } catch (error) {
      content.innerHTML = `<div class="empty-state"><p>Failed to load data</p></div>`;
    }
  },

  // ── Categories Tab ──

  async renderCategories(container) {
    const response = await api.getCategories();
    const categories = response.data;

    container.innerHTML = `
      <div class="actions-bar">
        <span class="actions-bar__count">${categories.length} categories</span>
        <button class="btn btn--primary btn--sm" id="add-category-btn">+ Add Category</button>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Vehicles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${categories.map((c) => `
              <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c._count?.vehicles || 0}</td>
                <td>
                  <button class="btn btn--secondary btn--sm edit-cat" data-id="${c.id}" data-name="${c.name}">Edit</button>
                  <button class="btn btn--danger btn--sm delete-cat" data-id="${c.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add category
    document.getElementById('add-category-btn').addEventListener('click', () => {
      this.showCategoryForm();
    });

    // Edit buttons
    container.querySelectorAll('.edit-cat').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.showCategoryForm(btn.dataset.id, btn.dataset.name);
      });
    });

    // Delete buttons
    container.querySelectorAll('.delete-cat').forEach((btn) => {
      btn.addEventListener('click', () => this.deleteCategory(btn.dataset.id));
    });
  },

  showCategoryForm(id = null, name = '') {
    const isEdit = id !== null;
    Modal.open(isEdit ? 'Edit Category' : 'Add Category', `
      <form class="form" id="category-form">
        <div class="form__group">
          <label class="form__label" for="cat-name">Category Name *</label>
          <input type="text" id="cat-name" class="form__input" value="${name}" placeholder="e.g. SUV" required />
          <span class="form__error" id="cat-error"></span>
        </div>
        <button type="submit" class="btn btn--primary btn--block">
          ${isEdit ? 'Update' : 'Create'} Category
        </button>
      </form>
    `);

    document.getElementById('category-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const catName = document.getElementById('cat-name').value.trim();
      if (catName.length < 2) {
        document.getElementById('cat-error').textContent = 'Name must be at least 2 characters';
        return;
      }
      try {
        if (isEdit) {
          await api.updateCategory(id, { name: catName });
          Toast.success('Category updated');
        } else {
          await api.createCategory({ name: catName });
          Toast.success('Category created');
        }
        Modal.close();
        this.loadTab();
      } catch (error) {
        document.getElementById('cat-error').textContent = error.message;
      }
    });
  },

  async deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      Toast.success('Category deleted');
      this.loadTab();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  // ── Vehicles Tab ──

  async renderVehicles(container) {
    const [vResponse, cResponse] = await Promise.all([
      api.getVehicles(),
      api.getCategories(),
    ]);
    const vehicles = vResponse.data;
    const categories = cResponse.data;

    container.innerHTML = `
      <div class="actions-bar">
        <span class="actions-bar__count">${vehicles.length} vehicles</span>
        <button class="btn btn--primary btn--sm" id="add-vehicle-btn">+ Add Vehicle</button>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price/Day</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${vehicles.map((v) => `
              <tr>
                <td>${v.id}</td>
                <td>${v.brand}</td>
                <td>${v.model}</td>
                <td>${v.year}</td>
                <td>$${Number(v.pricePerDay).toFixed(2)}</td>
                <td>${v.category?.name || '—'}</td>
                <td><span class="badge badge--${v.available ? 'approved' : 'cancelled'}">${v.available ? 'Available' : 'Unavailable'}</span></td>
                <td>
                  <button class="btn btn--secondary btn--sm edit-veh" data-id="${v.id}">Edit</button>
                  <button class="btn btn--danger btn--sm delete-veh" data-id="${v.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Store categories for vehicle form
    this._categories = categories;

    document.getElementById('add-vehicle-btn').addEventListener('click', () => {
      this.showVehicleForm();
    });

    container.querySelectorAll('.edit-veh').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const res = await api.getVehicle(btn.dataset.id);
        this.showVehicleForm(res.data);
      });
    });

    container.querySelectorAll('.delete-veh').forEach((btn) => {
      btn.addEventListener('click', () => this.deleteVehicle(btn.dataset.id));
    });
  },

  showVehicleForm(vehicle = null) {
    const isEdit = vehicle !== null;
    const cats = this._categories || [];
    const catOptions = cats.map((c) =>
      `<option value="${c.id}" ${vehicle && vehicle.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    Modal.open(isEdit ? 'Edit Vehicle' : 'Add Vehicle', `
      <form class="form" id="vehicle-form">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label" for="veh-brand">Brand *</label>
            <input type="text" id="veh-brand" class="form__input" value="${vehicle?.brand || ''}" required />
          </div>
          <div class="form__group">
            <label class="form__label" for="veh-model">Model *</label>
            <input type="text" id="veh-model" class="form__input" value="${vehicle?.model || ''}" required />
          </div>
        </div>
        <div class="form__row">
          <div class="form__group">
            <label class="form__label" for="veh-year">Year *</label>
            <input type="number" id="veh-year" class="form__input" value="${vehicle?.year || ''}" min="1990" required />
          </div>
          <div class="form__group">
            <label class="form__label" for="veh-price">Price/Day ($) *</label>
            <input type="number" id="veh-price" class="form__input" value="${vehicle?.pricePerDay || ''}" step="0.01" min="0.01" required />
          </div>
        </div>
        <div class="form__row">
          <div class="form__group">
            <label class="form__label" for="veh-fuel">Fuel Type *</label>
            <select id="veh-fuel" class="form__select" required>
              <option value="Gasoline" ${vehicle?.fuelType === 'Gasoline' ? 'selected' : ''}>Gasoline</option>
              <option value="Diesel" ${vehicle?.fuelType === 'Diesel' ? 'selected' : ''}>Diesel</option>
              <option value="Electric" ${vehicle?.fuelType === 'Electric' ? 'selected' : ''}>Electric</option>
              <option value="Hybrid" ${vehicle?.fuelType === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
            </select>
          </div>
          <div class="form__group">
            <label class="form__label" for="veh-trans">Transmission *</label>
            <select id="veh-trans" class="form__select" required>
              <option value="Automatic" ${vehicle?.transmission === 'Automatic' ? 'selected' : ''}>Automatic</option>
              <option value="Manual" ${vehicle?.transmission === 'Manual' ? 'selected' : ''}>Manual</option>
            </select>
          </div>
        </div>
        <div class="form__row">
          <div class="form__group">
            <label class="form__label" for="veh-mileage">Mileage (km) *</label>
            <input type="number" id="veh-mileage" class="form__input" value="${vehicle?.mileage || ''}" min="0" required />
          </div>
          <div class="form__group">
            <label class="form__label" for="veh-category">Category *</label>
            <select id="veh-category" class="form__select" required>
              ${catOptions}
            </select>
          </div>
        </div>
        <div class="form__group">
          <label class="form__label" for="veh-image">Image URL</label>
          <input type="url" id="veh-image" class="form__input" value="${vehicle?.imageUrl || ''}" placeholder="https://..." />
        </div>
        <div class="form__group">
          <label class="form__label">
            <input type="checkbox" id="veh-available" ${vehicle?.available !== false ? 'checked' : ''} />
            Available for reservation
          </label>
        </div>
        <span class="form__error" id="veh-error"></span>
        <button type="submit" class="btn btn--primary btn--block">
          ${isEdit ? 'Update' : 'Create'} Vehicle
        </button>
      </form>
    `);

    document.getElementById('vehicle-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        brand: document.getElementById('veh-brand').value.trim(),
        model: document.getElementById('veh-model').value.trim(),
        year: Number(document.getElementById('veh-year').value),
        pricePerDay: Number(document.getElementById('veh-price').value),
        fuelType: document.getElementById('veh-fuel').value,
        transmission: document.getElementById('veh-trans').value,
        mileage: Number(document.getElementById('veh-mileage').value),
        categoryId: Number(document.getElementById('veh-category').value),
        imageUrl: document.getElementById('veh-image').value.trim() || null,
        available: document.getElementById('veh-available').checked,
      };

      try {
        if (isEdit) {
          await api.updateVehicle(vehicle.id, data);
          Toast.success('Vehicle updated');
        } else {
          await api.createVehicle(data);
          Toast.success('Vehicle created');
        }
        Modal.close();
        this.loadTab();
      } catch (error) {
        document.getElementById('veh-error').textContent = error.message;
      }
    });
  },

  async deleteVehicle(id) {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.deleteVehicle(id);
      Toast.success('Vehicle deleted');
      this.loadTab();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  // ── Reservations Tab ──

  async renderReservations(container) {
    const response = await api.getReservations();
    const reservations = response.data;

    container.innerHTML = `
      <div class="actions-bar">
        <span class="actions-bar__count">${reservations.length} reservations</span>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Start</th>
              <th>End</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${reservations.length === 0 ? `
              <tr><td colspan="9" style="text-align:center; color: var(--text-muted);">No reservations yet</td></tr>
            ` : reservations.map((r) => `
              <tr>
                <td>${r.id}</td>
                <td>${r.vehicle?.brand || '—'} ${r.vehicle?.model || ''}</td>
                <td>${r.customerName}</td>
                <td>${r.customerPhone}</td>
                <td>${new Date(r.startDate).toLocaleDateString()}</td>
                <td>${new Date(r.endDate).toLocaleDateString()}</td>
                <td>$${Number(r.totalPrice).toFixed(2)}</td>
                <td><span class="badge badge--${r.status}">${r.status}</span></td>
                <td>
                  ${r.status === 'pending' ? `
                    <button class="btn btn--success btn--sm approve-res" data-id="${r.id}">Approve</button>
                    <button class="btn btn--danger btn--sm cancel-res" data-id="${r.id}">Cancel</button>
                  ` : r.status === 'approved' ? `
                    <button class="btn btn--danger btn--sm cancel-res" data-id="${r.id}">Cancel</button>
                  ` : '—'}
                  <button class="btn btn--danger btn--sm delete-res" data-id="${r.id}" style="margin-left:4px;">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Approve buttons
    container.querySelectorAll('.approve-res').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await api.updateReservationStatus(btn.dataset.id, 'approved');
          Toast.success('Reservation approved');
          this.loadTab();
        } catch (error) {
          Toast.error(error.message);
        }
      });
    });

    // Cancel buttons
    container.querySelectorAll('.cancel-res').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await api.updateReservationStatus(btn.dataset.id, 'cancelled');
          Toast.success('Reservation cancelled');
          this.loadTab();
        } catch (error) {
          Toast.error(error.message);
        }
      });
    });

    // Delete buttons
    container.querySelectorAll('.delete-res').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this reservation?')) return;
        try {
          await api.deleteReservation(btn.dataset.id);
          Toast.success('Reservation deleted');
          this.loadTab();
        } catch (error) {
          Toast.error(error.message);
        }
      });
    });
  },
};
