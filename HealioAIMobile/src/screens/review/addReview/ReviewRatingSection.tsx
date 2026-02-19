import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

type ReviewRatingSectionProps = {
  rating: number;
  onChange: (rating: number) => void;
};

const stars = [1, 2, 3, 4, 5];

export const ReviewRatingSection: React.FC<ReviewRatingSectionProps> = ({
  rating,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How was your consultation?</Text>
      <View style={styles.starsRow}>
        {stars.map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => onChange(value)}
            style={styles.starButton}
          >
            <Icon
              name={value <= rating ? 'star' : 'star-outline'}
              size={28}
              color={value <= rating ? '#22C55E' : '#D1D5DB'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.helperText}>{rating > 0 ? 'Thank you!' : 'Select a rating'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    marginHorizontal: 6,
  },
  helperText: {
    marginTop: 10,
    fontSize: 13,
    color: colors.secondaryText,
  },
});
