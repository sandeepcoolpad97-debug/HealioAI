import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

type AuthPrimaryButtonVariant = 'green' | 'consent';

type AuthPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AuthPrimaryButtonVariant;
  style?: StyleProp<ViewStyle>;
};

export const AuthPrimaryButton: React.FC<AuthPrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  variant = 'green',
  style,
}) => {
  const bgStyle =
    disabled && variant === 'consent'
      ? styles.disabledBg
      : variant === 'consent'
        ? styles.consentBg
        : styles.greenBg;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        bgStyle,
        disabled && variant === 'green' && styles.disabledOpacity,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  greenBg: {
    backgroundColor: colors.otpButtonGreen,
  },
  consentBg: {
    backgroundColor: colors.consentGreen,
  },
  disabledBg: {
    backgroundColor: colors.buttonDisabled,
  },
  disabledOpacity: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.buttonTextOnPrimary,
  },
});
