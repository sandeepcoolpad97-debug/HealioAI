import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {colors} from '../constants/colors';

type ButtonVariant = 'primary' | 'secondary';

type CommonButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  disabled?: boolean;
};

export const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled = false,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.baseButton,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}>
      <Text
        style={[
          styles.baseLabel,
          isPrimary ? styles.primaryLabel : styles.secondaryLabel,
          disabled && styles.disabledLabel,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  primaryButton: {
    backgroundColor: colors.primaryBlue,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  disabledButton: {
    opacity: 0.6,
  },
  baseLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryLabel: {
    color: colors.buttonTextOnPrimary,
  },
  secondaryLabel: {
    color: colors.primaryBlue,
  },
  disabledLabel: {
    // keep same color but reduce opacity through container
  },
});

