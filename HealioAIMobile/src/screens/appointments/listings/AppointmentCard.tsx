import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface AppointmentCardProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'past' | 'cancelled';
  onPress: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  specialty,
  date,
  time,
  status,
  onPress,
}) => {
  const isUpcoming = status === 'upcoming';

  return (
    <View style={styles.card}>
      {/* Header: Name and Status Badge */}
      <View style={styles.headerRow}>
        <Text style={styles.doctorName}>{doctorName}</Text>
        {isUpcoming && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Upcoming</Text>
          </View>
        )}
      </View>

      <Text style={styles.specialty}>{specialty}</Text>

      {/* Date and Time Info */}
      <View style={styles.infoRow}>
        <Icon name="calendar-outline" size={16} color={colors.primaryBlue} style={styles.icon} />
        <Text style={styles.infoText}>{date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="time-outline" size={16} color={colors.primaryBlue} style={styles.icon} />
        <Text style={styles.infoText}>{time}</Text>
      </View>

      {/* View More Button */}
      <TouchableOpacity style={styles.viewMoreContainer} onPress={onPress}>
        <Text style={styles.viewMoreText}>View More</Text>
        <Icon name="chevron-forward" size={16} color={colors.primaryBlue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryBlue,
    marginRight: 4,
  },
});
