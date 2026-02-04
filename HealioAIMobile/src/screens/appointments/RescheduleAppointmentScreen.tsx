import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';

// Components
import { CurrentAppointmentCard } from './reschedule/CurrentAppointmentCard';
import { DateSelectionCalendar } from './reschedule/DateSelectionCalendar';
import { TimeSlotGrid } from './reschedule/TimeSlotGrid';
import { RescheduleNoteInput } from './reschedule/RescheduleNoteInput';
import { RescheduleActionFooter } from './reschedule/RescheduleActionFooter';

type RescheduleAppointmentRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.RescheduleAppointment>;
type RescheduleAppointmentNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RescheduleAppointmentScreen: React.FC = () => {
  const navigation = useNavigation<RescheduleAppointmentNavigationProp>();
  const route = useRoute<RescheduleAppointmentRouteProp>();
  const { appointmentId } = route.params || { appointmentId: '#APT-458920' };

  // State
  const [selectedDate, setSelectedDate] = useState('2026-02-15');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [note, setNote] = useState('');

  // Mock Data
  const currentAppointment = {
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Cardiologist',
    date: '24 Jan 2026',
    time: '10:30 AM',
    id: appointmentId,
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirm = () => {
    navigation.navigate(navigationRoutes.AppointmentSuccess, {
      type: 'reschedule',
      doctorName: currentAppointment.doctorName,
      date: selectedDate,
      time: selectedTime,
      specialty: currentAppointment.specialty,
      appointmentId: appointmentId,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A5FB4" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reschedule Appointment</Text>
          <View style={styles.placeholderButton} /> 
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CurrentAppointmentCard 
          doctorName={currentAppointment.doctorName}
          specialty={currentAppointment.specialty}
          date={currentAppointment.date}
          time={currentAppointment.time}
          appointmentId={currentAppointment.id}
        />

        <Text style={styles.sectionTitle}>Select New Date & Time</Text>

        <DateSelectionCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <TimeSlotGrid 
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />

        <RescheduleNoteInput 
          value={note}
          onChangeText={setNote}
        />
      </ScrollView>

      <RescheduleActionFooter 
        onConfirm={handleConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerSafeArea: {
    backgroundColor: '#0A5FB4',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#0A5FB4',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholderButton: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
});
