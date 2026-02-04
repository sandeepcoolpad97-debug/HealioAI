import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AppointmentHeaderCardProps {
  status: 'upcoming' | 'completed' | 'cancelled';
  date: string;
  time: string;
}

export const AppointmentHeaderCard: React.FC<AppointmentHeaderCardProps> = ({
  status,
  date,
  time,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Icon name="calendar-outline" size={20} color="#1F2A37" />
        <Text style={styles.text}>{date}</Text>
      </View>
      
      <View style={styles.row}>
        <Icon name="time-outline" size={20} color="#1F2A37" />
        <Text style={styles.text}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1E3F6', // Light blue
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#C6F6D5', // Light green for upcoming
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    color: '#22543D',
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2A37',
    marginLeft: 10,
  },
});
