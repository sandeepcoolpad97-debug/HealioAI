import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface ReportsCardProps {
  onDownload: () => void;
}

export const ReportsCard: React.FC<ReportsCardProps> = ({ onDownload }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports & Documents</Text>

      <View style={styles.fileCard}>
        <View style={styles.iconContainer}>
          <Icon name="document-text" size={24} color="#FFFFFF" />
        </View>
        
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>Prescription</Text>
          <Text style={styles.fileDetails}>PDF • 245 KB</Text>
        </View>

        <TouchableOpacity onPress={onDownload} style={styles.downloadButton}>
          <Icon name="download-outline" size={24} color={colors.primaryBlue} />
        </TouchableOpacity>
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
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#0A5FB4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  fileDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  downloadButton: {
    padding: 8,
  },
});
