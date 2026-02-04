export const onboardingStrings = {
  initial: {
    title: 'Healio AI',
    subtitle: '',
    ctaLabel: 'Get Started',
  },
  welcomeOne: {
    title: 'Your Health, Simplified',
    subtitle: 'Manage your health easily with smart tools designed for everyday care.',
    ctaLabel: 'Next',
  },
  welcomeTwo: {
    title: 'AI-Powered Care, Anytime',
    subtitle:
      'Your personal AI health assistant, always ready to help with guidance you can trust.',
    ctaLabel: 'Next',
  },
  welcomeThree: {
    title: 'Smarter Care Starts Here',
    subtitle:
      'Get guidance that helps you take the right step at the right time.',
    ctaLabel: 'Continue',
  },
} as const;

export const navigationRoutes = {
  Initial: 'Initial',
  WelcomeOne: 'WelcomeOne',
  WelcomeTwo: 'WelcomeTwo',
  WelcomeThree: 'WelcomeThree',
  SignIn: 'SignIn',
  VerifyOTP: 'VerifyOTP',
  CreateAccount: 'CreateAccount',
  VerifyNumber: 'VerifyNumber',
  RoleSelection: 'RoleSelection',
  PersonalDetails: 'PersonalDetails',
  ClinicDetails: 'ClinicDetails',
  ClinicServices: 'ClinicServices',
  ClinicTermsConsents: 'ClinicTermsConsents',
  ClinicProfileSubmitted: 'ClinicProfileSubmitted',
  LabDetails: 'LabDetails',
  LabServices: 'LabServices',
  LabTermsConsents: 'LabTermsConsents',
  LabProfileSubmitted: 'LabProfileSubmitted',
  HealthInfo: 'HealthInfo',
  Consent: 'Consent',
  OnboardingSuccess: 'OnboardingSuccess',
  Home: 'Home',
  MainTabs: 'MainTabs',
  Appointments: 'Appointments',
  Contact: 'Contact',
  Profile: 'Profile',
  DoctorProfile: 'DoctorProfile',
  BookAppointment: 'BookAppointment',
  AppointmentDetails: 'AppointmentDetails',
  AppointmentSummary: 'AppointmentSummary',
  RescheduleAppointment: 'RescheduleAppointment',
  CancelAppointment: 'CancelAppointment',
  CancellationSuccess: 'CancellationSuccess',
  AppointmentSuccess: 'AppointmentSuccess',
} as const;

export const signInStrings = {
  title: 'Welcome Back',
  subtitle: 'Sign in to access your health records and personalized care.',
  phonePlaceholder: 'Enter your mobile number',
  countryCode: '+91',
  sendOtp: 'Send OTP',
  or: 'OR',
  signInWithGoogle: 'Sign in with Google',
  noAccount: "Don't have an account? Sign Up",
  verifyTitle: 'Verify your number',
  verifySubtitle: "We've sent a 6-digit code to",
  continue: 'Continue',
} as const;

export const roleSelectStrings = {
  title: 'How will you use MediGo?',
  subtitle: 'This helps us personalize your experience',
  continue: 'Continue',
  roles: {
    user: {
      title: 'User',
      description:
        'Access consultations, health records, and personalized care',
    },
    clinic: {
      title: 'Clinic',
      description: 'Manage patients, appointments, and consultations',
    },
    lab: {
      title: 'Lab',
      description: 'Handle test requests, reports, and diagnostics',
    },
  },
} as const;

export type RoleKey = keyof typeof roleSelectStrings.roles;

