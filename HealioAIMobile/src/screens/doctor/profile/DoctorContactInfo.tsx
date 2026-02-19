import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface DoctorContactInfoProps {
  phone: string;
  clinicName: string;
  location: string;
}

export const DoctorContactInfo: React.FC<DoctorContactInfoProps> = ({
  phone,
  clinicName,
  location,
}) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.contactRow}>
        <Icon name="call" size={20} color="#9CA3AF" style={styles.contactIcon} />
        <Text style={styles.contactText}>{phone}</Text>
      </View>
      <View style={styles.contactRow}>
        <Icon name="location" size={20} color="#9CA3AF" style={styles.contactIcon} />
        <View>
          <Text style={styles.contactText}>{clinicName}</Text>
          <Text style={styles.subText}>{location}</Text>
          <TouchableOpacity>
            <Text style={styles.mapLink}>View on Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  contactText: {
    fontSize: 15,
    color: '#1F2A37',
    fontWeight: '500',
  },
  subText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  mapLink: {
    fontSize: 14,
    color: '#0A5FB4',
    fontWeight: '600',
    marginTop: 4,
  },
});
