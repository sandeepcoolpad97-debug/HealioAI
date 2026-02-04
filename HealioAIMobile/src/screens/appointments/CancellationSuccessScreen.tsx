import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';

// Components
import { CancellationSuccessHeader } from './confirmation/CancellationSuccessHeader';
import { CancellationInfoCard } from './confirmation/CancellationInfoCard';
import { CancellationSuccessFooter } from './confirmation/CancellationSuccessFooter';

type CancellationSuccessRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.CancellationSuccess>;
type CancellationSuccessNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CancellationSuccessScreen: React.FC = () => {
  const navigation = useNavigation<CancellationSuccessNavigationProp>();
  const route = useRoute<CancellationSuccessRouteProp>();
  const { doctorName, date, time } = route.params;

  const handleGoBack = () => {
    // Navigate back to Appointments list, resetting the stack if needed or just navigating
    navigation.navigate(navigationRoutes.MainTabs, { screen: navigationRoutes.Appointments });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacer} />
        
        <CancellationSuccessHeader 
          doctorName={doctorName}
          date={date}
          time={time}
        />

        <CancellationInfoCard />
      </ScrollView>

      <CancellationSuccessFooter 
        onGoBack={handleGoBack}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  spacer: {
    height: 40,
  },
});
