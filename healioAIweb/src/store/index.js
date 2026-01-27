import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import rolesReducer from './slices/rolesSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer,
    subscriptions: subscriptionsReducer,
  },
});
