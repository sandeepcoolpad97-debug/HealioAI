import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface TicketSummaryCardProps {
  ticketId: string;
  status: string;
}

export const TicketSummaryCard: React.FC<TicketSummaryCardProps> = ({ ticketId, status }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Ticket ID</Text>
        <Text style={styles.ticketId}>{ticketId}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Icon name="refresh-outline" size={20} color={colors.signInBackground} />
        <Text style={styles.infoText}>
          We typically respond within <Text style={styles.boldText}>24 hours</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  ticketId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  boldText: {
    color: colors.signInBackground,
    fontWeight: '700',
  },
});
