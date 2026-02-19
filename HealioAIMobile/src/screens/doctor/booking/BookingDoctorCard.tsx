import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface BookingDoctorCardProps {
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  consultationType: string;
}

export const BookingDoctorCard: React.FC<BookingDoctorCardProps> = ({
  name,
  specialty,
  hospital,
  location,
  consultationType,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
          <Text style={styles.hospital}>{hospital}</Text>
          <View style={styles.locationRow}>
            <Icon name="location" size={14} color="#0A5FB4" />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
      </View>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{consultationType}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    // Add shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  hospital: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  badgeContainer: {
    marginTop: 12,
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#0A5FB4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
