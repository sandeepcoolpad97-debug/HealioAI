import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './onboardingSlice';
import clinicOnboardingReducer from './clinicOnboardingSlice';
import labOnboardingReducer from './labOnboardingSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    onboarding: onboardingReducer,
    clinicOnboarding: clinicOnboardingReducer,
    labOnboarding: labOnboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
