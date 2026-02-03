import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sharedOnboardingStyles } from '../onboarding/onboardingStyles';

export const sharedClinicOnboardingStyles = sharedOnboardingStyles;

export const clinicStepStyles = StyleSheet.create({
  stepIndicator: {
    fontSize: 14,
    color: colors.buttonTextOnPrimary,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 8,
  },
});

export const clinicInputWithIconStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundOnboardingOne,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  icon: {
    marginLeft: 8,
  },
});

export const clinicAddDoctorStyles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primaryText,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryText,
  },
});

export const clinicRemoveDoctorStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export const clinicSectionTitleStyles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 12,
    marginTop: 4,
  },
});
