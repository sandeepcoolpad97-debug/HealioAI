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
  HealthInfo: 'HealthInfo',
  Consent: 'Consent',
  OnboardingSuccess: 'OnboardingSuccess',
  Home: 'Home',
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

