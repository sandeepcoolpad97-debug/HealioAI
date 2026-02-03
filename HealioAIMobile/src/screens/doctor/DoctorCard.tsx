import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface DoctorCardProps {
  name: string;
  specialty: string;
  rating: number;
  image?: any; // For local require or uri object
  onPress?: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  rating,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="person" size={40} color="#CCCCCC" />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#4CAF50" />
            <Text style={styles.rating}>{rating}</Text>
          </View>
          <Text style={styles.viewProfile}>View Profile</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  imageContainer: {
    height: 100,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A5FB4',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  viewProfile: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
