import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { colors } from '../../constants/colors';

export const NotificationEmptyState: React.FC = () => {
  return (
    <View style={styles.emptyContainer}>
      <Image 
        source={require('../../assets/images/Illustration Container.png')} 
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>No Notifications Yet</Text>
      <Text style={styles.emptySubtitle}>
        We'll notify you when something important happens.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
});
