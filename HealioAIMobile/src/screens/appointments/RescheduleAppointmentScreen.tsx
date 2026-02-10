import React, { useState, useEffect, useRef } from 'react';
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
import DatePicker from 'react-native-date-picker';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';

// Services
import { appointmentService } from '../../services/appointment.service';
import { slotService, SlotDto } from '../../services/slot.service';
import { categoryService, CategoryDto } from '../../services/category.service';

// Components
import { CurrentAppointmentCard } from './reschedule/CurrentAppointmentCard';
import { RescheduleNoteInput } from './reschedule/RescheduleNoteInput';
import { RescheduleActionFooter } from './reschedule/RescheduleActionFooter';
import { BookingSlotSelector } from '../doctor/booking/BookingSlotSelector';
import { Loader, Dropdown } from '../../components';

type RescheduleAppointmentRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.RescheduleAppointment>;
type RescheduleAppointmentNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RescheduleAppointmentScreen: React.FC = () => {
  const navigation = useNavigation<RescheduleAppointmentNavigationProp>();
  const route = useRoute<RescheduleAppointmentRouteProp>();
  const { appointmentId } = route.params || { appointmentId: '' };

  // State
  const [loading, setLoading] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  console.log('currentAppointment', currentAppointment);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<SlotDto[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const lockedSlotIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoryService.getCategories(true, 'reschedule');
        console.log('Reschedule categories:', data);
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch current appointment details
    const fetchAppointment = async () => {
      if (!appointmentId) return;
      try {
        setLoading(true);
        const data = await appointmentService.getAppointmentById(appointmentId);
        
        // Map API data to UI model
        setCurrentAppointment({
          doctorName: data.doctorId?.doctorName || 'Unknown Doctor',
          specialty: data.doctorId?.specialisation || 'Specialist',
          date: new Date(data.currentStartAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          time: new Date(data.currentStartAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          id: data.appointmentId,
          doctorId: data.doctorId?._id
        });
      } catch (error) {
        console.error('Failed to fetch appointment:', error);
        Alert.alert('Error', 'Failed to load appointment details');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  useEffect(() => {
    // Cleanup locked slot on unmount
    return () => {
      if (lockedSlotIdRef.current) {
        slotService.unlockSlot(lockedSlotIdRef.current).catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch slots when date or doctor changes
    const fetchSlots = async () => {
      if (!currentAppointment?.doctorId) return;

      // Unlock previously locked slot if exists when date changes
      if (lockedSlotIdRef.current) {
        try {
          await slotService.unlockSlot(lockedSlotIdRef.current);
          lockedSlotIdRef.current = null;
          setSelectedSlotId(null);
          setSelectedTime('');
        } catch (e) {
          console.error("Error unlocking slot on date change", e);
        }
      }

      try {
        setLoading(true);
        let slots = await slotService.getSlots(currentAppointment.doctorId, selectedDate);
        
        // Auto-generate slots if empty and date is valid (similar to booking screen)
        const today = new Date().toISOString().split('T')[0];
        if (slots.length === 0 && selectedDate >= today) {
           try {
             await slotService.generateSlots({
               doctorId: currentAppointment.doctorId,
               date: selectedDate,
               startTime: "09:00",
               endTime: "17:00",
               durationMinutes: 30
             });
             slots = await slotService.getSlots(currentAppointment.doctorId, selectedDate);
           } catch (e) {
             console.log("Auto-generation failed", e);
           }
        }
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentAppointment) {
      fetchSlots();
    }
  }, [selectedDate, currentAppointment]);

  const handleBack = async () => {
    if (lockedSlotIdRef.current) {
      try {
        await slotService.unlockSlot(lockedSlotIdRef.current);
      } catch (e) {
        console.error("Error unlocking on back", e);
      }
    }
    navigation.goBack();
  };

  const handleSlotSelect = async (slot: SlotDto) => {
    if (slot.status !== 'available') return;
    if (slot._id === lockedSlotIdRef.current) return;

    try {
      setLoading(true);
      
      // Unlock previous if exists
      if (lockedSlotIdRef.current) {
          await slotService.unlockSlot(lockedSlotIdRef.current);
          lockedSlotIdRef.current = null;
      }

      // Lock the slot
      await slotService.lockSlot(slot._id);
      lockedSlotIdRef.current = slot._id;
      
      setSelectedSlotId(slot._id);
      
      // Format time
      const date = new Date(slot.slotStartAt);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
      setSelectedTime(formattedTime);
      
      // Refresh slots
      const slots = await slotService.getSlots(currentAppointment.doctorId, selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      Alert.alert('Error', 'Could not lock this slot. It might be already taken.');
      setSelectedSlotId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlotId || !currentAppointment) {
      Alert.alert('Selection Required', 'Please select a new time slot.');
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert('Validation Error', 'Please select a reason for rescheduling.');
      return;
    }

    if (!note.trim()) {
      Alert.alert('Validation Error', 'Please add a note for rescheduling.');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate new start time based on selected slot
      // We need to get the actual slot object to get the ISO string
      const slot = availableSlots.find(s => s._id === selectedSlotId);
      if (!slot) {
        throw new Error('Selected slot not found');
      }

      await appointmentService.rescheduleAppointment(
        appointmentId, 
        slot.slotStartAt, 
        note,
        selectedCategoryId
      );
      
      navigation.navigate(navigationRoutes.AppointmentSuccess, {
        type: 'reschedule',
        doctorName: currentAppointment.doctorName,
        date: selectedDate,
        time: selectedTime,
        specialty: currentAppointment.specialty,
        appointmentId: currentAppointment.id,
      });
    } catch (error: any) {
      console.error('Reschedule failed:', error);
      Alert.alert('Error', error.message || 'Failed to reschedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentAppointment && loading) {
    return <Loader visible={true} />;
  }

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
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
        {currentAppointment && (
          <CurrentAppointmentCard 
            doctorName={currentAppointment.doctorName}
            specialty={currentAppointment.specialty}
            date={currentAppointment.date}
            time={currentAppointment.time}
            appointmentId={currentAppointment.id}
          />
        )}

        {/* Reusing BookingSlotSelector from Booking Screen */}
        <BookingSlotSelector
          selectedDate={selectedDate}
          onDatePress={() => setOpenDatePicker(true)}
          selectedSlotId={selectedSlotId}
          onSlotSelect={handleSlotSelect}
          duration="30 min"
          slots={availableSlots}
        />

        <View style={styles.inputSection}>
          <Dropdown
            label="Reason for Rescheduling"
            placeholder="Select a reason"
            options={categories.map(c => ({ label: c.name, value: c._id }))}
            value={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            loading={loadingCategories}
            required
          />

          <RescheduleNoteInput 
            value={note}
            onChangeText={setNote}
          />
        </View>
      </ScrollView>

      <RescheduleActionFooter 
        onConfirm={handleConfirm}
        disabled={!selectedSlotId || !note.trim() || !selectedCategoryId}
      />

      <DatePicker
        modal
        open={openDatePicker}
        date={new Date(selectedDate)}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setOpenDatePicker(false);
          setSelectedDate(date.toISOString().split('T')[0]);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
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
  inputSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
});
