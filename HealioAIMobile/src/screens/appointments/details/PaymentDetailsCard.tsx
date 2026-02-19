import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface PaymentDetailsCardProps {
  consultationFee: number;
  discount: number;
  amountPayable: number;
  offerApplied?: string;
  paidDate: string;
  paymentMethod: string;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  consultationFee,
  discount,
  amountPayable,
  offerApplied,
  paidDate,
  paymentMethod,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Payment Details</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Consultation Fee</Text>
        <Text style={styles.value}>₹{consultationFee}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Discount</Text>
        <Text style={styles.discountValue}>– ₹{discount}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Amount Payable</Text>
        <Text style={styles.totalValue}>₹{amountPayable}</Text>
      </View>

      {offerApplied && (
        <View style={styles.offerContainer}>
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>Offer Applied</Text>
          </View>
          <Text style={styles.offerText}>{offerApplied}</Text>
        </View>
      )}

      <View style={styles.paidContainer}>
        <View style={styles.paidHeader}>
          <Icon name="checkmark-circle" size={20} color="#16A34A" />
          <Text style={styles.paidTitle}>Paid</Text>
          <Text style={styles.paidAmount}>₹{amountPayable}</Text>
        </View>
        <Text style={styles.paidSubtitle}>
          Paid via {paymentMethod} on {paidDate}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24, // Extra margin for footer
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textDecorationLine: 'line-through', // Assuming strikethrough based on image for fee? Or just regular. Image showed fee 800 crossed out if discounted? Let's check. 
    // Image shows 800 crossed out. So I will add a prop or just assume standard logic. 
    // Wait, usually the fee is the base. If discount is applied, maybe show original crossed out?
    // Let's keep it simple for now. The image shows "Consultation Fee ₹800" (strikethrough) if there's a discount?
    // Actually in the image "Consultation Fee" is 800 (strikethrough). Let's make it conditional or just style it if needed.
    // For now I'll just use normal style but add a strikethrough style option if I were to be precise. 
    // I'll leave it as normal text for now unless specified.
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16A34A',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  offerContainer: {
    marginTop: 4,
    marginBottom: 16,
  },
  offerBadge: {
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  offerBadgeText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  offerText: {
    fontSize: 13,
    color: '#4B5563',
  },
  paidContainer: {
    backgroundColor: '#ECFDF5', // Light green bg
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  paidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paidTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  paidAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  paidSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 28, // Align with title text (20 icon + 8 margin)
  },
});
