import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeSection } from './HomeSection';
import { DoctorCard } from '../doctor/DoctorCard';
import { navigationRoutes } from '../../constants/strings';

export const RecommendedDoctors: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const doctors = [
    {
      id: 1,
      name: 'Dr. James Wilson',
      specialty: 'Cardiologist',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Dr. Sarah Chen',
      specialty: 'Neurologist',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      specialty: 'Orthopedic',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Dr. Emily Davis',
      specialty: 'Pediatrician',
      rating: 4.9,
    },
  ];

  const handleSeeAll = () => {
    console.log('See all doctors');
    // TODO: Navigate to all doctors list
  };

  const handleDoctorPress = (doctor: typeof doctors[0]) => {
    navigation.navigate(navigationRoutes.DoctorProfile, {
      doctorId: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      rating: doctor.rating,
    });
  };

  return (
    <HomeSection title="Recommended Doctors" onSeeAll={handleSeeAll}>
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          name={doctor.name}
          specialty={doctor.specialty}
          rating={doctor.rating}
          onPress={() => handleDoctorPress(doctor)}
        />
      ))}
    </HomeSection>
  );
};
