import React from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
});

type FormCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const FormCard: React.FC<FormCardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.backgroundOnboardingOne,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...cardShadow,
  },
});
