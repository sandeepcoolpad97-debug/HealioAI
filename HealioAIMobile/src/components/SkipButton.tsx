import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

export type SkipButtonVariant = 'light' | 'dark';

type SkipButtonProps = {
  onPress: () => void;
  variant?: SkipButtonVariant;
  style?: StyleProp<ViewStyle>;
};

/**
 * Skip button for onboarding flows.
 * Renders "Skip" text, top-right alignment when placed in a flex-end row.
 * Parent should use SafeAreaView and a row with justifyContent: 'flex-end'.
 */
const SkipButton: React.FC<SkipButtonProps> = ({
  onPress,
  variant = 'light',
  style,
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? colors.skipText : colors.buttonTextOnPrimary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
      accessibilityLabel="Skip"
      accessibilityRole="button"
    >
      <Text style={[styles.text, { color: textColor }]}>Skip</Text>
    </Pressable>
  );
};

export default SkipButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
