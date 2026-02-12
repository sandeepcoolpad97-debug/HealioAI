import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';

interface SuccessActionsProps {
  onBackToDashboard: () => void;
  onSubmitAnother: () => void;
}

export const SuccessActions: React.FC<SuccessActionsProps> = ({
  onBackToDashboard,
  onSubmitAnother,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={onBackToDashboard}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={onSubmitAnother}
        activeOpacity={0.7}
      >
        <Text style={styles.secondaryButtonText}>Submit another request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.signInBackground,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '500',
  },
});
