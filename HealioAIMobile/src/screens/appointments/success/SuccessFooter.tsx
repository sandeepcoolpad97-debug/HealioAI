import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface SuccessFooterProps {
  onGoHome: () => void;
  onViewAppointment: () => void;
}

export const SuccessFooter: React.FC<SuccessFooterProps> = ({
  onGoHome,
  onViewAppointment,
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.primaryButton} onPress={onViewAppointment}>
        <Text style={styles.primaryButtonText}>View Appointment</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={onGoHome}>
        <Text style={styles.secondaryButtonText}>Go to Home</Text>
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
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A5FB4',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
});
