import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

const inputShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
});

type PhoneInputProps = {
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  editable?: boolean;
  displayValue?: string;
  withShadow?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Enter your mobile number',
  placeholderTextColor = colors.inputPlaceholder,
  editable = true,
  displayValue,
  withShadow = false,
  accessibilityLabel,
  style,
}) => {
  const containerStyle = [styles.inputRow, withShadow && inputShadow, style];

  return (
    <View style={containerStyle}>
      <View style={styles.countryCode}>
        <Text style={styles.countryCodeText}>+91</Text>
      </View>
      {editable ? (
        <TextInput
          style={styles.phoneInput}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          maxLength={14}
          accessibilityLabel={accessibilityLabel ?? placeholder}
        />
      ) : (
        <View style={styles.phoneDisplay}>
          <Text style={styles.phoneDisplayText}>{displayValue ?? value}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 52,
    backgroundColor: colors.backgroundOnboardingOne,
  },
  countryCode: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.countryCodeBg,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.countryCodeText,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.backgroundOnboardingOne,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  phoneDisplay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  phoneDisplayText: {
    fontSize: 16,
    color: colors.inputPlaceholderGrey,
  },
});
