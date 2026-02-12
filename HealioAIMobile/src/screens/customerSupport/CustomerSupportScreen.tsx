import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';
import { colors } from '../../constants/colors';
import { EmptyTickets } from './listings/EmptyTickets';
import { TicketCard, TicketData } from './listings/TicketCard';

type CustomerSupportNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock data
const MOCK_TICKETS: TicketData[] = [
  {
    id: '1',
    ticketNumber: '#SUP-10234',
    subject: 'Unable to cancel appointment',
    category: 'Appointments',
    status: 'Open',
    lastUpdated: '24 Jan 2026, 2:15 PM',
  },
  {
    id: '2',
    ticketNumber: '#SUP-10198',
    subject: 'Refund not received for lab test',
    category: 'Payments',
    status: 'In Progress',
    lastUpdated: '23 Jan 2026, 11:30 AM',
  },
  {
    id: '3',
    ticketNumber: '#SUP-10156',
    subject: 'Lab report download issue',
    category: 'Laboratory Services',
    status: 'Closed',
    lastUpdated: '22 Jan 2026, 4:45 PM',
  },
  {
    id: '4',
    ticketNumber: '#SUP-10089',
    subject: "Doctor's profile not loading",
    category: 'App Issues',
    status: 'Open',
    lastUpdated: '21 Jan 2026, 9:20 AM',
  },
  {
    id: '5',
    ticketNumber: '#SUP-10034',
    subject: 'Prescription upload failed',
    category: 'Prescriptions',
    status: 'Closed',
    lastUpdated: '20 Jan 2026, 1:15 PM',
  },
];

export const CustomerSupportScreen: React.FC = () => {
  const navigation = useNavigation<CustomerSupportNavigationProp>();
  const [tickets] = useState<TicketData[]>(MOCK_TICKETS); // Toggle this to [] to see empty state

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreateTicket = () => {
    navigation.navigate(navigationRoutes.CreateTicket);
  };

  const handleViewDetails = (id: string) => {
    navigation.navigate(navigationRoutes.TicketDetails, { ticketId: id });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.signInBackground} />
      
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Support</Text>
          <View style={styles.placeholderButton} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        {tickets.length === 0 ? (
          <EmptyTickets onCreateTicket={handleCreateTicket} />
        ) : (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard ticket={item} onViewDetails={handleViewDetails} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {tickets.length > 0 && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={handleCreateTicket}
          activeOpacity={0.8}
        >
          <Icon name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  headerSafeArea: {
    backgroundColor: colors.signInBackground,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholderButton: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.signInBackground,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