export const clinicOnboardingStrings = {
  details: {
    title: 'Clinic details',
    subtitle: 'Tell us about your clinic',
    stepIndicator: 'Step 2 of 4',
    clinicName: 'Clinic / Hospital Name',
    clinicNamePlaceholder: 'Enter name',
    registrationNumber: 'Registration Number / License ID',
    registrationPlaceholder: 'e.g. REG-123456',
    contactNumber: 'Contact Number',
    contactPlaceholder: '000 000 0000',
    email: 'Email ID',
    emailPlaceholder: 'clinic@example.com',
    doctorName: 'Doctor Name',
    doctorNamePlaceholder: 'Dr. John Smith',
    specializations: 'Specializations',
    specializationPlaceholder: 'e.g. General Medicine',
    removeSpecialization: 'Remove Specialization',
    addSpecialization: '+ Add Specialization',
    continue: 'Continue →',
  },
  services: {
    title: 'Clinic services',
    subtitle: 'Help patients understand what you offer',
    address: 'Address',
    addressPlaceholder: 'Full address of the clinic',
    operatingDays: 'Operating Days',
    operatingDaysOptions: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const,
    operatingHours: 'Operating Hours',
    operatingHoursStartPlaceholder: '--:-- --',
    operatingHoursEndPlaceholder: '--:-- --',
    establishmentDate: 'Establishment Date',
    establishmentPlaceholder: 'mm/dd/yyyy',
    consultationType: 'Consultation Type',
    inPersonConsultation: 'In-person consultation',
    continue: 'Continue →',
  },
  termsConsents: {
    title: 'Terms & Consents',
    subtitle:
      'Please review and accept the following to continue onboarding your clinic',
    termsLabel: "I agree to Healio's Platform Terms & Conditions",
    termsDescription:
      'Covers usage, onboarding rules, verification policies, and service obligations.',
    viewFullTerms: 'View full terms →',
    consentLabel: 'I consent to share clinic information with Healio',
    consentDescription:
      'Allows Healio to securely store, process, and display clinic details to patients.',
    liabilityLabel: 'I acknowledge the liability disclaimer',
    liabilityDescription:
      'Healio acts as a technology platform and is not responsible for clinical outcomes, diagnostics, or medical decisions.',
    submitButton: 'Submit for Review →',
  },
  profileSubmitted: {
    title: 'Profile Submitted Successfully 🎉',
    message:
      'Your clinic profile has been successfully submitted for review. Our team will verify your details and approve your profile within 24–48 hours.',
    whatsNextTitle: "What's Next?",
    whatsNextItems: [
      'Upload legal documents after approval',
      'Add bank & payout details',
      'Manage doctors & services',
      'Start receiving patient requests',
    ] as const,
    verificationTitle: 'Verification in Progress',
    verificationSubtext: '60% Profile Completed',
    goToDashboard: 'Go to Dashboard',
  },
} as const;

export const labOnboardingStrings = {
  details: {
    title: 'Laboratory Details',
    subtitle: 'Tell us about your laboratory',
    labName: 'Laboratory / Diagnostic Center Name',
    labNamePlaceholder: 'Enter lab name',
    registrationNumber: 'Registration Number / License ID',
    registrationPlaceholder: 'ID-123456789',
    address: 'Address',
    addressPlaceholder: 'Full street address, city, zip',
    contactNumber: 'Contact Number',
    contactPlaceholder: '000 000 0000',
    email: 'Email ID',
    emailPlaceholder: 'lab@healio.com',
    operatingDays: 'Operating Days',
    operatingDaysOptions: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const,
    operatingHours: 'Operating Hours',
    opensAtPlaceholder: 'Opens at',
    closesAtPlaceholder: 'Closes at',
    establishmentDate: 'Establishment Date',
    establishmentPlaceholder: 'mm/dd/yyyy',
    continue: 'Continue',
  },
  services: {
    title: 'Lab Services',
    subtitle: 'Select the tests and services you provide',
    address: 'Address',
    addressPlaceholder: 'Full street address, city, zip',
    testCategories: 'Test Categories',
    categoryOptions: [
      'Blood Tests',
      'Urine Tests',
      'Radiology',
      'Pathology',
      'Full Body Checkup',
    ] as const,
    homeSampleCollection: 'Home Sample Collection',
    homeSampleYes: 'Yes',
    homeSampleNo: 'No',
    reportDeliveryType: 'Report Delivery Type',
    reportPdf: 'PDF Download',
    reportDigital: 'Digital Report (in-app)',
    testsList: 'Tests List',
    testNamePlaceholder: 'e.g. Complete Blood Count',
    categoryPlaceholder: 'Select category',
    removeTest: 'Remove Test',
    addTest: '+ Add Test',
    continue: 'Continue',
  },
  termsConsents: {
    title: 'Terms & Consents',
    subtitle: 'Please review and accept to submit your lab profile',
    termsLabel: "I agree to Healio's Platform Terms & Conditions",
    termsDescription:
      'Covers platform usage and lab registration policies',
    viewFullTerms: 'View full terms →',
    consentLabel: 'I consent to share laboratory information with Healio',
    consentDescription:
      'Allows Healio to securely store lab details for patient access',
    liabilityLabel: 'I acknowledge the diagnostic liability disclaimer',
    liabilityDescription:
      'Healio is not responsible for test outcomes or clinical decisions',
    submitButton: 'Submit for Review',
  },
  profileSubmitted: {
    title: 'Profile Submitted Successfully 🎉',
    message:
      'Your laboratory profile has been successfully submitted for review. Our team will verify your details within 24–48 hours.',
    whatsNextTitle: "What's Next?",
    whatsNextItems: [
      'Upload required documents after approval',
      'Add bank & payout details',
      'Manage tests & services',
      'Start receiving patient requests',
    ] as const,
    verificationTitle: 'Verification in Progress',
    verificationSubtext: '60% Profile Completed',
    goToDashboard: 'Go to Dashboard',
  },
} as const;

