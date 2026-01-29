import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';

type CheckboxRowProps = {
  checked: boolean;
  onToggle: () => void;
  label: React.ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const CheckboxRow: React.FC<CheckboxRowProps> = ({
  checked,
  onToggle,
  label,
  accessibilityLabel,
  style,
}) => (
  <Pressable
    onPress={onToggle}
    style={[styles.row, style]}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
    accessibilityLabel={accessibilityLabel}
  >
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && (
        <Ionicons
          name="checkmark"
          size={14}
          color={colors.buttonTextOnPrimary}
        />
      )}
    </View>
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.chipBorder,
    backgroundColor: colors.backgroundOnboardingOne,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.otpButtonGreen,
    backgroundColor: colors.otpButtonGreen,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
});
