import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface AppointmentActionFooterProps {
  onReschedule: () => void;
  onCancel: () => void;
}

export const AppointmentActionFooter: React.FC<AppointmentActionFooterProps> = ({
  onReschedule,
  onCancel,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.rescheduleButton]} 
        onPress={onReschedule}
      >
        <Text style={styles.rescheduleText}>Reschedule</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.cancelButton]} 
        onPress={onCancel}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Safe area for iOS
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleButton: {
    backgroundColor: '#0A5FB4', // Primary Blue
    marginRight: 12,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444', // Red border
  },
  rescheduleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    color: '#EF4444', // Red text
    fontSize: 16,
    fontWeight: '600',
  },
});
