import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import themeSettingSlice from './themeSettingSlice';
import adminAuthSlice from './adminAuthSlice';
import { api } from './api';

const store = configureStore({
  reducer: {
    rootReducer: rootReducer,
    themeSetting: themeSettingSlice,
    adminAuth: adminAuthSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
