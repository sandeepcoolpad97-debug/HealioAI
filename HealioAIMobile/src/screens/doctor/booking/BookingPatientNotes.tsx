import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface BookingPatientNotesProps {
  notes: string;
  onChangeNotes: (text: string) => void;
  error?: string;
}

export const BookingPatientNotes: React.FC<BookingPatientNotesProps> = ({
  notes,
  onChangeNotes,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Patient Notes <Text style={styles.required}>*</Text></Text>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    height: 120,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0, // Remove default padding
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
