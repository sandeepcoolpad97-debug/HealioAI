import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

type ReviewSuccessFooterProps = {
  onBackToProfile: () => void;
  onEditReview: () => void;
};

export const ReviewSuccessFooter: React.FC<ReviewSuccessFooterProps> = ({
  onBackToProfile,
  onEditReview,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.primaryButton} onPress={onBackToProfile}>
        <Text style={styles.primaryText}>Back to Appointment</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onEditReview} style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Edit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0A5FB4',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#0A5FB4',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
  },
  secondaryText: {
    color: '#DBEAFE',
    fontSize: 14,
    fontWeight: '500',
  },
});
