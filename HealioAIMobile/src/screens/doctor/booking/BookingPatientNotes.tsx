import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface BookingPatientNotesProps {
  notes: string;
  onChangeNotes: (text: string) => void;
}

export const BookingPatientNotes: React.FC<BookingPatientNotesProps> = ({
  notes,
  onChangeNotes,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Patient Notes (Optional)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Briefly describe symptoms or reason for visit"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={onChangeNotes}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    height: 120,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0, // Remove default padding
  },
});
