import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AppointmentDetailsCardProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  id: string;
}

export const AppointmentDetailsCard: React.FC<AppointmentDetailsCardProps> = ({
  doctorName,
  specialty,
  date,
  time,
  location,
  id,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Appointment Details</Text>
      
      <Text style={styles.doctorName}>{doctorName}</Text>
      <Text style={styles.specialty}>{specialty}</Text>
      
      <View style={styles.infoRow}>
        <Icon name="calendar-outline" size={18} color="#0A5FB4" style={styles.icon} />
        <Text style={styles.infoText}>{date}, {time}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Icon name="location-outline" size={18} color="#0A5FB4" style={styles.icon} />
        <Text style={styles.infoText}>{location}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.appointmentId}>Appointment ID: {id}</Text>
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
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  appointmentId: {
    fontSize: 13,
    color: '#6B7280',
  },
});
