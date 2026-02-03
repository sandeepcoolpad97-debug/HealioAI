import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';

interface HomeSectionProps {
  title: string;
  onSeeAll?: () => void;
  children: React.ReactNode;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  onSeeAll,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A5FB4', // Using primary blue from design
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50', // Green color from design
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 10, // For shadow visibility
  },
});
