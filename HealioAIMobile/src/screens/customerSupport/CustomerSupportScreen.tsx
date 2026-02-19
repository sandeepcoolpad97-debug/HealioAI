import React, { useState, useEffect } from 'react';
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
import { supportTicketService } from '../../services';
import { useAppSelector } from '../../store/hooks';

type CustomerSupportNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CustomerSupportScreen: React.FC = () => {
  const navigation = useNavigation<CustomerSupportNavigationProp>();
  const user = useAppSelector((state) => state.user);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreateTicket = () => {
    navigation.navigate(navigationRoutes.CreateTicket);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user._id || !user.role) {
        setTickets([]);
        return;
      }

      try {
        setLoading(true);
        const result = await supportTicketService.listTickets({
          raisedById: user._id,
          raisedByRole:
            user.role === 'user'
              ? 'User'
              : user.role === 'clinic'
              ? 'Clinic'
              : 'Lab',
          page: 1,
          limit: 50,
        });

        const mapped: TicketData[] = (result.data || []).map((t) => {
          const updatedAt = t.lastUpdatedAt || t.createdAt;
          let lastUpdated = '';

          if (updatedAt) {
            const d = new Date(updatedAt);
            const dateStr = d.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const timeStr = d.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            lastUpdated = `${dateStr}, ${timeStr}`;
          }

          let status: TicketData['status'] = 'Open';
          if (t.status === 'in_progress') status = 'In Progress';
          else if (t.status === 'closed') status = 'Closed';

          return {
            id: t._id,
            ticketNumber: t.ticketId,
            subject: t.subject,
            category: t.category,
            status,
            lastUpdated,
          };
        });

        setTickets(mapped);
      } catch (error) {
        console.error('Error loading support tickets', error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user._id, user.role]);

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading tickets...</Text>
          </View>
        ) : tickets.length === 0 ? (
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
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
