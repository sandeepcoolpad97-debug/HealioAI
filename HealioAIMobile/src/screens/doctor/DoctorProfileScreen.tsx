import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/types';

// Components
import { DoctorProfileHeader } from './profile/DoctorProfileHeader';
import { DoctorStatsCard } from './profile/DoctorStatsCard';
import { DoctorAboutSection } from './profile/DoctorAboutSection';
import { DoctorContactInfo } from './profile/DoctorContactInfo';
import { DoctorNextSlotCard } from './profile/DoctorNextSlotCard';

type DoctorProfileRouteProp = RouteProp<RootStackParamList, 'DoctorProfile'>;
type DoctorProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DoctorProfileScreen: React.FC = () => {
  const navigation = useNavigation<DoctorProfileNavigationProp>();
  const route = useRoute<DoctorProfileRouteProp>();
  const { name, specialty, rating } = route.params || {
    name: 'Dr. Ananya Rao',
    specialty: 'Cardiologist',
    rating: 4.8,
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    console.log('Share profile');
  };

  const handleBookAppointment = () => {
    navigation.navigate('BookAppointment');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A5FB4" />
      
      {/* Fixed Header / Navbar */}
      <View style={styles.stickyHeader}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Doctor Profile</Text>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Icon name="share-social" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Profile Info Section (Scrollable) */}
        <DoctorProfileHeader 
          name={name}
          specialty={specialty}
        />

        <View style={styles.contentContainer}>
          {/* Stats Card */}
          <DoctorStatsCard 
            rating={rating}
            reviewCount={320}
            experienceYears={12}
          />

          {/* About Section */}
          <DoctorAboutSection 
            name={name}
            specialty={specialty}
            experienceYears={12}
          />

          {/* Contact/Location Section */}
          <DoctorContactInfo 
            phone="+91 98765 43210"
            clinicName="Apollo Clinic, Jayanagar"
            location="Bengaluru, Karnataka"
          />

          {/* Next Available Slot */}
          <DoctorNextSlotCard 
            nextSlotTime="Tomorrow, 10:30 AM – 11:00 AM"
          />
          
          {/* Bottom Padding for scroll */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  stickyHeader: {
    backgroundColor: '#0A5FB4', // Blue header
    zIndex: 10
  },
  safeArea: {
    backgroundColor: '#0A5FB4',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 20, // Add spacing since we removed it from individual components/header overlap
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  bookButton: {
    backgroundColor: '#4CAF50', // Green button
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
