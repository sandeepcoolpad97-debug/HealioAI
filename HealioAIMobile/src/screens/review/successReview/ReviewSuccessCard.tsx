import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

type ReviewSuccessCardProps = {
  doctorName: string;
  specialty: string;
  rating: number;
  reviewText?: string;
  submittedText: string;
  imageUrl?: string;
};

export const ReviewSuccessCard: React.FC<ReviewSuccessCardProps> = ({
  doctorName,
  specialty,
  rating,
  reviewText,
  submittedText,
  imageUrl,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={26} color={colors.primaryBlue} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{doctorName}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
        </View>
      </View>

      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon
            key={`star-${index}`}
            name={index < rating ? 'star' : 'star-outline'}
            size={18}
            color={index < rating ? '#22C55E' : '#D1D5DB'}
          />
        ))}
        <Text style={styles.ratingText}>{rating > 0 ? 'Excellent' : 'No rating'}</Text>
      </View>

      {reviewText ? (
        <View style={styles.reviewBox}>
          <Text style={styles.reviewText}>{reviewText}</Text>
        </View>
      ) : null}

      <View style={styles.submittedRow}>
        <Icon name="time-outline" size={14} color="#6B7280" />
        <Text style={styles.submittedText}>{submittedText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  specialty: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  reviewBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  reviewText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  submittedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  submittedText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#6B7280',
  },
});
