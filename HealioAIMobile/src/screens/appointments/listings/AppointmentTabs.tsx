import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

interface AppointmentTabsProps {
  activeTab: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
}

export const AppointmentTabs: React.FC<AppointmentTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
        onPress={() => onTabChange('upcoming')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'upcoming' ? styles.activeTabText : styles.inactiveTabText,
          ]}
        >
          Upcoming
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'past' && styles.activeTab]}
        onPress={() => onTabChange('past')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'past' ? styles.activeTabText : styles.inactiveTabText,
          ]}
        >
          Past
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50', // Green underline
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0A5FB4', // Blue text for active
  },
  inactiveTabText: {
    color: '#6B7280', // Grey text for inactive
  },
});
