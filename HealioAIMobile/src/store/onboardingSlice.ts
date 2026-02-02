import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Allowed role keys for onboarding (user, clinic, lab only). */
export type OnboardingRoleKey = 'user' | 'clinic' | 'lab';

export interface OnboardingPersonalDetails {
  fullName: string;
  age: string;
  gender: string | null;
  email: string;
  language: string | null;
}

export interface OnboardingHealthInfo {
  existingConditions: string[];
  otherConditions: string;
}

export interface OnboardingConsents {
  termsAndConditions: boolean;
  policyTerms: boolean;
  medicalDisclaimer: boolean;
}

export interface OnboardingPhone {
  countryCode: string;
  number: string;
  verified: boolean;
}

export interface OnboardingState {
  /** Selected role key (user | clinic | lab). */
  roleKey: OnboardingRoleKey | null;
  /** Backend role _id for /users/onboard. */
  roleId: string | null;
  /** Backend subscription _id for /users/onboard (e.g. free plan). */
  subscriptionId: string | null;
  /** Phone from auth (set when entering role selection). */
  phone: OnboardingPhone | null;
  /** Personal details (PersonalDetailsScreen). */
  personal: OnboardingPersonalDetails;
  /** Health info (HealthInfoScreen). */
  health: OnboardingHealthInfo;
  /** Consents (ConsentScreen). */
  consents: OnboardingConsents;
}

const initialPersonal: OnboardingPersonalDetails = {
  fullName: '',
  age: '',
  gender: null,
  email: '',
  language: null,
};

const initialHealth: OnboardingHealthInfo = {
  existingConditions: [],
  otherConditions: '',
};

const initialConsents: OnboardingConsents = {
  termsAndConditions: false,
  policyTerms: false,
  medicalDisclaimer: false,
};

const initialState: OnboardingState = {
  roleKey: null,
  roleId: null,
  subscriptionId: null,
  phone: null,
  personal: initialPersonal,
  health: initialHealth,
  consents: initialConsents,
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setPhone(
      state,
      action: PayloadAction<{ countryCode: string; number: string; verified?: boolean }>
    ) {
      state.phone = {
        countryCode: action.payload.countryCode,
        number: action.payload.number,
        verified: action.payload.verified ?? false,
      };
    },
    setRoleSelection(
      state,
      action: PayloadAction<{ roleKey: OnboardingRoleKey; roleId: string; subscriptionId: string }>
    ) {
      state.roleKey = action.payload.roleKey;
      state.roleId = action.payload.roleId;
      state.subscriptionId = action.payload.subscriptionId;
    },
    setPersonalDetails(state, action: PayloadAction<Partial<OnboardingPersonalDetails>>) {
      state.personal = { ...state.personal, ...action.payload };
    },
    setHealthInfo(state, action: PayloadAction<Partial<OnboardingHealthInfo>>) {
      state.health = { ...state.health, ...action.payload };
    },
    setConsents(state, action: PayloadAction<Partial<OnboardingConsents>>) {
      state.consents = { ...state.consents, ...action.payload };
    },
    resetOnboarding() {
      return initialState;
    },
  },
});

export const {
  setPhone,
  setRoleSelection,
  setPersonalDetails,
  setHealthInfo,
  setConsents,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
