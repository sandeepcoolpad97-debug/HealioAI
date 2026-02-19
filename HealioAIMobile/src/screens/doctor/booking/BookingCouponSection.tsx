import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface BookingCouponSectionProps {
  onApplyCoupon: (code: string) => void;
  appliedCoupon?: string;
  discountAmount?: number;
}

export const BookingCouponSection: React.FC<BookingCouponSectionProps> = ({
  onApplyCoupon,
  appliedCoupon,
  discountAmount,
}) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim()) {
      onApplyCoupon(code);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Offers</Text>
      
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter coupon code"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {appliedCoupon && (
          <View style={styles.successRow}>
            <Icon name="checkmark-circle" size={16} color="#16A34A" />
            <Text style={styles.successText}>Offer Applied</Text>
          </View>
        )}
        
        {appliedCoupon && (
          <Text style={styles.offerDetailText}>
            New Year Offer – ₹{discountAmount} off
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    marginRight: 12,
  },
  applyButton: {
    backgroundColor: '#0A5FB4',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  successText: {
    color: '#16A34A',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  offerDetailText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 22, // Align with success text
  },
});
