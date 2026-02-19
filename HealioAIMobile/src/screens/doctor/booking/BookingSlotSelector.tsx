import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';
import { SlotDto } from '../../../services/slot.service';

interface BookingSlotSelectorProps {
  selectedDate: string;
  onDatePress: () => void;
  selectedSlotId: string | null;
  onSlotSelect: (slot: SlotDto) => void;
  duration: string;
  slots: SlotDto[];
}

export const BookingSlotSelector: React.FC<BookingSlotSelectorProps> = ({
  selectedDate,
  onDatePress,
  selectedSlotId,
  onSlotSelect,
  duration,
  slots
}) => {
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

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
            {slots.length === 0 ? (
              <Text style={{ padding: 10, color: colors.secondaryText }}>No slots available for this date.</Text>
            ) : (
              slots.map((slot) => {
                const isAvailable = slot.status === 'available';
                const isSelected = selectedSlotId === slot._id;
                const timeLabel = formatTime(slot.slotStartAt);
                
                return (
                  <TouchableOpacity
                    key={slot._id}
                    disabled={!isAvailable && !isSelected}
                    style={[
                      styles.timeSlot,
                      !isAvailable && !isSelected && styles.unavailableTimeSlot,
                      isSelected && styles.selectedTimeSlot,
                    ]}
                    onPress={() => onSlotSelect(slot)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        !isAvailable && !isSelected && styles.unavailableTimeSlotText,
                        isSelected && styles.selectedTimeSlotText,
                      ]}
                    >
                      {timeLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  section: {
    paddingVertical: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slotsContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  selectedTimeSlot: {
    backgroundColor: '#34A853',
    borderColor: '#34A853',
  },
  unavailableTimeSlot: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  unavailableTimeSlotText: {
    color: '#EF4444',
    textDecorationLine: 'line-through',
  },
});
