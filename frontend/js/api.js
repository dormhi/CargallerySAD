/**
 * API Client Module
 * Handles all HTTP communication with the backend REST API
 */
const API_BASE = '/api';

const api = {
  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const config = {
      headers: { 'Content-Type': 'application/json' },
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

  // ── Categories ──

  getCategories() {
    return this.request('/categories');
  },

  getCategory(id) {
    return this.request(`/categories/${id}`);
  },

  createCategory(data) {
    return this.request('/categories', { method: 'POST', body: data });
  },

  updateCategory(id, data) {
    return this.request(`/categories/${id}`, { method: 'PUT', body: data });
  },

  deleteCategory(id) {
    return this.request(`/categories/${id}`, { method: 'DELETE' });
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
    return this.request(`/vehicles${qs ? `?${qs}` : ''}`);
  },

  getVehicle(id) {
    return this.request(`/vehicles/${id}`);
  },

  createVehicle(data) {
    return this.request('/vehicles', { method: 'POST', body: data });
  },

  updateVehicle(id, data) {
    return this.request(`/vehicles/${id}`, { method: 'PUT', body: data });
  },

  deleteVehicle(id) {
    return this.request(`/vehicles/${id}`, { method: 'DELETE' });
  },

  // ── Reservations ──

  getReservations() {
    return this.request('/reservations');
  },

  getReservation(id) {
    return this.request(`/reservations/${id}`);
  },

  createReservation(data) {
    return this.request('/reservations', { method: 'POST', body: data });
  },

  updateReservationStatus(id, status) {
    return this.request(`/reservations/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  deleteReservation(id) {
    return this.request(`/reservations/${id}`, { method: 'DELETE' });
  },
};
