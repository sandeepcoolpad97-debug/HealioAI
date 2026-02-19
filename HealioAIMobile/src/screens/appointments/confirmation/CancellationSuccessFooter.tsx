import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface CancellationSuccessFooterProps {
  onGoBack: () => void;
}

export const CancellationSuccessFooter: React.FC<CancellationSuccessFooterProps> = ({
  onGoBack,
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.button} onPress={onGoBack}>
        <Text style={styles.buttonText}>Go Back to Appointments</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0A5FB4',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#0A5FB4',
    fontSize: 16,
    fontWeight: '600',
  },
});
