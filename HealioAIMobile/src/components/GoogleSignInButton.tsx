import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

type GoogleSignInButtonProps = {
  onPress: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  label = 'Sign in with Google',
  style,
}) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.backgroundOnboardingOne,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
  },
});