export const onboardingFlowStrings = {
  personalDetails: {
    title: 'Tell us about yourself',
    subtitle: 'We need a few details to personalize your care',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    age: 'Age',
    agePlaceholder: 'Enter your age',
    gender: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    email: 'Email',
    emailPlaceholder: 'Enter your email address',
    preferredLanguage: 'Preferred Language',
    languagePlaceholder: 'Select your language',
    continue: 'Continue',
  },
  healthInfo: {
    title: 'Your health information',
    subtitle: 'This helps us give you better recommendations',
    question: 'Do you have any existing conditions?',
    conditions: [
      'Diabetes',
      'Blood Pressure',
      'Asthma',
      'Thyroid',
      'Heart Condition',
      'None',
    ],
    otherLabel: 'Other conditions',
    otherPlaceholder: 'Type here if any',
    continue: 'Continue',
    skip: 'Skip for now',
  },
  consent: {
    title: 'Almost done',
    subtitle: 'Please review and accept to continue',
    termsPrefix: 'I agree to the ',
    termsLink: 'Terms & Conditions',
    privacyPrefix: 'I agree to the ',
    privacyLink: 'Privacy Policy',
    supportingText:
      'Your data is securely stored and used only to improve your healthcare experience.',
    finishSetup: 'Finish Setup',
  },
  onboardingSuccess: {
    heading: 'Welcome to Healio!',
    subtext: "Your profile is ready and you're all set to begin",
    cta: 'Go to Dashboard',
    features: [
      {
        title: 'Secure access to health records',
        description: 'Your medical data is encrypted and protected',
        icon: 'shield-checkmark',
      },
      {
        title: 'Personalized recommendations',
        description: 'Get care tailored to your health needs',
        icon: 'person',
      },
      {
        title: 'Trusted clinics & labs',
        description: 'Access verified healthcare providers near you',
        icon: 'business',
      },
    ],
  },
} as const;

export const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
] as const;

export const signUpStrings = {
  createTitle: 'Create your Healio account',
  createSubtitle:
    'Quick and secure sign-up to access personalized healthcare.',
  phonePlaceholder: 'Enter your mobile number',
  countryCode: '+91',
  sendOtp: 'Send OTP',
  or: 'OR',
  signInWithGoogle: 'Sign in with Google',
  hasAccount: 'Already have an account? ',
  signIn: 'Sign In',
  verifyTitle: 'Verify your number',
  verifySubtitlePrefix: "We've sent a 6-digit code to ",
  continue: 'Continue',
} as const;

export type NavigationRouteKey = keyof typeof navigationRoutes;

