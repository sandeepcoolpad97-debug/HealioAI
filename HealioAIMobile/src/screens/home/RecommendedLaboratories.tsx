import React from 'react';
import { HomeSection } from './HomeSection';
import { LabCard } from './LabCard';

export const RecommendedLaboratories: React.FC = () => {
  const labs = [
    {
      id: 1,
      name: 'PathLab Diagnostics',
      distance: '2.3 km away',
      rating: 4.7,
      hasHomeSample: true,
    },
    {
      id: 2,
      name: 'MediCore Lab Center',
      distance: '1.8 km away',
      rating: 4.9,
      hasHomeSample: true,
    },
    {
      id: 3,
      name: 'City Health Labs',
      distance: '4.5 km away',
      rating: 4.5,
      hasHomeSample: false,
    },
  ];

  const handleSeeAll = () => {
    console.log('See all labs');
    // TODO: Navigate to all labs list
  };

  const handleLabPress = (id: number) => {
    console.log(`Lab ${id} pressed`);
    // TODO: Navigate to lab details
  };

  return (
    <HomeSection title="Recommended Laboratories" onSeeAll={handleSeeAll}>
      {labs.map((lab) => (
        <LabCard
          key={lab.id}
          name={lab.name}
          distance={lab.distance}
          rating={lab.rating}
          hasHomeSample={lab.hasHomeSample}
          onPress={() => handleLabPress(lab.id)}
        />
      ))}
    </HomeSection>
  );
};
