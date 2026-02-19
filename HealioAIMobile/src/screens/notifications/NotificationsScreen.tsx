import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SectionList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../constants/colors';
import { NotificationHeader } from './NotificationHeader';
import { NotificationItem, NotificationItemData } from './NotificationItem';
import { NotificationEmptyState } from './NotificationEmptyState';
import { NotificationSectionHeader } from './NotificationSectionHeader';

type NotificationsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationSection {
  title: string;
  data: NotificationItemData[];
}

// Mock data for notifications
const MOCK_NOTIFICATIONS: NotificationSection[] = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Sandeep for tomorrow at 10:00 AM is confirmed.',
        time: '2h ago',
        type: 'appointment',
        isRead: false,
      },
      {
        id: '2',
        title: 'Health Tip',
        message: 'Remember to stay hydrated! Drink at least 8 glasses of water today.',
        time: '5h ago',
        type: 'reminder',
        isRead: false,
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '3',
        title: 'New Offer',
        message: 'Get 20% off on your first full body checkup at Healio Labs.',
        time: '1d ago',
        type: 'offer',
        isRead: true,
      },
    ],
  },
];

// Set this to true to see the empty state
const SHOW_EMPTY_STATE = false;

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMarkAllRead = () => {
    console.log('Mark all read pressed');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.signInBackground} />
      
      <NotificationHeader 
        onBack={handleBack} 
        onMarkAllRead={handleMarkAllRead} 
      />

      <View style={styles.content}>
        {SHOW_EMPTY_STATE || MOCK_NOTIFICATIONS.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <SectionList
            sections={MOCK_NOTIFICATIONS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NotificationItem item={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <NotificationSectionHeader title={title} />
            )}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});
