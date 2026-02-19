import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const WarningCard: React.FC = () => {
  return (
    <View style={styles.warningCard}>
      <View style={styles.warningContent}>
        <Icon name="warning" size={24} color="#B91C1C" style={styles.warningIcon} />
        <View style={styles.warningTextContainer}>
          <Text style={styles.warningTitle}>Important Notice</Text>
          <Text style={styles.warningText}>
            Cancelling may affect your queue priority for future appointments with this doctor.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 24,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
});
