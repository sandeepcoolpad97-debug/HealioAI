import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DoctorAboutSectionProps {
  name: string;
  specialty: string;
  experienceYears: number;
}

export const DoctorAboutSection: React.FC<DoctorAboutSectionProps> = ({
  name,
  specialty,
  experienceYears,
}) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.aboutText}>
        {name} is a renowned {specialty.toLowerCase()} with over {experienceYears} years of experience in treating complex conditions. She specializes in interventional cardiology and has successfully performed over 500 cardiac procedures.
      </Text>
      <TouchableOpacity>
        <Text style={styles.readMore}>Read more</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A5FB4',
  },
});
