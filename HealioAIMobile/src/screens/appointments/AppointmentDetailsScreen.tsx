import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';

// Components
import { AppointmentHeaderCard } from './details/AppointmentHeaderCard';
import { DoctorInfoCard } from './details/DoctorInfoCard';
import { AppointmentInfoCard } from './details/AppointmentInfoCard';
import { PatientNotesCard } from './details/PatientNotesCard';
import { PaymentDetailsCard } from './details/PaymentDetailsCard';
import { AppointmentActionFooter } from './details/AppointmentActionFooter';

type AppointmentDetailsRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.AppointmentDetails>;
type AppointmentDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AppointmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AppointmentDetailsNavigationProp>();
  const route = useRoute<AppointmentDetailsRouteProp>();
  const { appointmentId } = route.params || { appointmentId: '#APT-458920' };

  // Mock data based on the image
  const appointmentData = {
    status: 'upcoming' as const,
    date: '24 Jan 2026',
    time: '10:30 AM',
    doctor: {
      name: 'Dr. Ananya Rao',
      specialty: 'Cardiologist',
      hospital: 'Apollo Hospitals',
      location: 'Jubilee Hills, Hyderabad',
      imageUrl: undefined, // Will use default icon
    },
    details: {
      mode: 'In-Clinic Consultation',
      duration: '30 Minutes',
      id: appointmentId,
    },
    notes: 'Chest discomfort and shortness of breath',
    payment: {
      consultationFee: 800,
      discount: 200,
      amountPayable: 600,
      offerApplied: 'New Year Offer – ₹200 off',
      paidDate: '22 Jan 2026',
      paymentMethod: 'UPI',
    },
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleReschedule = () => {
    navigation.navigate(navigationRoutes.RescheduleAppointment, { appointmentId });
  };

  const handleCancel = () => {
    console.log('Cancel appointment', appointmentId);
    // Show confirmation dialog
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
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <View style={styles.placeholderButton} /> 
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppointmentHeaderCard 
          status={appointmentData.status}
          date={appointmentData.date}
          time={appointmentData.time}
        />

        <DoctorInfoCard 
          name={appointmentData.doctor.name}
          specialty={appointmentData.doctor.specialty}
          hospital={appointmentData.doctor.hospital}
          location={appointmentData.doctor.location}
          imageUrl={appointmentData.doctor.imageUrl}
        />

        <AppointmentInfoCard 
          mode={appointmentData.details.mode}
          duration={appointmentData.details.duration}
          appointmentId={appointmentData.details.id}
        />

        <PatientNotesCard 
          notes={appointmentData.notes}
        />

        <PaymentDetailsCard 
          consultationFee={appointmentData.payment.consultationFee}
          discount={appointmentData.payment.discount}
          amountPayable={appointmentData.payment.amountPayable}
          offerApplied={appointmentData.payment.offerApplied}
          paidDate={appointmentData.payment.paidDate}
          paymentMethod={appointmentData.payment.paymentMethod}
        />
      </ScrollView>

      <AppointmentActionFooter 
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background
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
});
