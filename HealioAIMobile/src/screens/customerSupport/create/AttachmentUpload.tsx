import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

export const AttachmentUpload: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Attachments (Optional)</Text>
      <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
        <View style={styles.iconCircle}>
          <Icon name="attach" size={24} color={colors.signInBackground} />
        </View>
        <Text style={styles.uploadText}>Upload screenshots or documents</Text>
        <Text style={styles.uploadSubtext}>PDF, JPG, PNG • Max 5MB</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A5FB4',
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
});
