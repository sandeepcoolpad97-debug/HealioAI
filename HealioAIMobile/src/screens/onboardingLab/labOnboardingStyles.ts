import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sharedOnboardingStyles } from '../onboarding/onboardingStyles';

export const sharedLabOnboardingStyles = sharedOnboardingStyles;

export const labInputWithIconStyles = StyleSheet.create({
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

export const labSectionTitleStyles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 12,
    marginTop: 4,
  },
});

export const labAddTestCategoryStyles = StyleSheet.create({
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

export const labRemoveTestCategoryStyles = StyleSheet.create({
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
