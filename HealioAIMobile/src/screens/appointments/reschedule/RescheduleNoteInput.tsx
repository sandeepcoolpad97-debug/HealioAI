import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface RescheduleNoteInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const RescheduleNoteInput: React.FC<RescheduleNoteInputProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Note (Optional)</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Add note or reason for rescheduling..."
        placeholderTextColor="#9CA3AF"
        multiline
        value={value}
        onChangeText={onChangeText}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    height: 100,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
});
