import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';

// Components
import { AppointmentDetailsCard } from './cancellation/AppointmentDetailsCard';
import { ReasonInputCard } from './cancellation/ReasonInputCard';
import { WarningCard } from './cancellation/WarningCard';
import { CancellationFooter } from './cancellation/CancellationFooter';

type CancelAppointmentRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.CancelAppointment>;
type CancelAppointmentNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CancelAppointmentScreen: React.FC = () => {
  const navigation = useNavigation<CancelAppointmentNavigationProp>();
  const route = useRoute<CancelAppointmentRouteProp>();
  const { appointmentId } = route.params;
  const [reason, setReason] = useState('');

  // Mock data - In a real app, you would fetch this using appointmentId
  const appointmentDetails = {
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Cardiologist',
    date: '24 Jan 2026',
    time: '10:30 AM',
    location: 'Apollo Hospitals, Jubilee Hills',
    id: appointmentId || '#APT-458920',
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirmCancellation = () => {
    // Here you would typically call an API to cancel the appointment
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Navigate back or to a success screen
            navigation.navigate(navigationRoutes.CancellationSuccess, {
              appointmentId: appointmentDetails.id,
              doctorName: appointmentDetails.doctorName,
              date: appointmentDetails.date,
              time: appointmentDetails.time,
            });
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>Cancel Appointment</Text>
          <View style={styles.placeholderButton} /> 
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppointmentDetailsCard 
          doctorName={appointmentDetails.doctorName}
          specialty={appointmentDetails.specialty}
          date={appointmentDetails.date}
          time={appointmentDetails.time}
          location={appointmentDetails.location}
          id={appointmentDetails.id}
        />

        <ReasonInputCard 
          reason={reason}
          onChangeText={setReason}
        />

        <WarningCard />
      </ScrollView>

      <CancellationFooter 
        onBack={handleBack}
        onConfirm={handleConfirmCancellation}
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
});
