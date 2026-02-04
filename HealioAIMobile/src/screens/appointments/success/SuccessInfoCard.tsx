import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const SuccessInfoCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="calendar-outline" size={20} color="#0A5FB4" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Added to Calendar</Text>
          <Text style={styles.description}>
            We've added this appointment to your in-app calendar.
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="notifications-outline" size={20} color="#0A5FB4" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Reminder Set</Text>
          <Text style={styles.description}>
            We'll remind you 1 hour before your appointment.
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="document-text-outline" size={20} color="#0A5FB4" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Preparation Guide</Text>
          <Text style={styles.description}>
            Check your email for instructions before your visit.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
