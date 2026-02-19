import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Medicine {
  name: string;
  dosage: string;
}

interface VisitSummaryCardProps {
  diagnosis: string;
  notes: string;
  medicines: Medicine[];
}

export const VisitSummaryCard: React.FC<VisitSummaryCardProps> = ({
  diagnosis,
  notes,
  medicines,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visit Summary</Text>

      {/* Diagnosis */}
      <Text style={styles.sectionLabel}>Diagnosis</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{diagnosis}</Text>
      </View>

      {/* Doctor Notes */}
      <Text style={styles.sectionLabel}>Doctor Notes</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{notes}</Text>
      </View>

      {/* Prescribed Medicines */}
      <Text style={styles.sectionLabel}>Prescribed Medicines</Text>
      <View style={styles.medicinesContainer}>
        {medicines.map((med, index) => (
          <View key={index} style={styles.medicineRow}>
            <Text style={styles.medicineName}>{med.name}</Text>
            <Text style={styles.medicineDosage}>{med.dosage}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  medicinesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  medicineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  medicineDosage: {
    fontSize: 14,
    color: '#6B7280',
  },
});
