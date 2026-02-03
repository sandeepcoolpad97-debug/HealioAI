import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DoctorNextSlotCardProps {
  nextSlotTime: string;
}

export const DoctorNextSlotCard: React.FC<DoctorNextSlotCardProps> = ({
  nextSlotTime,
}) => {
  return (
    <View style={styles.slotCard}>
      <Text style={styles.slotTitle}>Next Available Slot</Text>
      <Text style={styles.slotTime}>{nextSlotTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  slotCard: {
    backgroundColor: '#D1E3F6', // Light blue background for slot
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  slotTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  slotTime: {
    fontSize: 14,
    color: '#4B5563',
  },
});
