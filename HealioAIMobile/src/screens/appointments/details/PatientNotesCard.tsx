import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PatientNotesCardProps {
  notes: string;
}

export const PatientNotesCard: React.FC<PatientNotesCardProps> = ({
  notes,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Patient Notes</Text>
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>{notes}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  noteContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});
