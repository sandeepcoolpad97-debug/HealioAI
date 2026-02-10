import { navigationRoutes } from '../constants/strings';

export type RootStackParamList = {
  [navigationRoutes.Initial]: undefined;
  [navigationRoutes.WelcomeOne]: undefined;
  [navigationRoutes.WelcomeTwo]: undefined;
  [navigationRoutes.WelcomeThree]: undefined;
  [navigationRoutes.SignIn]: undefined;
  [navigationRoutes.VerifyOTP]: { phone: string };
  [navigationRoutes.CreateAccount]: undefined;
  [navigationRoutes.VerifyNumber]: { phone: string };
  [navigationRoutes.RoleSelection]: undefined;
  [navigationRoutes.PersonalDetails]: { role?: string };
  [navigationRoutes.ClinicDetails]: { role?: string };
  [navigationRoutes.ClinicServices]: undefined;
  [navigationRoutes.ClinicTermsConsents]: undefined;
  [navigationRoutes.ClinicProfileSubmitted]: undefined;
  [navigationRoutes.LabDetails]: { role?: string };
  [navigationRoutes.LabServices]: undefined;
  [navigationRoutes.LabTermsConsents]: undefined;
  [navigationRoutes.LabProfileSubmitted]: undefined;
  [navigationRoutes.HealthInfo]: undefined;
  [navigationRoutes.Consent]: undefined;
  [navigationRoutes.OnboardingSuccess]: undefined;
  [navigationRoutes.MainTabs]: { role?: string; screen?: string };
  [navigationRoutes.DoctorProfile]: {
    doctorId: string;
    name: string;
    specialty: string;
    rating: number;
  };
  [navigationRoutes.BookAppointment]: {
    doctorId: string;
    doctorName: string;
    specialty: string;
    rating: number;
    hospital?: string;
    location?: string;
  };
  [navigationRoutes.AppointmentDetails]: {
    appointmentId: string;
  };
  [navigationRoutes.AppointmentSummary]: {
    appointmentId: string;
  };
  [navigationRoutes.RescheduleAppointment]: {
    appointmentId: string;
  };
  [navigationRoutes.CancelAppointment]: {
    appointmentId: string;
  };
  [navigationRoutes.CancellationSuccess]: {
    appointmentId: string;
    doctorName: string;
    date: string;
    time: string;
  };
  [navigationRoutes.AppointmentSuccess]: {
    type: 'booking' | 'reschedule';
    doctorName: string;
    date: string;
    time: string;
    specialty: string;
    appointmentId?: string;
  };
};
