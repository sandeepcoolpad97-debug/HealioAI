import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';
import { mediaService } from '../../../services';

type AttachmentType = 'image' | 'pdf';

export type SelectedAttachment = {
  id: string;
  name: string;
  sizeLabel: string;
  type: AttachmentType;
};

interface AttachmentUploadProps {
  onChange?: (attachments: SelectedAttachment[]) => void;
}

export const AttachmentUpload: React.FC<AttachmentUploadProps> = ({ onChange }) => {
  const [attachments, setAttachments] = useState<SelectedAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePress = async () => {
    let DocumentPickerModule: any;

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      DocumentPickerModule = require('react-native-document-picker');
    } catch (_err) {
      setError('File picker is not available on this build.');
      return;
    }

    try {
      setError(null);
      setUploading(true);

      const result = await DocumentPickerModule.pick({
        type: [DocumentPickerModule.types.images, DocumentPickerModule.types.pdf],
        allowMultiSelection: true,
      });

      const picks = Array.isArray(result) ? result : [result];

      const uploaded: SelectedAttachment[] = [...attachments];

      for (const file of picks) {
        const uri = file.uri;
        const name = file.name || 'attachment';
        const type = file.type || 'application/octet-stream';

        const uploadResult = await mediaService.uploadMedia({
          uri,
          name,
          type,
          ownerType: 'SupportTicket',
        });

        const bytes = uploadResult.data.bytes || 0;
        const sizeLabel = bytes ? `${Math.round(bytes / 1024)} KB` : '';
        const isPdf =
          type.toLowerCase().includes('pdf') ||
          uploadResult.data.format?.toLowerCase() === 'pdf' ||
          uploadResult.data.resourceType?.toLowerCase() === 'raw';

        uploaded.push({
          id: uploadResult.data._id,
          name: uploadResult.data.originalFilename || name,
          sizeLabel,
          type: isPdf ? 'pdf' : 'image',
        });
      }

      setAttachments(uploaded);
      onChange?.(uploaded);
    } catch (e) {
      if (!DocumentPickerModule.isCancel || !DocumentPickerModule.isCancel(e)) {
        const message = e instanceof Error ? e.message : 'Failed to upload attachments';
        setError(message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Attachments (Optional)</Text>
      <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7} onPress={handlePress}>
        <View style={styles.iconCircle}>
          {uploading ? (
            <ActivityIndicator size="small" color={colors.signInBackground} />
          ) : (
            <Icon name="attach" size={24} color={colors.signInBackground} />
          )}
        </View>
        <Text style={styles.uploadText}>Upload screenshots or documents</Text>
        <Text style={styles.uploadSubtext}>PDF, JPG, PNG • Max 5MB</Text>
      </TouchableOpacity>

      {attachments.map((item) => (
        <View key={item.id} style={styles.attachmentRow}>
          <View style={styles.rowIcon}>
            <Icon
              name={item.type === 'image' ? 'image' : 'document-text'}
              size={18}
              color={colors.signInBackground}
            />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.attachmentName}>{item.name}</Text>
            <Text style={styles.attachmentSize}>{item.sizeLabel}</Text>
          </View>
        </View>
      ))}

      {error && <Text style={styles.errorText}>{error}</Text>}
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
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowText: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  attachmentSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: '#EF4444',
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
