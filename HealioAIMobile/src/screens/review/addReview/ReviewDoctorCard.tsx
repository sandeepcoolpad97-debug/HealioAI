import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

type ReviewDoctorCardProps = {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  imageUrl?: string;
};

export const ReviewDoctorCard: React.FC<ReviewDoctorCardProps> = ({
  doctorName,
  specialty,
  date,
  time,
  imageUrl,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={28} color={colors.primaryBlue} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{doctorName}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
          <Text style={styles.dateText}>{date} • {time}</Text>
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
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
    flex: 1,
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
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
