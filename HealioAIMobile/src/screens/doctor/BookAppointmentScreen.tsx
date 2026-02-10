import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';
import { useAppSelector } from '../../store/hooks';
import DatePicker from 'react-native-date-picker';

// Services
import { slotService, SlotDto } from '../../services/slot.service';
import { appointmentService } from '../../services/appointment.service';
import { paymentService } from '../../services/payment.service';

type BookAppointmentNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookAppointment'>;
type BookAppointmentRouteProp = RouteProp<RootStackParamList, 'BookAppointment'>;

// Components
import { BookingDoctorCard } from './booking/BookingDoctorCard';
import { BookingSlotSelector } from './booking/BookingSlotSelector';
import { BookingPatientNotes } from './booking/BookingPatientNotes';
import { BookingCouponSection } from './booking/BookingCouponSection';
import { BookingPaymentSummary } from './booking/BookingPaymentSummary';
import { Loader } from '../../components';

export const BookAppointmentScreen = () => {
  const navigation = useNavigation<BookAppointmentNavigationProp>();
  const route = useRoute<BookAppointmentRouteProp>();
  const user = useAppSelector(state => state.user);
  
  // Params
  const { doctorId, doctorName, specialty, hospital, location } = route.params || {
    doctorId: 'mock-id',
    doctorName: "Dr. Ananya Rao",
    specialty: "Cardiologist",
    hospital: "Apollo Hospitals",
    location: "Jubilee Hills, Hyderabad"
  };

  // State
  // Default to today/tomorrow in YYYY-MM-DD for API, but UI might want friendly format
  // For simplicity, let's assume we pick a date that has slots or current date
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 
  const [open, setOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<SlotDto[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ notes?: string }>({});
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [loading, setLoading] = useState(false);
  const lockedSlotIdRef = useRef<string | null>(null);
  
  // Values
  const consultationFee = 800;
  const discount = appliedCoupon ? 200 : 0;
  const totalPayable = consultationFee - discount;

  useEffect(() => {
    // Unlock previously locked slot if exists when date changes
    const cleanup = async () => {
      if (lockedSlotIdRef.current) {
        try {
          await slotService.unlockSlot(lockedSlotIdRef.current);
          lockedSlotIdRef.current = null;
        } catch (e) {
          console.error("Error unlocking slot on date change", e);
        }
      }
    };
    cleanup();

    // Reset selection if date changes
    setSelectedTimeSlot('');
    setSelectedSlotId(null);
    fetchSlots();
  }, [selectedDate, doctorId]);

  const fetchSlots = async () => {
    if (!doctorId) return;
    try {
      setLoading(true);
      // Backend expects YYYY-MM-DD
      // Fetch all slots (no status filter) to show booked/locked ones
      let slots = await slotService.getSlots(doctorId, selectedDate);
      
      // If no slots and date is today or future, generate them
      const today = new Date().toISOString().split('T')[0];
      if (slots.length === 0 && selectedDate >= today) {
         try {
           console.log('Generating slots for', selectedDate);
           await slotService.generateSlots({
             doctorId,
             date: selectedDate,
             startTime: "09:00",
             endTime: "17:00",
             durationMinutes: 30
           });
           // Fetch again after generation
           slots = await slotService.getSlots(doctorId, selectedDate);
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

  const handleBack = async () => {
    if (lockedSlotIdRef.current) {
      try {
        setLoading(true);
        await slotService.unlockSlot(lockedSlotIdRef.current);
        lockedSlotIdRef.current = null;
      } catch (e) {
        console.error("Error unlocking on back", e);
      } finally {
        setLoading(false);
      }
    }
    navigation.goBack();
  };

  const handleApplyCoupon = (code: string) => {
    // Mock coupon logic
    if (code === 'NEWYEAR200' || code.length > 0) {
      setAppliedCoupon(code);
    }
  };

  const handleSlotSelect = async (slot: SlotDto) => {
    if (slot.status !== 'available') {
      return;
    }

    // Prevent re-locking the same slot
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
      
      // Format time for display/nav
      const date = new Date(slot.slotStartAt);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
      setSelectedTimeSlot(formattedTime);
      
      // Refresh slots to reflect locked status immediately
      fetchSlots();
    } catch (error) {
      Alert.alert('Error', 'Could not lock this slot. It might be already taken.');
      if (lockedSlotIdRef.current === slot._id) {
         lockedSlotIdRef.current = null;
         setSelectedSlotId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPay = async () => {
    let isValid = true;
    const newErrors: { notes?: string } = {};

    if (!selectedSlotId) {
      Alert.alert('Selection Required', 'Please select a time slot.');
      return;
    }

    if (!notes.trim()) {
      newErrors.notes = 'Patient notes are required';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      
      if (!user.isAuthenticated || !user._id) {
        Alert.alert('Error', 'You must be logged in to book.');
        return;
      }

      const slot = availableSlots.find(s => s._id === selectedSlotId);
      if (!slot) return;

      // 1. Create Payment
      // Using doctorId as serviceId and slotId as refId
      const payment = await paymentService.createPayment({
        userId: user._id,
        paymentFor: {
          serviceId: doctorId,
          refId: selectedSlotId,
        },
        provider: 'cash', // Simulating payment
        paidVia: 'card',
        paymentSummary: {
          serviceFee: consultationFee,
          discount: discount,
          sgst: 0,
          cgst: 0,
          totalPayable: totalPayable,
        },
        paymentStatus: 'paid', // Simulate success
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        paidAt: new Date().toISOString(),
      });

      // 2. Create Appointment with real paymentId
      await appointmentService.createAppointment({
        doctorId,
        userId: user._id, 
        paymentId: payment._id,
        currentStartAt: slot.slotStartAt,
        consultationType: 'in_person',
        consultationDuration: 30,
        appointmentInfo: [{
          startAt: slot.slotStartAt,
          action: 'booked',
          notes: notes,
          symptoms: []
        }]
      });
      
      navigation.navigate(navigationRoutes.AppointmentSuccess, {
        type: 'booking',
        doctorName: doctorName || 'Doctor',
        date: selectedDate,
        time: selectedTimeSlot,
        specialty: specialty || 'Specialist',
        appointmentId: '#APT-' + Math.floor(Math.random() * 10000)
      });
    } catch (error) {
      console.error('Booking failed:', error);
      Alert.alert('Booking Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <StatusBar barStyle="light-content" backgroundColor="#0A5FB4" />
      
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Consultation</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Doctor Info */}
        <BookingDoctorCard
          name={doctorName || 'Doctor'}
          specialty={specialty || 'Specialist'}
          hospital={hospital || 'Clinic'}
          location={location || ''}
          consultationType="In-Clinic Consultation"
        />

        {/* Slot Selection */}
        <BookingSlotSelector
          selectedDate={selectedDate}
          onDatePress={() => setOpen(true)}
          selectedSlotId={selectedSlotId}
          onSlotSelect={handleSlotSelect}
          duration="30 min"
          slots={availableSlots}
        />

        {/* Patient Notes */}
        <BookingPatientNotes
          notes={notes}
          onChangeNotes={(text) => {
             setNotes(text);
             if (text.trim()) setErrors((prev) => ({ ...prev, notes: undefined }));
          }}
          error={errors.notes}
        />

        {/* Offers */}
        <BookingCouponSection
          onApplyCoupon={handleApplyCoupon}
          appliedCoupon={appliedCoupon}
          discountAmount={200}
        />

        {/* Payment Summary */}
        <BookingPaymentSummary
          consultationFee={consultationFee}
          discount={discount}
          totalPayable={totalPayable}
        />
      </ScrollView>

      {/* Footer Button */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handleProceedToPay}>
          <Icon name="lock-closed" size={20} color="#FFFFFF" style={styles.lockIcon} />
          <Text style={styles.payButtonText}>Proceed to Pay ₹{totalPayable}</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          Appointment will be confirmed after successful payment
        </Text>
      </SafeAreaView>

      <DatePicker
        modal
        open={open}
        date={new Date(selectedDate)}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setOpen(false);
          setSelectedDate(date.toISOString().split('T')[0]);
        }}
        onCancel={() => {
          setOpen(false);
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    backgroundColor: '#0A5FB4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  lockIcon: {
    marginRight: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
