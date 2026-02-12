import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Dropdown } from '../../../components';

interface SupportFormProps {
  onSubmit: (data: any) => void;
}

export const SupportForm: React.FC<SupportFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('Sandeep Kumar');
  const [email, setEmail] = useState('sandeep.k@example.com');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const subjects = [
    { label: 'Appointments', value: 'appointments' },
    { label: 'Payments', value: 'payments' },
    { label: 'Laboratory Services', value: 'lab' },
    { label: 'App Issues', value: 'app' },
    { label: 'Prescriptions', value: 'prescriptions' },
  ];

  const handleSubmit = () => {
    onSubmit({ fullName, email, subject, description });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, styles.emailInput]}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          editable={false}
        />
        <Text style={styles.helperText}>Replies will be sent to this email</Text>
      </View>

      <View style={styles.inputGroup}>
        <Dropdown
          label="Subject"
          placeholder="Select or enter subject"
          options={subjects}
          value={subject}
          onSelect={setSubject}
          containerStyle={styles.dropdownContainer}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Issue Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your issue in detail"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Padding removed to align with cardContainer
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  emailInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
    color: '#6B7280',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  dropdownContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 0,
    borderWidth: 0,
  },
});
