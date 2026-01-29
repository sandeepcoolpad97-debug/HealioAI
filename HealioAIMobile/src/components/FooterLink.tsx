import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

type FooterLinkProps = {
  prefix: string;
  linkText: string;
  onPress: () => void;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

export const FooterLink: React.FC<FooterLinkProps> = ({
  prefix,
  linkText,
  onPress,
  textColor = colors.buttonTextOnPrimary,
  style,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.wrap, pressed && styles.pressed, style]}
  >
    <Text style={[styles.text, { color: textColor }]}>
      {prefix}
      <Text style={styles.link}> {linkText}</Text>
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    fontWeight: '600',
  },
});
