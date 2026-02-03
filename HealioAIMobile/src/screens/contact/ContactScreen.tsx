import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const ContactScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contact Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
  },
  text: {
    fontSize: 18,
    color: colors.primaryText,
  },
});
