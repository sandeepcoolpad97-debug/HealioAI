import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type ChipRowProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number;
};

export const ChipRow: React.FC<ChipRowProps> = ({
  children,
  style,
  gap = 10,
}) => <View style={[styles.row, { gap }, style]}>{children}</View>;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
