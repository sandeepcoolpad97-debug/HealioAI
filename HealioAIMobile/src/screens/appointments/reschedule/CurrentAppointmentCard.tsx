import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface CurrentAppointmentCardProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  appointmentId: string;
}

export const CurrentAppointmentCard: React.FC<CurrentAppointmentCardProps> = ({
  doctorName,
  specialty,
  date,
  time,
  appointmentId,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Appointment</Text>
      
      <Text style={styles.doctorName}>{doctorName}</Text>
      <Text style={styles.specialty}>{specialty}</Text>
      
      <View style={styles.dateTimeRow}>
        <Icon name="calendar-outline" size={16} color="#1F2937" />
        <Text style={styles.dateTimeText}>{date}, {time}</Text>
      </View>
      
      <Text style={styles.appointmentId}>{appointmentId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1E5F8', // Light blue background similar to image
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  label: {
    color: '#0A5FB4',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  appointmentId: {
    fontSize: 12,
    color: '#6B7280',
  },
});
