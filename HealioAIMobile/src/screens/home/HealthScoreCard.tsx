import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const HealthScoreCard: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Left Column: Text Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>AI Health Score</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreValue}>78</Text>
          <Text style={styles.scoreTotal}>/ 100</Text>
        </View>
        <Text style={styles.riskLevel}>Moderate Risk</Text>
      </View>

      {/* Right Column: Circular Indicator */}
      <View style={styles.indicatorContainer}>
        <View style={styles.circle}>
          <Icon name="flash" size={24} color="#4CAF50" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9', // Light mint green
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    // Optional shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0', // Medium Blue
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32', // Strong Green
  },
  scoreTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32', // Strong Green
    marginLeft: 4,
  },
  riskLevel: {
    fontSize: 14,
    color: '#455A64', // Dark Blue Grey
    fontWeight: '500',
  },
  indicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#4CAF50', // Green border
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
