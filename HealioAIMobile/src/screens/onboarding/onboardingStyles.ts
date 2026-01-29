import { Platform, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
});

export const sharedOnboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.signInBackground,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 15,
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.backgroundOnboardingOne,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...cardShadow,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundOnboardingOne,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  inputPlaceholder: {
    color: colors.inputPlaceholder,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonEnabled: {
    backgroundColor: colors.otpButtonGreen,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.buttonTextOnPrimary,
  },
});
