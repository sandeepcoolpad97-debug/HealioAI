import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';
import { colors } from '../../constants/colors';
import { SuccessHeader } from './success/SuccessHeader';
import { TicketSummaryCard } from './success/TicketSummaryCard';
import { SuccessActions } from './success/SuccessActions';

type SupportSuccessRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.SupportSuccess>;
type SupportSuccessNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SupportSuccessScreen: React.FC = () => {
  const navigation = useNavigation<SupportSuccessNavigationProp>();
  const route = useRoute<SupportSuccessRouteProp>();
  const { ticketId, status } = route.params;

  const handleBackToDashboard = () => {
    navigation.navigate(navigationRoutes.MainTabs, { screen: navigationRoutes.Home });
  };

  const handleSubmitAnother = () => {
    navigation.navigate(navigationRoutes.CreateTicket);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.signInBackground} />
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SuccessHeader />
        
        <TicketSummaryCard 
          ticketId={ticketId}
          status={status}
        />
        
        <SuccessActions 
          onBackToDashboard={handleBackToDashboard}
          onSubmitAnother={handleSubmitAnother}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.signInBackground,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
});
