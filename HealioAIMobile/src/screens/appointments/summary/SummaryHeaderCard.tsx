import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface SummaryHeaderCardProps {
  date: string;
  time: string;
}

export const SummaryHeaderCard: React.FC<SummaryHeaderCardProps> = ({
  date,
  time,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>Completed</Text>
      </View>
      
      <View style={styles.row}>
        <Icon name="calendar-outline" size={20} color={colors.primaryText} />
        <Text style={styles.text}>{date}</Text>
      </View>

      <View style={styles.row}>
        <Icon name="time-outline" size={20} color={colors.primaryText} />
        <Text style={styles.text}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6', // Light gray background like in image
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  badgeText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 10,
  },
});
