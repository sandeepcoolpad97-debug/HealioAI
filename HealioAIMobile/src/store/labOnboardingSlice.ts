import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface LabOnboardingDetails {
  labName: string;
  registrationNumber: string;
  contactNumber: string;
  email: string;
  establishmentDate: string;
  address?: string;
  operatingDays?: string[];
  opensAt: string;
  closesAt: string;
}

export interface LabOnboardingServices {
  testCategories: string[];
  homeSampleCollection: boolean;
  reportDeliveryType: ('pdf' | 'in_app')[];
}

export interface LabOnboardingConsents {
  termsAndConditions: boolean;
  policyTerms: boolean;
  medicalDisclaimer: boolean;
}

export interface LabOnboardingState {
  details: LabOnboardingDetails;
  services: LabOnboardingServices;
  consents: LabOnboardingConsents;
}

const initialDetails: LabOnboardingDetails = {
  labName: '',
  registrationNumber: '',
  contactNumber: '',
  email: '',
  establishmentDate: '',
  address: '',
  operatingDays: [],
  opensAt: '',
  closesAt: '',
};

const initialServices: LabOnboardingServices = {
  testCategories: [],
  homeSampleCollection: false,
  reportDeliveryType: [],
};

const initialConsents: LabOnboardingConsents = {
  termsAndConditions: false,
  policyTerms: false,
  medicalDisclaimer: false,
};

const initialState: LabOnboardingState = {
  details: initialDetails,
  services: initialServices,
  consents: initialConsents,
};

export const labOnboardingSlice = createSlice({
  name: 'labOnboarding',
  initialState,
  reducers: {
    setLabDetails(state, action: PayloadAction<Partial<LabOnboardingDetails>>) {
      state.details = { ...state.details, ...action.payload };
    },
    setLabServices(state, action: PayloadAction<Partial<LabOnboardingServices>>) {
      state.services = { ...state.services, ...action.payload };
    },
    setLabConsents(state, action: PayloadAction<Partial<LabOnboardingConsents>>) {
      state.consents = { ...state.consents, ...action.payload };
    },
    resetLabOnboarding() {
      return initialState;
    },
  },
});

export const {
  setLabDetails,
  setLabServices,
  setLabConsents,
  resetLabOnboarding,
} = labOnboardingSlice.actions;

export default labOnboardingSlice.reducer;
