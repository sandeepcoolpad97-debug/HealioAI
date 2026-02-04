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
import { SuccessHeader } from './success/SuccessHeader';
import { SuccessInfoCard } from './success/SuccessInfoCard';
import { SuccessFooter } from './success/SuccessFooter';

type AppointmentSuccessRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.AppointmentSuccess>;
type AppointmentSuccessNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AppointmentSuccessScreen: React.FC = () => {
  const navigation = useNavigation<AppointmentSuccessNavigationProp>();
  const route = useRoute<AppointmentSuccessRouteProp>();
  const { type, doctorName, date, time, appointmentId } = route.params;

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: navigationRoutes.MainTabs }],
    });
  };

  const handleViewAppointment = () => {
    // If we have an ID, go to details, otherwise go to list
    if (appointmentId) {
        // Reset stack and navigate to details
        navigation.reset({
            index: 1,
            routes: [
                { name: navigationRoutes.MainTabs },
                { 
                    name: navigationRoutes.AppointmentDetails, 
                    params: { appointmentId } 
                }
            ],
        });
    } else {
        navigation.navigate(navigationRoutes.MainTabs, { screen: navigationRoutes.Appointments });
    }
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
        
        <SuccessHeader 
          type={type}
          doctorName={doctorName}
          date={date}
          time={time}
        />

        <SuccessInfoCard />
      </ScrollView>

      <SuccessFooter 
        onGoHome={handleGoHome}
        onViewAppointment={handleViewAppointment}
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
