import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import { AppointmentCard } from './listings/AppointmentCard';
import { AppointmentTabs } from './listings/AppointmentTabs';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'past' | 'cancelled';
}

// Mock Data matching the design
const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Cardiologist',
    date: '24 Jan 2026',
    time: '10:30 AM',
    status: 'upcoming',
  },
  {
    id: '2',
    doctorName: 'Dr. Rajesh Kumar',
    specialty: 'Orthopedic Surgeon',
    date: '26 Jan 2026',
    time: '2:15 PM',
    status: 'upcoming',
  },
  {
    id: '3',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Dermatologist',
    date: '28 Jan 2026',
    time: '11:45 AM',
    status: 'upcoming',
  },
  {
    id: '4',
    doctorName: 'Dr. Vikram Singh',
    specialty: 'Neurologist',
    date: '30 Jan 2026',
    time: '4:00 PM',
    status: 'upcoming',
  },
];

const PAST_APPOINTMENTS: Appointment[] = [
  {
    id: '5',
    doctorName: 'Dr. Sarah Smith',
    specialty: 'Dentist',
    date: '10 Dec 2025',
    time: '9:00 AM',
    status: 'past',
  },
  {
    id: '6',
    doctorName: 'Dr. John Doe',
    specialty: 'General Physician',
    date: '15 Nov 2025',
    time: '5:30 PM',
    status: 'past',
  },
];

export const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewMore = (id: string) => {
    console.log('View more for appointment:', id);
    // Navigate to appointment details
  };

  const data = activeTab === 'upcoming' ? UPCOMING_APPOINTMENTS : PAST_APPOINTMENTS;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A5FB4" />
      
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      {/* Tabs */}
      <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard
            doctorName={item.doctorName}
            specialty={item.specialty}
            date={item.date}
            time={item.time}
            status={item.status}
            onPress={() => handleViewMore(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40, // To balance the back button
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
});
