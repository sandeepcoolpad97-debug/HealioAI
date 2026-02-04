import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../constants/colors';
import { navigationRoutes } from '../../constants/strings';

type BookAppointmentNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookAppointment'>;

// Components
import { BookingDoctorCard } from './booking/BookingDoctorCard';
import { BookingSlotSelector } from './booking/BookingSlotSelector';
import { BookingPatientNotes } from './booking/BookingPatientNotes';
import { BookingCouponSection } from './booking/BookingCouponSection';
import { BookingPaymentSummary } from './booking/BookingPaymentSummary';

export const BookAppointmentScreen = () => {
  const navigation = useNavigation<BookAppointmentNavigationProp>();
  
  // State
  const [selectedDate, setSelectedDate] = useState('24 Jan 2026');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('9:30 AM');
  const [notes, setNotes] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  
  // Values
  const consultationFee = 800;
  const discount = appliedCoupon ? 200 : 0;
  const totalPayable = consultationFee - discount;

  const doctorDetails = {
    name: "Dr. Ananya Rao",
    specialty: "Cardiologist",
    hospital: "Apollo Hospitals",
    location: "Jubilee Hills, Hyderabad"
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleApplyCoupon = (code: string) => {
    // Mock coupon logic
    if (code === 'NEWYEAR200' || code.length > 0) {
      setAppliedCoupon(code);
    }
  };

  const handleProceedToPay = () => {
    // Implement payment flow
    console.log('Proceed to pay', totalPayable);
    
    navigation.navigate(navigationRoutes.AppointmentSuccess, {
      type: 'booking',
      doctorName: doctorDetails.name,
      date: selectedDate,
      time: selectedTimeSlot,
      specialty: doctorDetails.specialty,
      appointmentId: '#APT-882910' // Mock ID
    });
  };

  return (
    <View style={styles.container}>
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
          name={doctorDetails.name}
          specialty={doctorDetails.specialty}
          hospital={doctorDetails.hospital}
          location={doctorDetails.location}
          consultationType="In-Clinic Consultation"
        />

        {/* Slot Selection */}
        <BookingSlotSelector
          selectedDate={selectedDate}
          onDatePress={() => {}}
          selectedTimeSlot={selectedTimeSlot}
          onTimeSlotSelect={setSelectedTimeSlot}
          duration="30 Minutes"
        />

        {/* Patient Notes */}
        <BookingPatientNotes
          notes={notes}
          onChangeNotes={setNotes}
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
