import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

type SelectableChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const SelectableChip: React.FC<SelectableChipProps> = ({
  label,
  selected,
  onPress,
  style,
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected, style]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </Pressable>
);

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
  chipText: {
    fontSize: 14,
    color: colors.inputPlaceholderGrey,
  },
  chipTextSelected: {
    color: colors.primaryText,
    fontWeight: '600',
  },
});
