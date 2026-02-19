import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface TicketHeaderCardProps {
  ticketNumber: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdDate: string;
}

export const TicketHeaderCard: React.FC<TicketHeaderCardProps> = ({
  ticketNumber,
  subject,
  status,
  createdDate,
}) => {
  const getStatusStyle = (status: TicketHeaderCardProps['status']) => {
    switch (status) {
      case 'Open':
        return { bg: '#EFF6FF', text: '#3B82F6' };
      case 'In Progress':
        return { bg: '#FFF7ED', text: '#F59E0B' };
      case 'Closed':
        return { bg: '#F0FDF4', text: '#10B981' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const statusStyle = getStatusStyle(status);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.ticketNumber}>{ticketNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{status}</Text>
        </View>
      </View>

      <Text style={styles.subject}>{subject}</Text>
      <Text style={styles.date}>Created on: {createdDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subject: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 28,
  },
  date: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
