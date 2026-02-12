import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface IssueDetailsCardProps {
  category: string;
  subCategory: string;
  priority: 'Low' | 'Medium' | 'High';
  raisedBy: string;
  email: string;
}

export const IssueDetailsCard: React.FC<IssueDetailsCardProps> = ({
  category,
  subCategory,
  priority,
  raisedBy,
  email,
}) => {
  const getPriorityColor = (priority: IssueDetailsCardProps['priority']) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const DetailRow = ({ label, value, isPriority = false }: { label: string; value: string; isPriority?: boolean }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {isPriority ? (
        <View style={[styles.priorityBadge, { backgroundColor: '#FFFBEB' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(priority) }]}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Issue Details</Text>
      
      <DetailRow label="Category" value={category} />
      <View style={styles.divider} />
      
      <DetailRow label="Sub-Category" value={subCategory} />
      <View style={styles.divider} />
      
      <DetailRow label="Priority" value={priority} isPriority />
      <View style={styles.divider} />
      
      <DetailRow label="Raised By" value={raisedBy} />
      <View style={styles.divider} />
      
      <DetailRow label="Email" value={email} />
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
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
