import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface DoctorProfileHeaderProps {
  name: string;
  specialty: string;
  imageUrl?: string;
}

export const DoctorProfileHeader: React.FC<DoctorProfileHeaderProps> = ({
  name,
  specialty,
  imageUrl = 'https://via.placeholder.com/150',
}) => {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        </View>
        <Text style={styles.doctorName}>{name}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Top 10 {specialty}s – Bengaluru</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: '#0A5FB4',
    paddingBottom: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 13,
  },
});
