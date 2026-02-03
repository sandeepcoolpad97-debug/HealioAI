import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface DoctorStatsCardProps {
  rating: number;
  reviewCount: number;
  experienceYears: number;
}

export const DoctorStatsCard: React.FC<DoctorStatsCardProps> = ({
  rating,
  reviewCount,
  experienceYears,
}) => {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <View style={styles.ratingRow}>
          <Icon name="star" size={18} color="#4CAF50" />
          <Text style={styles.ratingValue}>{rating} / 5</Text>
        </View>
        <Text style={styles.statLabel}>Based on {reviewCount} reviews</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={styles.expValue}>{experienceYears}+ Years</Text>
        <Text style={styles.statLabel}>Experience</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginLeft: 6,
  },
  expValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E7EB',
  },
});
