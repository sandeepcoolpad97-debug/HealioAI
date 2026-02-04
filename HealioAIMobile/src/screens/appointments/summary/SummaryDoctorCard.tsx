import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface SummaryDoctorCardProps {
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  imageUrl?: string;
}

export const SummaryDoctorCard: React.FC<SummaryDoctorCardProps> = ({
  name,
  specialty,
  hospital,
  location,
  imageUrl,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="person" size={30} color={colors.primaryBlue} />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
          <Text style={styles.hospital}>{hospital}</Text>
          <View style={styles.locationRow}>
            <Icon name="location" size={14} color={colors.primaryBlue} />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  hospital: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
});
