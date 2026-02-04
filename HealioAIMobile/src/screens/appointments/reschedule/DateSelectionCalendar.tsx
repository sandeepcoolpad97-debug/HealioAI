import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';

interface DateSelectionCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onDateSelect: (date: string) => void;
}

// Simplified calendar mock matching the image
// In a real app, use react-native-calendars
export const DateSelectionCalendar: React.FC<DateSelectionCalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Generating a grid that resembles the image (Feb 2026 approx)
  // Rows of dates
  const calendarData = [
    [null, null, null, null, null, null, 1],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, null],
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Date</Text>
      
      {/* Days Header */}
      <View style={styles.daysRow}>
        {days.map((day, index) => (
          <Text key={index} style={styles.dayText}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      {calendarData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.datesRow}>
          {row.map((date, colIndex) => {
            if (date === null) {
              return <View key={colIndex} style={styles.dateCell} />;
            }

            const isSelected = date === 15; // Hardcoded selection for visual match
            
            return (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.dateCell,
                  isSelected && styles.selectedDateCell
                ]}
                onPress={() => onDateSelect(`2026-02-${date}`)}
              >
                <Text style={[
                  styles.dateText,
                  isSelected && styles.selectedDateText
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
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
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayText: {
    width: 32,
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateCell: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectedDateCell: {
    backgroundColor: '#4CAF50', // Green
  },
  dateText: {
    fontSize: 14,
    color: '#1F2937',
  },
  selectedDateText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
