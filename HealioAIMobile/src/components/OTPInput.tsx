import React, { useCallback, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';

type OTPInputProps = {
  length: number;
  digits: string[];
  onDigitsChange: (digits: string[]) => void;
  accessibilityLabelPrefix?: string;
};

export const OTPInput: React.FC<OTPInputProps> = ({
  length,
  digits,
  onDigitsChange,
  accessibilityLabelPrefix = 'Digit',
}) => {
  const refs = useRef<(TextInput | null)[]>([]);

  const updateOtp = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        const chars = value.replace(/\D/g, '').slice(0, length).split('');
        const next = [...digits];
        chars.forEach((c, i) => {
          if (index + i < length) next[index + i] = c;
        });
        onDigitsChange(next);
        const nextIdx = Math.min(index + chars.length, length - 1);
        refs.current[nextIdx]?.focus();
        return;
      }
      const next = [...digits];
      next[index] = value.replace(/\D/g, '');
      onDigitsChange(next);
      if (value && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    },
    [length, digits, onDigitsChange],
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === 'Backspace' && !digits[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  return (
    <View style={styles.otpRow}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          style={styles.otpInput}
          value={digit}
          onChangeText={(v) => updateOtp(index, v)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={index === 0 ? length : 1}
          selectTextOnFocus
          accessibilityLabel={`${accessibilityLabelPrefix} ${index + 1} of ${length}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 56,
    borderRadius: 12,
    backgroundColor: colors.backgroundOnboardingOne,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});
