export const colors = {
  primaryBlue: '#0066CC',

  primaryText: '#0A5FB4',
  secondaryText: '#4B5563',
  backgroundLight: '#F9FAFB',

  backgroundOnboardingOne: '#FFFFFF',
  backgroundOnboardingTwo: '#EFF6FF',
  backgroundOnboardingThree: '#ECFDF3',

  skipText: '#4B5563',
  buttonTextOnPrimary: '#FFFFFF',

  // Sign In / OTP screens
  signInBackground: '#0A5FB4',
  countryCodeBg: '#E0E0E0',
  countryCodeText: '#000000',
  otpButtonGreen: '#4CAF50',
  inputPlaceholder: '#9CA3AF',
  inputPlaceholderGrey: '#6B7280',
  buttonDisabled: '#9E9E9E',
  consentGreen: '#A5D6A7',
  chipBorder: '#D0D0D0',
  // Onboarding success
  successCircleBg: '#E8F5E9',
  successIconGreen: '#34A853',
  successHeading: '#1F2A37',
  successFeatureIconBg: '#E6F4EA',
  dashboardButtonBlue: '#0B5CAD',
} as const;

export type ColorKey = keyof typeof colors;
