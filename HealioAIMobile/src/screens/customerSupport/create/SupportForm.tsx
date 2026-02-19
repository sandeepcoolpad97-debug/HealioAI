import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';

import { Dropdown } from '../../../components';
import { useAppSelector } from '../../../store/hooks';

export type SupportFormValues = {
  subject: string;
  category: string;
  subCategory: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
};

interface SupportFormProps {
  onChange?: (data: SupportFormValues) => void;
}

export const SupportForm: React.FC<SupportFormProps> = ({ onChange }) => {
  const user = useAppSelector((state) => state.user);
  const fullName = user.name ?? '';
  const email = user.email ?? '';
  const phone = user.phone ?? '';

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [description, setDescription] = useState('');

  const categoryOptions = [
    { label: 'Appointments', value: 'appointments' },
    { label: 'Payments', value: 'payments' },
    { label: 'Laboratory Services', value: 'lab' },
    { label: 'App Issues', value: 'app' },
    { label: 'Prescriptions', value: 'prescriptions' },
  ];

  const subCategoryOptions = [
    { label: 'Booking Issues', value: 'booking_issues' },
    { label: 'Refunds and Billing', value: 'refunds_billing' },
    { label: 'Reports and Results', value: 'reports_results' },
    { label: 'Technical Issues', value: 'technical_issues' },
    { label: 'Other', value: 'other' },
  ];

  const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  const notifyChange = (next: Partial<SupportFormValues>) => {
    const values: SupportFormValues = {
      subject: next.subject ?? subject,
      category: next.category ?? category,
      subCategory: next.subCategory ?? subCategory,
      priority: next.priority ?? priority,
      description: next.description ?? description,
    };
    onChange?.(values);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={fullName}
          editable={false}
          placeholder="Your full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={email}
          placeholder="Your email address"
          keyboardType="email-address"
          editable={false}
        />
        <Text style={styles.helperText}>Replies will be sent to this email</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={phone}
          placeholder="Your phone number"
          keyboardType="phone-pad"
          editable={false}
        />
        <Text style={styles.helperText}>We may contact you on this number</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={(value) => {
            setSubject(value);
            notifyChange({ subject: value });
          }}
          placeholder="Enter a short subject for your issue"
          returnKeyType="next"
        />
      </View>

      <View style={styles.inputGroup}>
        <Dropdown
          label="Category"
          placeholder="Select category"
          options={categoryOptions}
          value={category}
          onSelect={(value) => {
            setCategory(value);
            notifyChange({ category: value });
          }}
          containerStyle={styles.dropdownContainer}
        />
      </View>

      <View style={styles.inputGroup}>
        <Dropdown
          label="Sub Category"
          placeholder="Select sub category"
          options={subCategoryOptions}
          value={subCategory}
          onSelect={(value) => {
            setSubCategory(value);
            notifyChange({ subCategory: value });
          }}
          containerStyle={styles.dropdownContainer}
        />
      </View>

      <View style={styles.inputGroup}>
        <Dropdown
          label="Priority"
          placeholder="Select priority"
          options={priorityOptions}
          value={priority}
          onSelect={(value) => {
            const next = value as 'low' | 'medium' | 'high' | 'urgent';
            setPriority(next);
            notifyChange({ priority: next });
          }}
          containerStyle={styles.dropdownContainer}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Issue Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={(value) => {
            setDescription(value);
            notifyChange({ description: value });
          }}
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
  readOnlyInput: {
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
