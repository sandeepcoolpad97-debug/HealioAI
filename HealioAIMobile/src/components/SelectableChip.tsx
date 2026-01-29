import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

type SelectableChipVariant = 'blue' | 'green';

type SelectableChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant?: SelectableChipVariant;
  style?: StyleProp<ViewStyle>;
};

export const SelectableChip: React.FC<SelectableChipProps> = ({
  label,
  selected,
  onPress,
  variant = 'blue',
  style,
}) => {
  const selectedStyle =
    variant === 'green' ? styles.chipSelectedGreen : styles.chipSelected;
  const textSelectedStyle =
    variant === 'green' ? styles.chipTextSelectedGreen : styles.chipTextSelected;
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && selectedStyle, style]}
    >
      <Text style={[styles.chipText, selected && textSelectedStyle]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.backgroundOnboardingOne,
  },
  chipSelected: {
    borderColor: colors.primaryText,
    backgroundColor: '#E8F4FD',
  },
  chipSelectedGreen: {
    borderColor: colors.otpButtonGreen,
    backgroundColor: '#E8F5E9',
  },
  chipText: {
    fontSize: 14,
    color: colors.inputPlaceholderGrey,
  },
  chipTextSelected: {
    color: colors.primaryText,
    fontWeight: '600',
  },
  chipTextSelectedGreen: {
    color: colors.otpButtonGreen,
    fontWeight: '600',
  },
});
