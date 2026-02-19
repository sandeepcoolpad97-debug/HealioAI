import React, { useEffect, useState } from 'react';
import { HomeSection } from './HomeSection';
import { LabCard } from './LabCard';
import { labService, LabDto } from '../../services/lab.service';

export const RecommendedLaboratories: React.FC = () => {
  const [labs, setLabs] = useState<LabDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      const data = await labService.getLabs(1, 5);
      setLabs(data);
    } catch (error) {
      console.error('Failed to load labs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeAll = () => {
    console.log('See all labs');
    // TODO: Navigate to all labs list
  };

  const handleLabPress = (id: string) => {
    console.log(`Lab ${id} pressed`);
    // TODO: Navigate to lab details
  };

  if (loading) {
    return <HomeSection title="Recommended Laboratories" onSeeAll={handleSeeAll}><></></HomeSection>;
  }

  return (
    <HomeSection title="Recommended Laboratories" onSeeAll={handleSeeAll}>
      {labs.map((lab) => (
        <LabCard
          key={lab._id}
          name={lab.labName}
          distance={'2.0 km away'} // Mock distance
          rating={lab.rating || 4.5}
          hasHomeSample={lab.services?.homeSampleCollection}
          onPress={() => handleLabPress(lab._id)}
        />
      ))}
    </HomeSection>
  );
};
