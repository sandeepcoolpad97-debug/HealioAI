import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppointmentInfoCardProps {
  mode: string;
  duration: string;
  appointmentId: string;
}

export const AppointmentInfoCard: React.FC<AppointmentInfoCardProps> = ({
  mode,
  duration,
  appointmentId,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Appointment Details</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Mode</Text>
        <Text style={styles.value}>{mode}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{duration}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <Text style={styles.label}>Appointment ID</Text>
        <Text style={styles.idValue}>{appointmentId}</Text>
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
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  idValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A5FB4', // Blue color for ID
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
});
