import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../constants/colors';
import { navigationRoutes } from '../../constants/strings';
import { RootStackParamList } from '../../navigation/types';
import { AppointmentCard } from './listings/AppointmentCard';
import { AppointmentTabs } from './listings/AppointmentTabs';
import { appointmentService } from '../../services/appointment.service';
import { useAppSelector } from '../../store/hooks';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'past' | 'cancelled';
}

export const AppointmentsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(state => state.user);

  const fetchAppointments = useCallback(async () => {
    if (!user._id) return;
    
    try {
      setLoading(true);
      const rawAppointments = await appointmentService.getAppointments({
        userId: user._id,
        timeframe: activeTab, // Use the active tab to filter
        // If "upcoming", the backend might filter >= NOW
        // If "past", < NOW
      });

      // Map DTO to UI model
      const mapped: Appointment[] = rawAppointments.map(dto => {
        const dateObj = new Date(dto.currentStartAt);
        const dateStr = dateObj.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }); // e.g. "24 Jan 2026"
        
        const timeStr = dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }); // e.g. "10:30 AM"

        // Determine UI status
        // If bookingStatus is 'cancelled', show 'cancelled'
        // Else if activeTab is past, force 'past'? Or rely on timeframe?
        // Let's rely on bookingStatus unless we want to override for past tab visual
        let status: 'upcoming' | 'past' | 'cancelled' = 'upcoming';
        
        if (dto.bookingStatus === 'cancelled') {
           status = 'cancelled';
        } else if (activeTab === 'past') {
           status = 'past';
        } else {
           status = 'upcoming';
        }

        return {
          id: dto._id,
          doctorName: dto.doctorId?.doctorName || 'Unknown Doctor',
          specialty: dto.doctorId?.specialisation || 'Specialist',
          date: dateStr,
          time: timeStr,
          status: status
        };
      });

      setAppointments(mapped);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  }, [user._id, activeTab]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewMore = (id: string, status: 'upcoming' | 'past' | 'cancelled') => {
    if (status === 'past') {
      navigation.navigate(navigationRoutes.AppointmentSummary, { appointmentId: id });
    } else {
      navigation.navigate(navigationRoutes.AppointmentDetails, { appointmentId: id });
    }
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
          <Text style={styles.headerTitle}>My Appointments</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      {/* Tabs */}
      <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A5FB4" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard
              doctorName={item.doctorName}
              specialty={item.specialty}
              date={item.date}
              time={item.time}
              status={item.status}
              onPress={() => handleViewMore(item.id, item.status)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
               <Text style={styles.emptyText}>No {activeTab} appointments found.</Text>
            </View>
          }
        />
      )}
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
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  }
});
