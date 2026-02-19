import React, { useState, useEffect } from 'react';
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

// Services
import { appointmentService } from '../../services/appointment.service';
import { categoryService, CategoryDto } from '../../services/category.service';

// Components
import { AppointmentDetailsCard } from './cancellation/AppointmentDetailsCard';
import { ReasonInputCard } from './cancellation/ReasonInputCard';
import { WarningCard } from './cancellation/WarningCard';
import { CancellationFooter } from './cancellation/CancellationFooter';
import { Loader, Dropdown } from '../../components';

type CancelAppointmentRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.CancelAppointment>;
type CancelAppointmentNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CancelAppointmentScreen: React.FC = () => {
  const navigation = useNavigation<CancelAppointmentNavigationProp>();
  const route = useRoute<CancelAppointmentRouteProp>();
  const { appointmentId } = route.params;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoryService.getCategories(true, 'cancellation');
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
    const fetchAppointment = async () => {
      if (!appointmentId) return;
      try {
        setLoading(true);
        const data = await appointmentService.getAppointmentById(appointmentId);
        
        // Map API data to UI model
        setAppointmentDetails({
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
          location: data.doctorId?.clinicName || 'Healio Clinic',
          id: data._id
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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirmCancellation = () => {
    if (!selectedCategoryId) {
      Alert.alert('Validation Error', 'Please select a reason for cancellation.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Validation Error', 'Please provide additional notes for cancellation.');
      return;
    }

    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await appointmentService.cancelAppointment(appointmentId, reason, selectedCategoryId);
              
              navigation.navigate(navigationRoutes.CancellationSuccess, {
                appointmentId: appointmentDetails?.id,
                doctorName: appointmentDetails?.doctorName,
                date: appointmentDetails?.date,
                time: appointmentDetails?.time,
              });
            } catch (error: any) {
              console.error('Cancellation failed:', error);
              Alert.alert('Error', error.message || 'Failed to cancel appointment. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading && !appointmentDetails) {
    return <Loader visible={true} />;
  }

  return (
    <View style={styles.container}>
      <Loader visible={loading && !!appointmentDetails} />
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
        {appointmentDetails && (
          <AppointmentDetailsCard 
            doctorName={appointmentDetails.doctorName}
            specialty={appointmentDetails.specialty}
            date={appointmentDetails.date}
            time={appointmentDetails.time}
            location={appointmentDetails.location}
            id={appointmentDetails.id}
          />
        )}

        <View style={styles.inputSection}>
          <Dropdown
            label="Reason for Cancellation"
            placeholder="Select a reason"
            options={categories.map(c => ({ label: c.name, value: c._id }))}
            value={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            loading={loadingCategories}
            required
          />

          <ReasonInputCard 
            reason={reason}
            onChangeText={setReason}
          />
        </View>

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
  inputSection: {
    marginTop: 16,
  },
});
