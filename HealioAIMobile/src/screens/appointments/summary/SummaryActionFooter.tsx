import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface SummaryActionFooterProps {
  onBookFollowUp: () => void;
  onDownloadSummary: () => void;
}

export const SummaryActionFooter: React.FC<SummaryActionFooterProps> = ({
  onBookFollowUp,
  onDownloadSummary,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={onBookFollowUp}
      >
        <Text style={styles.primaryButtonText}>Book Follow-up Appointment</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={onDownloadSummary}
      >
        <Text style={styles.secondaryButtonText}>Download Summary</Text>
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
  primaryButton: {
    backgroundColor: '#0A5FB4', // Primary Blue
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: '#0A5FB4', // Primary Blue
    fontSize: 16,
    fontWeight: '500',
  },
});
