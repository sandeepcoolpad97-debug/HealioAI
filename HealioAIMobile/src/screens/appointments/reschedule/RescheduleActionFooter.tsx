import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface RescheduleActionFooterProps {
  onConfirm: () => void;
  disabled?: boolean;
}

export const RescheduleActionFooter: React.FC<RescheduleActionFooterProps> = ({
  onConfirm,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, disabled && styles.buttonDisabled]} 
        onPress={onConfirm}
        disabled={disabled}
      >
        <Text style={[styles.text, disabled && styles.textDisabled]}>Confirm Reschedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  button: {
    backgroundColor: '#4CAF50', // Green
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB', // Gray
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
});
