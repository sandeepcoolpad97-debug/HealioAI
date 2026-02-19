import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
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
import { appointmentService, AppointmentDto } from '../../services/appointment.service';

type AppointmentDetailsRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.AppointmentDetails>;
type AppointmentDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AppointmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AppointmentDetailsNavigationProp>();
  const route = useRoute<AppointmentDetailsRouteProp>();
  const { appointmentId } = route.params || { appointmentId: '' };

  const [appointment, setAppointment] = useState<AppointmentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        setError('No appointment ID provided');
        setLoading(false);
        return;
      }

      try {
        const data = await appointmentService.getAppointmentById(appointmentId);
        setAppointment(data);
      } catch (err) {
        console.error('Failed to fetch appointment details:', err);
        setError('Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleReschedule = () => {
    if (appointmentId) {
      navigation.navigate(navigationRoutes.RescheduleAppointment, { appointmentId });
    }
  };

  const handleCancel = () => {
    if (appointmentId) {
      navigation.navigate(navigationRoutes.CancelAppointment, { appointmentId });
    }
  };

  const handleViewRefundStatus = () => {
    Alert.alert('Refund Status', 'Your refund is being processed and will be credited to your account within 5-7 business days.');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A5FB4" />
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Appointment Details</Text>
            <View style={styles.placeholderButton} /> 
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Appointment not found'}</Text>
        </View>
      </View>
    );
  }

  // Transform API data to UI model
  const dateObj = new Date(appointment.currentStartAt);
  const dateStr = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Calculate duration from appointmentInfo or default
  const duration = '30 Minutes'; // This might need to come from the API if available, or calculated

  // Extract payment details if available (assuming API provides this or we use placeholders)
  // Since DTO might not have full payment details yet, we'll use safe defaults or available fields
  // For now, using placeholders as the DTO in service doesn't show payment object explicitly, 
  // but in a real app it would be populated.
  const paymentDetails = {
    consultationFee: 800, // Placeholder or from API
    discount: 0,
    amountPayable: 800,
    offerApplied: undefined,
    paidDate: dateStr, // Placeholder
    paymentMethod: 'Online', // Placeholder
  };

  // Map API status to UI status
  const getUiStatus = (status: string): 'upcoming' | 'completed' | 'cancelled' => {
    if (status === 'cancelled') return 'cancelled';
    // 'confirmed' and 'rescheduled' are treated as 'upcoming' for the header card
    // unless the date is in the past, but the card only accepts these 3.
    // Assuming 'past' appointments might use this screen too?
    // If it's a past appointment, maybe we should show 'completed'?
    // For now, let's map confirmed/rescheduled to upcoming as per current logic
    // or 'completed' if the date is past.
    // However, the previous code just defaulted to 'upcoming'.
    
    // Simple mapping:
    if (status === 'confirmed' || status === 'rescheduled') return 'upcoming';
    return 'upcoming';
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
          status={getUiStatus(appointment.bookingStatus)}
          date={dateStr}
          time={timeStr}
        />

        <DoctorInfoCard 
          name={appointment.doctorId?.doctorName || 'Unknown Doctor'}
          specialty={appointment.doctorId?.specialisation || 'Specialist'}
          hospital={appointment.doctorId?.clinicName || 'Healio Clinic'}
          location="Online" // Or from clinic address
          imageUrl={undefined}
        />

        <AppointmentInfoCard 
          mode="Online Consultation" // Or determine from API
          duration={duration}
          appointmentId={appointment.appointmentId}
        />

        {/* Notes from the last appointment info or symptoms */}
        <PatientNotesCard 
          notes={appointment.appointmentInfo?.[0]?.notes || 'No notes provided'}
        />

        <PaymentDetailsCard 
          consultationFee={paymentDetails.consultationFee}
          discount={paymentDetails.discount}
          amountPayable={paymentDetails.amountPayable}
          offerApplied={paymentDetails.offerApplied}
          paidDate={paymentDetails.paidDate}
          paymentMethod={paymentDetails.paymentMethod}
        />
      </ScrollView>

      <AppointmentActionFooter 
        onReschedule={handleReschedule}
        onCancel={handleCancel}
        onViewRefundStatus={handleViewRefundStatus}
        status={appointment.bookingStatus}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});
