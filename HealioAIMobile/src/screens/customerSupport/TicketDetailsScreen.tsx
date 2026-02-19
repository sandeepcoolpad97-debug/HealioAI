import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';
import { colors } from '../../constants/colors';
import { TicketHeaderCard } from './details/TicketHeaderCard';
import { IssueDetailsCard } from './details/IssueDetailsCard';
import { DescriptionCard } from './details/DescriptionCard';
import { AttachmentsCard } from './details/AttachmentsCard';
import {
  supportTicketService,
  supportTicketHistoryService,
  type SupportTicketDto,
  type SupportTicketHistoryEntry,
} from '../../services';

type TicketDetailsRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.TicketDetails>;
type TicketDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TicketDetailsScreen: React.FC = () => {
  const navigation = useNavigation<TicketDetailsNavigationProp>();
  const route = useRoute<TicketDetailsRouteProp>();
  const { ticketId } = route.params;

  const [ticket, setTicket] = useState<SupportTicketDto | null>(null);
  const [history, setHistory] = useState<SupportTicketHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const ticketRes = await supportTicketService.getTicketById(ticketId);
        setTicket(ticketRes.data);

        const historyRes = await supportTicketHistoryService.getHistoryForTicket(ticketRes.data._id, 1, 20);
        setHistory(historyRes.data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load ticket details';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [ticketId]);

  const createdDate = (() => {
    const source = (ticket?.createdAt || '') as string;
    if (!source) return '';
    const d = new Date(source);
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
    return `${dateStr}, ${timeStr}`;
  })();

  const priorityLabel = (() => {
    if (!ticket?.priority) return 'Medium';
    const p = ticket.priority.toLowerCase();
    if (p === 'low') return 'Low';
    if (p === 'high') return 'High';
    return 'Medium';
  })();

  const statusLabel = (() => {
    if (!ticket?.status) return 'Open';
    if (ticket.status === 'in_progress') return 'In Progress';
    if (ticket.status === 'closed') return 'Closed';
    return 'Open';
  })();

  const raisedByLabel = (() => {
    const role = (ticket as any)?.raisedByRole as string | undefined;
    if (!role) return 'User';
    return role;
  })();

  const raisedByEmail = (() => {
    const raisedById = (ticket as any)?.raisedById as { email?: string; emailId?: string } | undefined;
    return raisedById?.email || raisedById?.emailId || '';
  })();

  const attachmentsFromHistory = (() => {
    const attachments: { name: string; size: string; type: 'image' | 'pdf' }[] = [];

    if (ticket?.attachments && Array.isArray(ticket.attachments)) {
      ticket.attachments.forEach((att) => {
        const type =
          att.resourceType === 'image' && att.format.toLowerCase() !== 'pdf'
            ? 'image'
            : 'pdf';
        const sizeKb =
          typeof att.bytes === 'number'
            ? `${Math.round(att.bytes / 1024)} KB`
            : '';

        attachments.push({
          name: att.originalFilename || att.publicId || 'Attachment',
          size: sizeKb,
          type,
        });
      });
    }

    history.forEach((entry) => {
      (entry.attachments || []).forEach((att) => {
        const type = att.fileType && att.fileType.toLowerCase().includes('pdf') ? 'pdf' : 'image';
        const sizeKb =
          typeof att.fileSize === 'number'
            ? `${Math.round(att.fileSize / 1024)} KB`
            : '';

        attachments.push({
          name: att.fileName,
          size: sizeKb,
          type,
        });
      });
    });

    return attachments;
  })();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.signInBackground} />
      
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ticket Details</Text>
          <View style={styles.placeholderButton} />
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading ticket details...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : ticket ? (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TicketHeaderCard 
            ticketNumber={ticket.ticketId}
            subject={ticket.subject}
            status={statusLabel}
            createdDate={createdDate}
          />

          <IssueDetailsCard 
            category={ticket.category}
            subCategory={ticket.subCategory}
            priority={priorityLabel as 'Low' | 'Medium' | 'High'}
            raisedBy={raisedByLabel}
            email={raisedByEmail}
          />

          <DescriptionCard 
            description={ticket.description}
          />

          {attachmentsFromHistory.length > 0 && (
            <AttachmentsCard 
              attachments={attachmentsFromHistory}
            />
          )}
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No ticket details available.</Text>
        </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
  errorText: {
    fontSize: 14,
    color: '#EF4444',
  },
});
