import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const CancellationInfoCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="checkmark-circle" size={20} color="#34D399" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Queue Position Updated</Text>
          <Text style={styles.description}>
            Your position in future queues has been adjusted.
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="notifications" size={20} color="#34D399" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Notifications Sent</Text>
          <Text style={styles.description}>
            Confirmation SMS and email have been sent to you.
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="calendar" size={20} color="#34D399" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Reschedule Anytime</Text>
          <Text style={styles.description}>
            You can book a new appointment whenever you need.
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
