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

type ConsentRowVariant = 'blue' | 'green';

type ConsentRowProps = {
  checked: boolean;
  onToggle: () => void;
  title: string;
  description?: string;
  linkText?: string;
  onLinkPress?: () => void;
  variant?: ConsentRowVariant;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const ConsentRow: React.FC<ConsentRowProps> = ({
  checked,
  onToggle,
  title,
  description,
  linkText,
  onLinkPress,
  variant = 'blue',
  accessibilityLabel,
  style,
}) => {
  const checkedStyle =
    variant === 'blue' ? styles.checkboxCheckedBlue : styles.checkboxChecked;

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.row, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel ?? title}
    >
      <View style={[styles.checkbox, checked && checkedStyle]}>
        {checked && (
          <Ionicons
            name="checkmark"
            size={14}
            color={colors.buttonTextOnPrimary}
          />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description != null && description !== '' && (
          <Text style={styles.description}>{description}</Text>
        )}
        {linkText != null && linkText !== '' && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onLinkPress?.();
            }}
            style={styles.linkWrap}
            accessibilityRole="link"
            accessibilityLabel={linkText}
          >
            <Text style={styles.linkText}>{linkText}</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
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
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: colors.otpButtonGreen,
    backgroundColor: colors.otpButtonGreen,
  },
  checkboxCheckedBlue: {
    borderColor: colors.primaryText,
    backgroundColor: colors.primaryText,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.inputPlaceholderGrey,
    lineHeight: 19,
    marginBottom: 4,
  },
  linkWrap: {
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
