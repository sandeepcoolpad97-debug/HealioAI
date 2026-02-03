import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface BookingSlotSelectorProps {
  selectedDate: string;
  onDatePress: () => void;
  selectedTimeSlot: string;
  onTimeSlotSelect: (time: string) => void;
  duration: string;
}

const TIME_SLOTS = ['9:30 AM', '10:30 AM', '11:30 AM'];

export const BookingSlotSelector: React.FC<BookingSlotSelectorProps> = ({
  selectedDate,
  onDatePress,
  selectedTimeSlot,
  onTimeSlotSelect,
  duration,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Choose Appointment</Text>
      
      <View style={styles.card}>
        {/* Date Selection */}
        <TouchableOpacity style={styles.rowItem} onPress={onDatePress}>
          <View style={styles.iconWrapper}>
            <Icon name="calendar-outline" size={20} color="#0A5FB4" />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.label}>Select Date</Text>
            <Text style={styles.value}>{selectedDate}</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Time Selection */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <View style={styles.iconWrapper}>
              <Icon name="time-outline" size={20} color="#0A5FB4" />
            </View>
            <Text style={styles.label}>Select Time Slot</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsContainer}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === time && styles.selectedTimeSlot,
                ]}
                onPress={() => onTimeSlotSelect(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTimeSlot === time && styles.selectedTimeSlotText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.divider} />

        {/* Duration */}
        <View style={styles.rowItem}>
          <View style={styles.iconWrapper}>
            <Icon name="hourglass-outline" size={20} color="#0A5FB4" />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.label}>Consultation Duration</Text>
            <Text style={styles.value}>{duration}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  section: {
    paddingVertical: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  slotsContainer: {
    marginLeft: 44, // Align with text
  },
  timeSlot: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedTimeSlot: {
    backgroundColor: '#0A5FB4',
  },
  timeSlotText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
});
