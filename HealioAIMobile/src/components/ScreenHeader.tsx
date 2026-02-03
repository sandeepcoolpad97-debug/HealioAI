import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: object;
  subtitleStyle?: object;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
}) => (
  <View style={[styles.header, style]}>
    <Text style={[styles.title, titleStyle]}>{title}</Text>
    {subtitle != null && (
      <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 15,
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 22,
  },
});
