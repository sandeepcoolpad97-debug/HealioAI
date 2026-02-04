import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface DoctorInfoCardProps {
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  imageUrl?: string;
}

export const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({
  name,
  specialty,
  hospital,
  location,
  imageUrl,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
          ) : (
            <Icon name="person" size={30} color="#0A5FB4" />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
          <Text style={styles.hospital}>{hospital}</Text>
          <View style={styles.locationRow}>
            <Icon name="location-sharp" size={14} color="#0A5FB4" />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
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
    borderColor: '#F3F4F6',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
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
    color: '#4B5563',
    marginLeft: 4,
  },
});
