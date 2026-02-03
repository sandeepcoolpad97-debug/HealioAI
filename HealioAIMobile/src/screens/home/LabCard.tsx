import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface LabCardProps {
  name: string;
  distance: string;
  rating: number;
  hasHomeSample?: boolean;
  onPress?: () => void;
}

export const LabCard: React.FC<LabCardProps> = ({
  name,
  distance,
  rating,
  hasHomeSample = true,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        
        <View style={styles.locationContainer}>
          <Icon name="location" size={14} color="#9CA3AF" />
          <Text style={styles.distance}>{distance}</Text>
        </View>

        {hasHomeSample && (
          <View style={styles.tagContainer}>
            <Icon name="home" size={12} color="#4CAF50" />
            <Text style={styles.tagText}>Home Sample Available</Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#4CAF50" />
            <Text style={styles.rating}>{rating}</Text>
          </View>
          <Text style={styles.viewLab}>View Lab</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 240, // Wider than doctor card
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
    padding: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A5FB4',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distance: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 6,
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  viewLab: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
