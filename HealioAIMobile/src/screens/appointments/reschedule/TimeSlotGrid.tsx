import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TimeSlotGridProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedTime,
  onTimeSelect,
}) => {
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Time</Text>
      
      <View style={styles.grid}>
        {timeSlots.map((time, index) => {
          const isSelected = time === selectedTime;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.slot,
                isSelected && styles.selectedSlot
              ]}
              onPress={() => onTimeSelect(time)}
            >
              <Text style={[
                styles.slotText,
                isSelected && styles.selectedSlotText
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slot: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedSlot: {
    backgroundColor: '#4CAF50', // Green
    borderColor: '#4CAF50',
  },
  slotText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedSlotText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
