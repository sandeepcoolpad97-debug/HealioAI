import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface DescriptionCardProps {
  description: string;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({ description }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Description</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
});
