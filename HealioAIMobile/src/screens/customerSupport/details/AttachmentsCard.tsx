import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface Attachment {
  name: string;
  size: string;
  type: 'image' | 'pdf';
}

interface AttachmentsCardProps {
  attachments: Attachment[];
}

export const AttachmentsCard: React.FC<AttachmentsCardProps> = ({ attachments }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Attachments</Text>
      {attachments.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.attachmentItem}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Icon 
              name={item.type === 'image' ? 'image' : 'document-text'} 
              size={20} 
              color={colors.signInBackground} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.size}>{item.size}</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
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
    marginBottom: 16,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  size: {
    fontSize: 12,
    color: '#6B7280',
  },
});
