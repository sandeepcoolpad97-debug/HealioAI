import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeSection } from './HomeSection';
import { DoctorCard } from '../doctor/DoctorCard';
import { navigationRoutes } from '../../constants/strings';
import { clinicService, ClinicDto } from '../../services/clinic.service';

export const RecommendedDoctors: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [doctors, setDoctors] = useState<ClinicDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await clinicService.getClinics(1, 5);
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeAll = () => {
    console.log('See all doctors');
    // TODO: Navigate to all doctors list
  };

  const handleDoctorPress = (doctor: ClinicDto) => {
    navigation.navigate(navigationRoutes.DoctorProfile, {
      doctorId: doctor._id,
      name: doctor.doctorName,
      specialty: doctor.specialisation?.[0] || 'General Physician',
      rating: doctor.rating || 0,
    });
  };

  if (loading) {
    // Ideally render skeletons here
    return <HomeSection title="Recommended Doctors" onSeeAll={handleSeeAll}><></></HomeSection>;
  }

  return (
    <HomeSection title="Recommended Doctors" onSeeAll={handleSeeAll}>
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor._id}
          name={doctor.doctorName}
          specialty={doctor.specialisation?.[0] || 'General Physician'}
          rating={doctor.rating || 4.5} // Fallback rating
          onPress={() => handleDoctorPress(doctor)}
        />
      ))}
    </HomeSection>
  );
};
