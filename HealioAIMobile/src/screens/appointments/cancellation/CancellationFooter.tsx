import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface CancellationFooterProps {
  onBack: () => void;
  onConfirm: () => void;
}

export const CancellationFooter: React.FC<CancellationFooterProps> = ({
  onBack,
  onConfirm,
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.goBackButton} onPress={onBack}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmText}>Confirm Cancellation</Text>
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
    gap: 12,
  },
  goBackButton: {
    paddingVertical: 14,
    borderRadius: 30, // Rounded full
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0A5FB4',
    backgroundColor: '#FFFFFF',
  },
  goBackText: {
    color: '#0A5FB4',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 30, // Rounded full
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444', // Red
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
