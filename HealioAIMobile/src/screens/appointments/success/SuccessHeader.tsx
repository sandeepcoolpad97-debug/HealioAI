import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SuccessHeaderProps {
  type: 'booking' | 'reschedule';
  doctorName: string;
  date: string;
  time: string;
}

export const SuccessHeader: React.FC<SuccessHeaderProps> = ({
  type,
  doctorName,
  date,
  time,
}) => {
  const isBooking = type === 'booking';
  const title = isBooking ? 'Appointment Booked!' : 'Rescheduled Successfully';
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="checkmark" size={32} color="#FFFFFF" />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <Text style={styles.subtitle}>
        Your appointment with <Text style={styles.highlight}>{doctorName}</Text> on <Text style={styles.highlight}>{date}</Text> at <Text style={styles.highlight}>{time}</Text> has been {isBooking ? 'confirmed' : 'updated'}.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#059669', // Green-600
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  highlight: {
    fontWeight: '600',
    color: '#111827',
  },
});
