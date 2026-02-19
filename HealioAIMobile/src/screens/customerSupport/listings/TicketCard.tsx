import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';

export interface TicketData {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Closed';
  lastUpdated: string;
}

interface TicketCardProps {
  ticket: TicketData;
  onViewDetails: (id: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onViewDetails }) => {
  const getStatusStyle = (status: TicketData['status']) => {
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

  const statusStyle = getStatusStyle(ticket.status);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{ticket.status}</Text>
        </View>
      </View>

      <Text style={styles.subject} numberOfLines={1}>{ticket.subject}</Text>
      <Text style={styles.category}>{ticket.category}</Text>

      <View style={styles.footer}>
        <Text style={styles.lastUpdated}>Last updated: {ticket.lastUpdated}</Text>
        <TouchableOpacity onPress={() => onViewDetails(ticket.id)}>
          <Text style={styles.viewDetails}>View Details</Text>
        </TouchableOpacity>
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
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  viewDetails: {
    fontSize: 14,
    color: colors.signInBackground,
    fontWeight: '600',
  },
});
