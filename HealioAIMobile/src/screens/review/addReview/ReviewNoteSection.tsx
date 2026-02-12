import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

type ReviewNoteSectionProps = {
  value: string;
  onChange: (text: string) => void;
};

export const ReviewNoteSection: React.FC<ReviewNoteSectionProps> = ({
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share your experience (optional)</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Tell us about the doctor's professionalism, clarity, and care"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  inputWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    minHeight: 110,
  },
  input: {
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
});
