import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface NotificationSectionHeaderProps {
  title: string;
}

export const NotificationSectionHeader: React.FC<NotificationSectionHeaderProps> = ({ title }) => {
  return <Text style={styles.sectionHeader}>{title}</Text>;
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: '#F9FAFB',
  },
});
