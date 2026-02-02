import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ClinicOnboardingDetails {
  clinicName: string;
  registrationNumber: string;
  contactNumber: string;
  email: string;
  establishmentDate: string;
  address?: string;
}

export interface ClinicOnboardingServices {
  doctorName: string;
  specialisations: string[];
  consultationType: 'in_person' | 'online' | 'both';
}

export interface ClinicOnboardingConsents {
  termsAndConditions: boolean;
  policyTerms: boolean;
  medicalDisclaimer: boolean;
}

export interface ClinicOnboardingState {
  details: ClinicOnboardingDetails;
  services: ClinicOnboardingServices;
  consents: ClinicOnboardingConsents;
}

const initialDetails: ClinicOnboardingDetails = {
  clinicName: '',
  registrationNumber: '',
  contactNumber: '',
  email: '',
  establishmentDate: '',
  address: '',
};

const initialServices: ClinicOnboardingServices = {
  doctorName: '',
  specialisations: [],
  consultationType: 'in_person',
};

const initialConsents: ClinicOnboardingConsents = {
  termsAndConditions: false,
  policyTerms: false,
  medicalDisclaimer: false,
};

const initialState: ClinicOnboardingState = {
  details: initialDetails,
  services: initialServices,
  consents: initialConsents,
};

export const clinicOnboardingSlice = createSlice({
  name: 'clinicOnboarding',
  initialState,
  reducers: {
    setClinicDetails(state, action: PayloadAction<Partial<ClinicOnboardingDetails>>) {
      state.details = { ...state.details, ...action.payload };
    },
    setClinicServices(state, action: PayloadAction<Partial<ClinicOnboardingServices>>) {
      state.services = { ...state.services, ...action.payload };
    },
    setClinicConsents(state, action: PayloadAction<Partial<ClinicOnboardingConsents>>) {
      state.consents = { ...state.consents, ...action.payload };
    },
    resetClinicOnboarding() {
      return initialState;
    },
  },
});

export const {
  setClinicDetails,
  setClinicServices,
  setClinicConsents,
  resetClinicOnboarding,
} = clinicOnboardingSlice.actions;

export default clinicOnboardingSlice.reducer;
