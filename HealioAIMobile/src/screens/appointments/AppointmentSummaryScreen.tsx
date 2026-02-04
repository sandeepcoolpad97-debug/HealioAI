import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
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

type AppointmentSummaryRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.AppointmentSummary>;
type AppointmentSummaryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AppointmentSummaryScreen: React.FC = () => {
  const navigation = useNavigation<AppointmentSummaryNavigationProp>();
  const route = useRoute<AppointmentSummaryRouteProp>();
  const { appointmentId } = route.params || { appointmentId: 'unknown' };

  // Mock data matching the image
  const summaryData = {
    date: '12 Jan 2026',
    time: '11:00 AM',
    doctor: {
      name: 'Dr. Ananya Rao',
      specialty: 'Cardiologist',
      hospital: 'Apollo Hospitals',
      location: 'Jubilee Hills, Hyderabad',
      imageUrl: undefined, // Default placeholder
    },
    visit: {
      diagnosis: 'Mild Hypertension',
      notes: 'Patient shows mild elevation in blood pressure. Recommended lifestyle modifications including regular exercise and dietary changes. Monitor BP regularly and follow-up in 4 weeks.',
      medicines: [
        { name: 'Amlodipine', dosage: '5mg - Once daily' },
        { name: 'Metoprolol', dosage: '25mg - Twice daily' },
      ],
    },
  };

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
          date={summaryData.date}
          time={summaryData.time}
        />

        <SummaryDoctorCard 
          name={summaryData.doctor.name}
          specialty={summaryData.doctor.specialty}
          hospital={summaryData.doctor.hospital}
          location={summaryData.doctor.location}
          imageUrl={summaryData.doctor.imageUrl}
        />

        <VisitSummaryCard 
          diagnosis={summaryData.visit.diagnosis}
          notes={summaryData.visit.notes}
          medicines={summaryData.visit.medicines}
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
});
