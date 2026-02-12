import React from 'react';
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

type TicketDetailsRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.TicketDetails>;
type TicketDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TicketDetailsScreen: React.FC = () => {
  const navigation = useNavigation<TicketDetailsNavigationProp>();
  const route = useRoute<TicketDetailsRouteProp>();
  const { ticketId } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

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

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TicketHeaderCard 
          ticketNumber={ticketId === '1' ? '#SUP-10234' : '#SUP-10458'}
          subject="Unable to reschedule appointment"
          status="Open"
          createdDate="24 Jan 2026, 11:10 AM"
        />

        <IssueDetailsCard 
          category="Appointments"
          subCategory="Reschedule"
          priority="Medium"
          raisedBy="User"
          email="user@email.com"
        />

        <DescriptionCard 
          description="I tried to reschedule my appointment, but the app keeps showing an error message and does not allow me to proceed."
        />

        <AttachmentsCard 
          attachments={[
            { name: 'error_screenshot.png', size: '245 KB', type: 'image' },
            { name: 'appointment_details.pdf', size: '512 KB', type: 'pdf' },
          ]}
        />
      </ScrollView>
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
});
