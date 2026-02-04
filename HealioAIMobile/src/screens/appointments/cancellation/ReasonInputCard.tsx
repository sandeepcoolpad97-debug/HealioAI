import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface ReasonInputCardProps {
  reason: string;
  onChangeText: (text: string) => void;
}

export const ReasonInputCard: React.FC<ReasonInputCardProps> = ({
  reason,
  onChangeText,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Reason for cancellation (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Briefly tell us why you are cancelling"
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        value={reason}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    height: 100,
    fontSize: 14,
    color: '#111827',
  },
});
