import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../../constants/colors';

interface EmptyTicketsProps {
  onCreateTicket: () => void;
}

export const EmptyTickets: React.FC<EmptyTicketsProps> = ({ onCreateTicket }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/Illustration Container.png')} 
        style={styles.illustration}
        resizeMode="contain"
      />
      <Text style={styles.title}>No Tickets Yet</Text>
      <Text style={styles.subtitle}>
        All your support requests will appear here once submitted.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onCreateTicket}>
        <Text style={styles.buttonText}>Create Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.backgroundLight,
  },
  illustration: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.signInBackground,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
