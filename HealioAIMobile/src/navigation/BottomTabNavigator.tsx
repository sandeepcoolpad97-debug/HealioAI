import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AppointmentsScreen } from '../screens/appointments/AppointmentsScreen';
import { ContactScreen } from '../screens/contact/ContactScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { navigationRoutes } from '../constants/strings';
import { colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === navigationRoutes.Home) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === navigationRoutes.Appointments) {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === navigationRoutes.Contact) {
            iconName = focused ? 'headset' : 'headset-outline';
          } else if (route.name === navigationRoutes.Profile) {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Fallback icon
          if (!iconName) {
            iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primaryBlue,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name={navigationRoutes.Home} component={HomeScreen} />
      <Tab.Screen name={navigationRoutes.Appointments} component={AppointmentsScreen} />
      <Tab.Screen name={navigationRoutes.Contact} component={ContactScreen} />
      <Tab.Screen name={navigationRoutes.Profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
};
