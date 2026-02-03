import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BookingPaymentSummaryProps {
  consultationFee: number;
  discount: number;
  totalPayable: number;
}

export const BookingPaymentSummary: React.FC<BookingPaymentSummaryProps> = ({
  consultationFee,
  discount,
  totalPayable,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Payment Summary</Text>
      
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Consultation Fee</Text>
          <Text style={styles.value}>₹{consultationFee}</Text>
        </View>
        
        <View style={[styles.row, styles.discountRow]}>
          <Text style={styles.discountLabel}>Discount</Text>
          <Text style={styles.discountValue}>– ₹{discount}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalValue}>₹{totalPayable}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  discountRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#374151',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  discountLabel: {
    fontSize: 14,
    color: '#16A34A',
  },
  discountValue: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});
