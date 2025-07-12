import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  isLoading: false,
  error: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { admin, token } = action.payload;
      state.admin = admin;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('adminToken', token);
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('adminToken');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, setLoading, setError, clearError } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;

// Selectors
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectToken = (state) => state.adminAuth.token;
export const selectIsAuthenticated = (state) => state.adminAuth.isAuthenticated;
export const selectIsLoading = (state) => state.adminAuth.isLoading;
export const selectError = (state) => state.adminAuth.error; 