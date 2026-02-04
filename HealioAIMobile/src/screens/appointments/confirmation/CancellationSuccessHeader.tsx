import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CancellationSuccessHeaderProps {
  doctorName: string;
  date: string;
  time: string;
}

export const CancellationSuccessHeader: React.FC<CancellationSuccessHeaderProps> = ({
  doctorName,
  date,
  time,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="close" size={32} color="#EF4444" />
      </View>
      
      <Text style={styles.title}>Appointment Cancelled</Text>
      
      <Text style={styles.subtitle}>
        Your appointment with <Text style={styles.highlight}>{doctorName}</Text> on <Text style={styles.highlight}>{date}</Text> at <Text style={styles.highlight}>{time}</Text> has been cancelled.
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
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
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
