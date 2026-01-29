/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {navigationRoutes} from './src/constants/strings';
import {InitialScreen} from './src/screens/InitialScreen';
import {WelcomeOne} from './src/screens/welcome/WelcomeOne';
import {WelcomeTwo} from './src/screens/welcome/WelcomeTwo';
import {WelcomeThree} from './src/screens/welcome/WelcomeThree';
import {SignInScreen} from './src/screens/signIn/SignInScreen';
import {VerifyOTPScreen} from './src/screens/signIn/VerifyOTPScreen';
import {CreateAccountScreen} from './src/screens/signUp/CreateAccountScreen';
import {VerifyNumberScreen} from './src/screens/signUp/VerifyNumberScreen';
import {RoleSelectionScreen} from './src/screens/roleSelect/RoleSelectionScreen';
import {
  PersonalDetailsScreen,
  HealthInfoScreen,
  ConsentScreen,
  OnboardingSuccessScreen,
} from './src/screens/onboarding';
import {HomeScreen} from './src/screens/HomeScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

type RootStackParamList = {
  [navigationRoutes.Initial]: undefined;
  [navigationRoutes.WelcomeOne]: undefined;
  [navigationRoutes.WelcomeTwo]: undefined;
  [navigationRoutes.WelcomeThree]: undefined;
  [navigationRoutes.SignIn]: undefined;
  [navigationRoutes.VerifyOTP]: {phone: string};
  [navigationRoutes.CreateAccount]: undefined;
  [navigationRoutes.VerifyNumber]: {phone: string};
  [navigationRoutes.RoleSelection]: undefined;
  [navigationRoutes.PersonalDetails]: {role?: string};
  [navigationRoutes.HealthInfo]: undefined;
  [navigationRoutes.Consent]: undefined;
  [navigationRoutes.OnboardingSuccess]: undefined;
  [navigationRoutes.Home]: {role?: string};
};

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
        <Stack.Screen name={navigationRoutes.Home} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
