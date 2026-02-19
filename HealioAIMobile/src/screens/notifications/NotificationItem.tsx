import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

export interface NotificationItemData {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'appointment' | 'reminder' | 'system' | 'offer';
  isRead: boolean;
}

interface NotificationItemProps {
  item: NotificationItemData;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ item }) => {
  const getIconName = (type: NotificationItemData['type']) => {
    switch (type) {
      case 'appointment': return 'calendar';
      case 'reminder': return 'notifications';
      case 'offer': return 'pricetag';
      default: return 'information-circle';
    }
  };

  const getIconColor = (type: NotificationItemData['type']) => {
    switch (type) {
      case 'appointment': return colors.primaryText;
      case 'reminder': return '#F59E0B';
      case 'offer': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getIconColor(item.type)}15` }]}>
        <Icon name={getIconName(item.type)} size={22} color={getIconColor(item.type)} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  unreadCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DBEAFE',
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryText,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryText,
    marginLeft: 8,
  },
});
