import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import rolesReducer from './slices/rolesSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import clinicsReducer from './slices/clinicsSlice';
import labsReducer from './slices/labsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    roles: rolesReducer,
    subscriptions: subscriptionsReducer,
    clinics: clinicsReducer,
    labs: labsReducer,
  },
});
