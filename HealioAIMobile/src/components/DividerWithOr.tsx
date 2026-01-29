import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

type DividerWithOrProps = {
  text?: string;
  lineColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

export const DividerWithOr: React.FC<DividerWithOrProps> = ({
  text = 'OR',
  lineColor = colors.buttonTextOnPrimary,
  textColor = colors.buttonTextOnPrimary,
  style,
}) => (
  <View style={[styles.orRow, style]}>
    <View style={[styles.orLine, { backgroundColor: lineColor }]} />
    <Text style={[styles.orText, { color: textColor }]}>{text}</Text>
    <View style={[styles.orLine, { backgroundColor: lineColor }]} />
  </View>
);

const styles = StyleSheet.create({
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    opacity: 0.6,
  },
  orText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 16,
  },
});
