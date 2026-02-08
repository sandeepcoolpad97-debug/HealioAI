import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import rolesReducer from './slices/rolesSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import clinicsReducer from './slices/clinicsSlice';
import labsReducer from './slices/labsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import categoriesReducer from './slices/categoriesSlice';
import servicesReducer from './slices/servicesSlice';
import paymentsReducer from './slices/paymentsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    roles: rolesReducer,
    subscriptions: subscriptionsReducer,
    clinics: clinicsReducer,
    labs: labsReducer,
    appointments: appointmentsReducer,
    categories: categoriesReducer,
    services: servicesReducer,
    payments: paymentsReducer,
  },
});
