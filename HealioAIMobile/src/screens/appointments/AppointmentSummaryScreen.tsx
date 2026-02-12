import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';

// Components
import { SummaryHeaderCard } from './summary/SummaryHeaderCard';
import { SummaryDoctorCard } from './summary/SummaryDoctorCard';
import { VisitSummaryCard } from './summary/VisitSummaryCard';
import { ReportsCard } from './summary/ReportsCard';
import { SummaryActionFooter } from './summary/SummaryActionFooter';
import { appointmentService, AppointmentDto } from '../../services/appointment.service';

type AppointmentSummaryRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.AppointmentSummary>;
type AppointmentSummaryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AppointmentSummaryScreen: React.FC = () => {
  const navigation = useNavigation<AppointmentSummaryNavigationProp>();
  const route = useRoute<AppointmentSummaryRouteProp>();
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
        console.error('Failed to fetch appointment summary:', err);
        setError('Failed to load appointment summary');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBookFollowUp = () => {
    console.log('Book follow up for', appointmentId);
    // navigation.navigate('BookAppointment', { ... });
  };

  const handleDownloadSummary = () => {
    console.log('Download summary for', appointmentId);
  };

  const handleDownloadPrescription = () => {
    console.log('Download prescription for', appointmentId);
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
            <Text style={styles.headerTitle}>Appointment Summary</Text>
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

  const handleAddReview = () => {
    navigation.navigate(navigationRoutes.ReviewDoctor, {
      doctorId: appointment.doctorId?._id || '',
      doctorName: appointment.doctorId?.doctorName || 'Unknown Doctor',
      specialty: appointment.doctorId?.specialisation || 'Specialist',
      date: dateStr,
      time: timeStr,
      appointmentId: appointment._id,
    });
  };

  // Extract diagnosis and medicines from notes or structured data if available
  // Currently assuming basic structure, in future API might have specific diagnosis field
  const diagnosis = 'No Daignosis yet'; // Placeholder or extract from notes
  const notes = 'No notes provided';
  const medicines: Array<{ name: string; dosage: string }> = [ { name: 'Medication 1', dosage: '500mg' }, { name: 'Medication 2', dosage: '200mg' }]; // Placeholder

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A5FB4" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Summary</Text>
          <View style={styles.placeholderButton} /> 
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SummaryHeaderCard 
          date={dateStr}
          time={timeStr}
        />

        <SummaryDoctorCard 
          name={appointment.doctorId?.doctorName || 'Unknown Doctor'}
          specialty={appointment.doctorId?.specialisation || 'Specialist'}
          hospital={appointment.doctorId?.clinicName || 'Healio Clinic'}
          location="Online" // Or from clinic address
          imageUrl={undefined}
          onAddReview={handleAddReview}
          isReviewAdded={appointment.isReviewAdded}
        />

        <VisitSummaryCard 
          diagnosis={diagnosis}
          notes={notes}
          medicines={medicines}
        />

        <ReportsCard 
          onDownload={handleDownloadPrescription}
        />
      </ScrollView>

      <SummaryActionFooter 
        onBookFollowUp={handleBookFollowUp}
        onDownloadSummary={handleDownloadSummary}
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
    color: '#EF4444', // Red color for error
    textAlign: 'center',
  },
});
