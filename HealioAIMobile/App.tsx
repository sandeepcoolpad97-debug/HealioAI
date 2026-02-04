/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { GOOGLE_WEB_CLIENT_ID } from './src/config/auth.config';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRoutes } from './src/constants/strings';
import { RootStackParamList } from './src/navigation/types';
import { InitialScreen } from './src/screens/InitialScreen';
import { WelcomeOne } from './src/screens/welcome/WelcomeOne';
import { WelcomeTwo } from './src/screens/welcome/WelcomeTwo';
import { WelcomeThree } from './src/screens/welcome/WelcomeThree';
import { SignInScreen } from './src/screens/signIn/SignInScreen';
import { VerifyOTPScreen } from './src/screens/signIn/VerifyOTPScreen';
import { CreateAccountScreen } from './src/screens/signUp/CreateAccountScreen';
import { VerifyNumberScreen } from './src/screens/signUp/VerifyNumberScreen';
import { RoleSelectionScreen } from './src/screens/roleSelect/RoleSelectionScreen';
import {
  PersonalDetailsScreen,
  HealthInfoScreen,
  ConsentScreen,
  OnboardingSuccessScreen,
} from './src/screens/onboarding';
import {
  ClinicDetailsScreen,
  ClinicServicesScreen,
  ClinicTermsConsentsScreen,
  ClinicProfileSubmittedScreen,
} from './src/screens/onboardingClinic';
import {
  LaboratoryDetailsScreen,
  LabServicesScreen,
  LabTermsConsentsScreen,
  LabProfileSubmittedScreen,
} from './src/screens/onboardingLab';
import { DoctorProfileScreen } from './src/screens/doctor/DoctorProfileScreen';
import { BookAppointmentScreen } from './src/screens/doctor/BookAppointmentScreen';
import { AppointmentDetailsScreen } from './src/screens/appointments/AppointmentDetailsScreen';
import { AppointmentSummaryScreen } from './src/screens/appointments/AppointmentSummaryScreen';
import { RescheduleAppointmentScreen } from './src/screens/appointments/RescheduleAppointmentScreen';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    try {
      const { GoogleSignin } = require('@react-native-google-signin/google-signin');
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
      });
    } catch {
      // Google Sign-In not installed; phone OTP still works
    }
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={navigationRoutes.Initial}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name={navigationRoutes.Initial}
          component={InitialScreen}
        />
        <Stack.Screen
          name={navigationRoutes.WelcomeOne}
          component={WelcomeOne}
        />
        <Stack.Screen
          name={navigationRoutes.WelcomeTwo}
          component={WelcomeTwo}
        />
        <Stack.Screen
          name={navigationRoutes.WelcomeThree}
          component={WelcomeThree}
        />
        <Stack.Screen
          name={navigationRoutes.SignIn}
          component={SignInScreen}
        />
        <Stack.Screen
          name={navigationRoutes.VerifyOTP}
          component={VerifyOTPScreen}
        />
        <Stack.Screen
          name={navigationRoutes.CreateAccount}
          component={CreateAccountScreen}
        />
        <Stack.Screen
          name={navigationRoutes.VerifyNumber}
          component={VerifyNumberScreen}
        />
        <Stack.Screen
          name={navigationRoutes.RoleSelection}
          component={RoleSelectionScreen}
        />
        <Stack.Screen
          name={navigationRoutes.PersonalDetails}
          component={PersonalDetailsScreen}
        />
        <Stack.Screen
          name={navigationRoutes.ClinicDetails}
          component={ClinicDetailsScreen}
        />
        <Stack.Screen
          name={navigationRoutes.ClinicServices}
          component={ClinicServicesScreen}
        />
        <Stack.Screen
          name={navigationRoutes.ClinicTermsConsents}
          component={ClinicTermsConsentsScreen}
        />
        <Stack.Screen
          name={navigationRoutes.ClinicProfileSubmitted}
          component={ClinicProfileSubmittedScreen}
        />
        <Stack.Screen
          name={navigationRoutes.LabDetails}
          component={LaboratoryDetailsScreen}
        />
        <Stack.Screen
          name={navigationRoutes.LabServices}
          component={LabServicesScreen}
        />
        <Stack.Screen
          name={navigationRoutes.LabTermsConsents}
          component={LabTermsConsentsScreen}
        />
        <Stack.Screen
          name={navigationRoutes.LabProfileSubmitted}
          component={LabProfileSubmittedScreen}
        />
        <Stack.Screen
          name={navigationRoutes.HealthInfo}
          component={HealthInfoScreen}
        />
        <Stack.Screen
          name={navigationRoutes.Consent}
          component={ConsentScreen}
        />
        <Stack.Screen
          name={navigationRoutes.OnboardingSuccess}
          component={OnboardingSuccessScreen}
        />
        <Stack.Screen
          name={navigationRoutes.MainTabs}
          component={BottomTabNavigator}
        />
        <Stack.Screen
          name={navigationRoutes.DoctorProfile}
          component={DoctorProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={navigationRoutes.BookAppointment}
          component={BookAppointmentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={navigationRoutes.AppointmentDetails}
          component={AppointmentDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={navigationRoutes.AppointmentSummary}
          component={AppointmentSummaryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={navigationRoutes.RescheduleAppointment}
          component={RescheduleAppointmentScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
