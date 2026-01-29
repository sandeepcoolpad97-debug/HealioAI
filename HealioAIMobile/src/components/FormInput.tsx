import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

type FormInputProps = TextInputProps & {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: object;
  inputStyle?: object;
  multiline?: boolean;
};

export const FormInput: React.FC<FormInputProps> = ({
  label,
  containerStyle,
  labelStyle,
  inputStyle,
  multiline = false,
  placeholderTextColor = colors.inputPlaceholder,
  ...textInputProps
}) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={[styles.label, labelStyle]}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        multiline && styles.inputMultiline,
        inputStyle,
      ]}
      placeholderTextColor={placeholderTextColor}
      multiline={multiline}
      {...textInputProps}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
