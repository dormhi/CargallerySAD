/**
 * API Client Module
 * Handles all HTTP communication with the backend REST API
 */
const API_BASE = '/api';

const api = {
  /**
   * Generic fetch wrapper with error handling
   * Automatically sends X-User-Id header when user is logged in
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const headers = { 'Content-Type': 'application/json' };

    // Attach auth header if user is logged in
    const user = Auth.getUser();
    if (user) {
      headers['X-User-Id'] = user.id;
    }

    const config = {
      headers,
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error?.message || 'Something went wrong');
      error.details = data.error?.details || [];
      error.status = response.status;
      throw error;
    }

    return data;
  },

  // ── Auth ──

  register(data) {
    return api.request('/users/register', { method: 'POST', body: data });
  },

  login(email, password) {
    return api.request('/users/login', { method: 'POST', body: { email, password } });
  },

  getProfile() {
    return api.request('/users/profile');
  },

  addBalance(amount) {
    return api.request('/users/balance', { method: 'POST', body: { amount } });
  },

  getUsers() {
    return api.request('/users');
  },

  createAdmin(data) {
    return api.request('/users/create-admin', { method: 'POST', body: data });
  },

  // ── Categories ──

  getCategories() {
    return api.request('/categories');
  },

  getCategory(id) {
    return api.request(`/categories/${id}`);
  },

  createCategory(data) {
    return api.request('/categories', { method: 'POST', body: data });
  },

  updateCategory(id, data) {
    return api.request(`/categories/${id}`, { method: 'PUT', body: data });
  },

  deleteCategory(id) {
    return api.request(`/categories/${id}`, { method: 'DELETE' });
  },

  // ── Vehicles ──

  getVehicles(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        query.append(key, value);
      }
    });
    const qs = query.toString();
    return api.request(`/vehicles${qs ? `?${qs}` : ''}`);
  },

  getVehicle(id) {
    return api.request(`/vehicles/${id}`);
  },

  createVehicle(data) {
    return api.request('/vehicles', { method: 'POST', body: data });
  },

  updateVehicle(id, data) {
    return api.request(`/vehicles/${id}`, { method: 'PUT', body: data });
  },

  deleteVehicle(id) {
    return api.request(`/vehicles/${id}`, { method: 'DELETE' });
  },

  // ── Reservations ──

  getReservations() {
    return api.request('/reservations');
  },

  getReservation(id) {
    return api.request(`/reservations/${id}`);
  },

  createReservation(data) {
    return api.request('/reservations', { method: 'POST', body: data });
  },

  updateReservationStatus(id, status) {
    return api.request(`/reservations/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  deleteReservation(id) {
    return api.request(`/reservations/${id}`, { method: 'DELETE' });
  },
};
