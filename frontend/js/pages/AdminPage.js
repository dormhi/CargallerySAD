/**
 * Admin Page
 * Tabbed CRUD with role-based features
 */
const AdminPage = {
  activeTab: 'vehicles',
  _categories: [],

  async render() {
    const app = document.getElementById('app');

    if (!Auth.isAdmin()) {
      Toast.warning('Admin access required');
      Router.navigate('/login');
      return;
    }

    const isMaster = Auth.isMasterAdmin();

    app.innerHTML = `
      <div class="container">
        <div class="page-header">
          <h1 class="page-header__title">Admin Panel</h1>
          <p class="page-header__subtitle">${isMaster ? '👑 Master Admin' : '🔧 Admin'}</p>
        </div>
        <div class="tabs" id="admin-tabs">
          <button class="tabs__tab active" data-tab="vehicles">Vehicles</button>
          <button class="tabs__tab" data-tab="categories">Categories</button>
          <button class="tabs__tab" data-tab="reservations">Reservations</button>
          <button class="tabs__tab" data-tab="users">Users</button>
          ${isMaster ? '<button class="tabs__tab" data-tab="admins">Manage Admins</button>' : ''}
        </div>
        <div id="admin-content"></div>
      </div>
    `;

    document.getElementById('admin-tabs').addEventListener('click', (e) => {
      if (e.target.classList.contains('tabs__tab')) {
        document.querySelectorAll('.tabs__tab').forEach((t) => t.classList.remove('active'));
        e.target.classList.add('active');
        AdminPage.activeTab = e.target.dataset.tab;
        AdminPage.loadTab();
      }
    });

    await AdminPage.loadTab();
  },

  async loadTab() {
    const content = document.getElementById('admin-content');
    content.innerHTML = `<div class="loading"><div class="loading__spinner"></div></div>`;
    try {
      switch (AdminPage.activeTab) {
        case 'vehicles': await AdminPage.renderVehicles(content); break;
        case 'categories': await AdminPage.renderCategories(content); break;
        case 'reservations': await AdminPage.renderReservations(content); break;
        case 'users': await AdminPage.renderUsers(content); break;
        case 'admins': await AdminPage.renderAdmins(content); break;
      }
    } catch (error) {
      content.innerHTML = `<div class="empty-state"><p>Failed to load data</p></div>`;
    }
  },

  // ── Categories ──
  async renderCategories(container) {
    const response = await api.getCategories();
    const categories = response.data;
    container.innerHTML = `
      <div class="actions-bar">
        <span class="actions-bar__count">${categories.length} categories</span>
        <button class="btn btn--primary btn--sm" id="add-category-btn">+ Add Category</button>
      </div>
      <div class="table-wrapper"><table class="table">
        <thead><tr><th>ID</th><th>Name</th><th>Vehicles</th><th>Actions</th></tr></thead>
        <tbody>${categories.map((c) => `
          <tr>
            <td>${c.id}</td><td>${c.name}</td><td>${c._count?.vehicles || 0}</td>
            <td>
              <button class="btn btn--secondary btn--sm edit-cat" data-id="${c.id}" data-name="${c.name}">Edit</button>
              <button class="btn btn--danger btn--sm delete-cat" data-id="${c.id}">Delete</button>
            </td>
          </tr>
        `).join('')}</tbody>
      </table></div>
    `;
    document.getElementById('add-category-btn').addEventListener('click', () => AdminPage.showCategoryForm());
    container.querySelectorAll('.edit-cat').forEach((btn) => btn.addEventListener('click', () => AdminPage.showCategoryForm(btn.dataset.id, btn.dataset.name)));
    container.querySelectorAll('.delete-cat').forEach((btn) => btn.addEventListener('click', () => AdminPage.deleteCategory(btn.dataset.id)));
  },

  showCategoryForm(id = null, name = '') {
    const isEdit = id !== null;
    Modal.open(isEdit ? 'Edit Category' : 'Add Category', `
      <form class="form" id="category-form">
        <div class="form__group">
          <label class="form__label">Category Name *</label>
          <input type="text" id="cat-name" class="form__input" value="${name}" required />
          <span class="form__error" id="cat-error"></span>
        </div>
        <button type="submit" class="btn btn--primary btn--block">${isEdit ? 'Update' : 'Create'}</button>
      </form>
    `);
    document.getElementById('category-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const catName = document.getElementById('cat-name').value.trim();
      if (catName.length < 2) { document.getElementById('cat-error').textContent = 'Min 2 characters'; return; }
      try {
        if (isEdit) { await api.updateCategory(id, { name: catName }); Toast.success('Category updated'); }
        else { await api.createCategory({ name: catName }); Toast.success('Category created'); }
        Modal.close(); AdminPage.loadTab();
      } catch (error) { document.getElementById('cat-error').textContent = error.message; }
    });
  },

  async deleteCategory(id) {
    if (!confirm('Delete this category?')) return;
    try { await api.deleteCategory(id); Toast.success('Deleted'); AdminPage.loadTab(); }
    catch (error) { Toast.error(error.message); }
  },

  // ── Vehicles ──
  async renderVehicles(container) {
    const [vRes, cRes] = await Promise.all([api.getVehicles(), api.getCategories()]);
    const vehicles = vRes.data;
    AdminPage._categories = cRes.data;

    container.innerHTML = `
      <div class="actions-bar">
        <span class="actions-bar__count">${vehicles.length} vehicles</span>
        <button class="btn btn--primary btn--sm" id="add-vehicle-btn">+ Add Vehicle</button>
      </div>
      <div class="table-wrapper"><table class="table">
        <thead><tr><th>ID</th><th>Brand</th><th>Model</th><th>Year</th><th>Price/Day</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${vehicles.map((v) => `
          <tr>
            <td>${v.id}</td><td>${v.brand}</td><td>${v.model}</td><td>${v.year}</td>
            <td>$${Number(v.pricePerDay).toFixed(2)}</td><td>${v.category?.name || '—'}</td>
            <td>
              <button class="btn btn--sm toggle-avail ${v.available ? 'btn--success' : 'btn--danger'}" data-id="${v.id}" data-status="${v.available}">
                ${v.available ? 'Available' : 'Unavailable'}
              </button>
            </td>
            <td>
              <button class="btn btn--secondary btn--sm edit-veh" data-id="${v.id}">Edit</button>
              <button class="btn btn--danger btn--sm delete-veh" data-id="${v.id}">Delete</button>
            </td>
          </tr>
        `).join('')}</tbody>
      </table></div>
    `;

    document.getElementById('add-vehicle-btn').addEventListener('click', () => AdminPage.showVehicleForm());
    container.querySelectorAll('.edit-veh').forEach((btn) => btn.addEventListener('click', async () => {
      const res = await api.getVehicle(btn.dataset.id);
      AdminPage.showVehicleForm(res.data);
    }));
    container.querySelectorAll('.delete-veh').forEach((btn) => btn.addEventListener('click', () => AdminPage.deleteVehicle(btn.dataset.id)));
    // Toggle availability
    container.querySelectorAll('.toggle-avail').forEach((btn) => btn.addEventListener('click', async () => {
      const newStatus = btn.dataset.status === 'true' ? false : true;
      try {
        await api.updateVehicle(btn.dataset.id, { available: newStatus });
        Toast.success(`Vehicle marked as ${newStatus ? 'available' : 'unavailable'}`);
        AdminPage.loadTab();
      } catch (error) { Toast.error(error.message); }
    }));
  },

  showVehicleForm(vehicle = null) {
    const isEdit = vehicle !== null;
    const cats = AdminPage._categories || [];
    const catOptions = cats.map((c) => `<option value="${c.id}" ${vehicle && vehicle.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');

    Modal.open(isEdit ? 'Edit Vehicle' : 'Add Vehicle', `
      <form class="form" id="vehicle-form">
        <div class="form__row">
          <div class="form__group"><label class="form__label">Brand *</label><input type="text" id="veh-brand" class="form__input" value="${vehicle?.brand || ''}" required /></div>
          <div class="form__group"><label class="form__label">Model *</label><input type="text" id="veh-model" class="form__input" value="${vehicle?.model || ''}" required /></div>
        </div>
        <div class="form__row">
          <div class="form__group"><label class="form__label">Year *</label><input type="number" id="veh-year" class="form__input" value="${vehicle?.year || ''}" min="1990" required /></div>
          <div class="form__group"><label class="form__label">Price/Day ($) *</label><input type="number" id="veh-price" class="form__input" value="${vehicle?.pricePerDay || ''}" step="0.01" min="0.01" required /></div>
        </div>
        <div class="form__row">
          <div class="form__group"><label class="form__label">Fuel Type *</label>
            <select id="veh-fuel" class="form__select" required>
              <option value="Gasoline" ${vehicle?.fuelType === 'Gasoline' ? 'selected' : ''}>Gasoline</option>
              <option value="Diesel" ${vehicle?.fuelType === 'Diesel' ? 'selected' : ''}>Diesel</option>
              <option value="Electric" ${vehicle?.fuelType === 'Electric' ? 'selected' : ''}>Electric</option>
              <option value="Hybrid" ${vehicle?.fuelType === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
            </select>
          </div>
          <div class="form__group"><label class="form__label">Transmission *</label>
            <select id="veh-trans" class="form__select" required>
              <option value="Automatic" ${vehicle?.transmission === 'Automatic' ? 'selected' : ''}>Automatic</option>
              <option value="Manual" ${vehicle?.transmission === 'Manual' ? 'selected' : ''}>Manual</option>
            </select>
          </div>
        </div>
        <div class="form__row">
          <div class="form__group"><label class="form__label">Mileage (km) *</label><input type="number" id="veh-mileage" class="form__input" value="${vehicle?.mileage || ''}" min="0" required /></div>
          <div class="form__group"><label class="form__label">Category *</label><select id="veh-category" class="form__select" required>${catOptions}</select></div>
        </div>
        <div class="form__group"><label class="form__label">Image URL</label><input type="url" id="veh-image" class="form__input" value="${vehicle?.imageUrl || ''}" /></div>
        <div class="form__group"><label class="form__label"><input type="checkbox" id="veh-available" ${vehicle?.available !== false ? 'checked' : ''} /> Available</label></div>
        <span class="form__error" id="veh-error"></span>
        <button type="submit" class="btn btn--primary btn--block">${isEdit ? 'Update' : 'Create'} Vehicle</button>
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
        if (isEdit) { await api.updateVehicle(vehicle.id, data); Toast.success('Updated'); }
        else { await api.createVehicle(data); Toast.success('Created'); }
        Modal.close(); AdminPage.loadTab();
      } catch (error) { document.getElementById('veh-error').textContent = error.message; }
    });
  },

  async deleteVehicle(id) {
    if (!confirm('Delete this vehicle?')) return;
    try { await api.deleteVehicle(id); Toast.success('Deleted'); AdminPage.loadTab(); }
    catch (error) { Toast.error(error.message); }
  },

  // ── Reservations ──
  async renderReservations(container) {
    const response = await api.getReservations();
    const reservations = response.data;
    const today = new Date();

    container.innerHTML = `
      <div class="actions-bar"><span class="actions-bar__count">${reservations.length} reservations</span></div>
      <div class="table-wrapper"><table class="table">
        <thead><tr><th>ID</th><th>Vehicle</th><th>Customer</th><th>Start</th><th>End</th><th>Remaining</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${reservations.length === 0 ? '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);">No reservations</td></tr>' :
          reservations.map((r) => {
            const endDate = new Date(r.endDate);
            const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            const remaining = r.status === 'cancelled' ? '—' : diffDays > 0 ? `${diffDays} days` : 'Done';
            return `
              <tr>
                <td>${r.id}</td>
                <td>${r.vehicle?.brand || ''} ${r.vehicle?.model || ''}</td>
                <td>${r.user?.name || r.customerName}</td>
                <td>${new Date(r.startDate).toLocaleDateString()}</td>
                <td>${endDate.toLocaleDateString()}</td>
                <td><strong>${remaining}</strong></td>
                <td>$${Number(r.totalPrice).toFixed(2)}</td>
                <td><span class="badge badge--${r.status}">${r.status}</span></td>
                <td>
                  ${r.status === 'pending' ? `<button class="btn btn--success btn--sm approve-res" data-id="${r.id}">Approve</button>` : ''}
                  ${r.status !== 'cancelled' ? `<button class="btn btn--danger btn--sm cancel-res" data-id="${r.id}">Cancel</button>` : ''}
                  <button class="btn btn--danger btn--sm delete-res" data-id="${r.id}">Delete</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table></div>
    `;

    container.querySelectorAll('.approve-res').forEach((btn) => btn.addEventListener('click', async () => {
      try { await api.updateReservationStatus(btn.dataset.id, 'approved'); Toast.success('Approved'); AdminPage.loadTab(); }
      catch (error) { Toast.error(error.message); }
    }));
    container.querySelectorAll('.cancel-res').forEach((btn) => btn.addEventListener('click', async () => {
      try { await api.updateReservationStatus(btn.dataset.id, 'cancelled'); Toast.success('Cancelled & refunded'); AdminPage.loadTab(); }
      catch (error) { Toast.error(error.message); }
    }));
    container.querySelectorAll('.delete-res').forEach((btn) => btn.addEventListener('click', async () => {
      if (!confirm('Delete?')) return;
      try { await api.deleteReservation(btn.dataset.id); Toast.success('Deleted'); AdminPage.loadTab(); }
      catch (error) { Toast.error(error.message); }
    }));
  },

  // ── Admins Tab (Master Admin Only) ──
  async renderAdmins(container) {
    const response = await api.getUsers();
    const users = response.data;
    const admins = users.filter((u) => u.role === 'admin' || u.role === 'master_admin');

    container.innerHTML = `
      <div class="actions-bar">
        <span class="actions-bar__count">${admins.length} admin(s)</span>
        <button class="btn btn--primary btn--sm" id="add-admin-btn">+ Create Admin</button>
      </div>
      <div class="table-wrapper"><table class="table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Reservations</th></tr></thead>
        <tbody>${admins.map((a) => `
          <tr>
            <td>${a.id}</td><td>${a.name}</td><td>${a.email}</td>
            <td><span class="badge badge--${a.role === 'master_admin' ? 'approved' : 'pending'}">${a.role.replace('_', ' ')}</span></td>
            <td>${a._count?.reservations || 0}</td>
          </tr>
        `).join('')}</tbody>
      </table></div>
    `;

    document.getElementById('add-admin-btn').addEventListener('click', () => {
      Modal.open('Create Admin Account', `
        <form class="form" id="admin-form">
          <div class="form__group"><label class="form__label">Name *</label><input type="text" id="adm-name" class="form__input" required /></div>
          <div class="form__group"><label class="form__label">Email / Username *</label><input type="text" id="adm-email" class="form__input" required /></div>
          <div class="form__group"><label class="form__label">Password *</label><input type="password" id="adm-pass" class="form__input" required minlength="4" /></div>
          <span class="form__error" id="adm-error"></span>
          <button type="submit" class="btn btn--primary btn--block">Create Admin</button>
        </form>
      `);
      document.getElementById('admin-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await api.createAdmin({
            name: document.getElementById('adm-name').value.trim(),
            email: document.getElementById('adm-email').value.trim(),
            password: document.getElementById('adm-pass').value,
          });
          Toast.success('Admin account created');
          Modal.close();
          AdminPage.loadTab();
        } catch (error) {
          document.getElementById('adm-error').textContent = error.message;
        }
      });
    });
  },

  // ── Users Tab (All Admins) ──
  async renderUsers(container) {
    const response = await api.getUsers();
    const users = response.data;

    container.innerHTML = `
      <div class="actions-bar"><span class="actions-bar__count">${users.length} user(s)</span></div>
      <div class="table-wrapper"><table class="table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Balance</th><th>Role</th><th>Rentals</th><th>Actions</th></tr></thead>
        <tbody>${users.length === 0 ? '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);">No users</td></tr>' :
          users.map((u) => `
          <tr>
            <td>${u.id}</td><td>${u.name}</td><td>${u.email}</td>
            <td>${u.phone || '—'}</td>
            <td>$${Number(u.balance).toFixed(2)}</td>
            <td><span class="badge badge--${u.role === 'master_admin' ? 'approved' : u.role === 'admin' ? 'pending' : 'cancelled'}">${u.role.replace('_', ' ')}</span></td>
            <td>${u._count?.reservations || 0}</td>
            <td>
              <button class="btn btn--secondary btn--sm edit-user" data-id="${u.id}" data-name="${u.name}" data-email="${u.email}" data-phone="${u.phone || ''}" data-balance="${u.balance}" data-role="${u.role}">Edit</button>
              ${u._count?.reservations > 0 ? `<button class="btn btn--primary btn--sm view-user-res" data-id="${u.id}" data-name="${u.name}">Rentals</button>` : ''}
              ${u.role !== 'master_admin' && u.id !== Auth.getUserId() ? `<button class="btn btn--danger btn--sm delete-user" data-id="${u.id}" data-name="${u.name}">Delete</button>` : ''}
            </td>
          </tr>
        `).join('')}</tbody>
      </table></div>
    `;

    container.querySelectorAll('.edit-user').forEach((btn) => btn.addEventListener('click', () => {
      AdminPage.showUserEditForm({
        id: Number(btn.dataset.id),
        name: btn.dataset.name,
        email: btn.dataset.email,
        phone: btn.dataset.phone,
        balance: btn.dataset.balance,
        role: btn.dataset.role,
      });
    }));

    container.querySelectorAll('.view-user-res').forEach((btn) => btn.addEventListener('click', () => {
      AdminPage.showUserReservations(Number(btn.dataset.id), btn.dataset.name);
    }));

    container.querySelectorAll('.delete-user').forEach((btn) => btn.addEventListener('click', async () => {
      if (!confirm(`Delete user "${btn.dataset.name}"? This action cannot be undone.`)) return;
      try {
        await api.deleteUser(btn.dataset.id);
        Toast.success('User deleted');
        AdminPage.loadTab();
      } catch (error) {
        Toast.error(error.message);
      }
    }));
  },

  showUserEditForm(user) {
    Modal.open(`Edit User — ${user.name}`, `
      <form class="form" id="edit-user-form">
        <div class="form__group">
          <label class="form__label">Name</label>
          <input type="text" id="eu-name" class="form__input" value="${user.name}" required />
        </div>
        <div class="form__group">
          <label class="form__label">Email / Username</label>
          <input type="text" id="eu-email" class="form__input" value="${user.email}" required />
        </div>
        <div class="form__group">
          <label class="form__label">Phone</label>
          <input type="tel" id="eu-phone" class="form__input" value="${user.phone}" />
        </div>
        <div class="form__group">
          <label class="form__label">Balance ($)</label>
          <input type="number" id="eu-balance" class="form__input" value="${Number(user.balance).toFixed(2)}" step="0.01" min="0" />
        </div>
        <div class="form__group">
          <label class="form__label">Role</label>
          <input type="text" class="form__input" value="${user.role.replace('_', ' ')}" disabled />
        </div>
        <span class="form__error" id="eu-error"></span>
        <button type="submit" class="btn btn--primary btn--block">Update User</button>
      </form>
    `);

    document.getElementById('edit-user-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('eu-name').value.trim(),
        email: document.getElementById('eu-email').value.trim(),
        phone: document.getElementById('eu-phone').value.trim(),
        balance: Number(document.getElementById('eu-balance').value),
      };
      if (!data.name || data.name.length < 2) { document.getElementById('eu-error').textContent = 'Name must be at least 2 characters'; return; }
      if (!data.email) { document.getElementById('eu-error').textContent = 'Email is required'; return; }
      try {
        await api.updateUser(user.id, data);
        Toast.success('User updated');
        Modal.close();
        AdminPage.loadTab();
      } catch (error) {
        document.getElementById('eu-error').textContent = error.message;
      }
    });
  },

  async showUserReservations(userId, userName) {
    try {
      const response = await api.getReservations();
      const userRes = response.data.filter((r) => r.userId === userId);
      const today = new Date();

      const rows = userRes.length === 0 ? '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No reservations</td></tr>' :
        userRes.map((r) => {
          const endDate = new Date(r.endDate);
          const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          const remaining = r.status === 'cancelled' ? '—' : diffDays > 0 ? `${diffDays} days` : 'Done';
          return `
            <tr>
              <td>${r.vehicle?.brand || ''} ${r.vehicle?.model || ''}</td>
              <td>${new Date(r.startDate).toLocaleDateString()}</td>
              <td>${endDate.toLocaleDateString()}</td>
              <td><strong>${remaining}</strong></td>
              <td>$${Number(r.totalPrice).toFixed(2)}</td>
              <td><span class="badge badge--${r.status}">${r.status}</span></td>
              <td>
                ${r.status === 'pending' ? `<button class="btn btn--success btn--sm modal-approve" data-id="${r.id}">Approve</button>` : ''}
                ${r.status !== 'cancelled' ? `<button class="btn btn--danger btn--sm modal-cancel" data-id="${r.id}">Cancel</button>` : ''}
              </td>
            </tr>
          `;
        }).join('');

      Modal.open(`Reservations — ${userName}`, `
        <div class="table-wrapper"><table class="table">
          <thead><tr><th>Vehicle</th><th>Start</th><th>End</th><th>Remaining</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      `);

      document.querySelectorAll('.modal-approve').forEach((btn) => btn.addEventListener('click', async () => {
        try { await api.updateReservationStatus(btn.dataset.id, 'approved'); Toast.success('Approved'); Modal.close(); AdminPage.loadTab(); }
        catch (error) { Toast.error(error.message); }
      }));
      document.querySelectorAll('.modal-cancel').forEach((btn) => btn.addEventListener('click', async () => {
        try { await api.updateReservationStatus(btn.dataset.id, 'cancelled'); Toast.success('Cancelled & refunded'); Modal.close(); AdminPage.loadTab(); }
        catch (error) { Toast.error(error.message); }
      }));
    } catch (error) {
      Toast.error('Failed to load reservations');
    }
  },
};
