/**
 * Auth Component
 * Manages user authentication state via localStorage
 */
const Auth = {
  STORAGE_KEY: 'cargallery_user',

  getUser() {
    const data = localStorage.getItem(Auth.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  setUser(user) {
    localStorage.setItem(Auth.STORAGE_KEY, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(Auth.STORAGE_KEY);
  },

  isLoggedIn() {
    return Auth.getUser() !== null;
  },

  isAdmin() {
    const user = Auth.getUser();
    return user && (user.role === 'admin' || user.role === 'master_admin');
  },

  isMasterAdmin() {
    const user = Auth.getUser();
    return user && user.role === 'master_admin';
  },

  getUserId() {
    const user = Auth.getUser();
    return user ? user.id : null;
  },
};
