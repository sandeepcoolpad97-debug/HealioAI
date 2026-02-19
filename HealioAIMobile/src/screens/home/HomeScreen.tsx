import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';
import { HomeHeader } from './HomeHeader';
import { HealthScoreCard } from './HealthScoreCard';
import { AIHealthServices } from './AIHealthServices';
import { RecommendedDoctors } from './RecommendedDoctors';
import { RecommendedLaboratories } from './RecommendedLaboratories';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNotificationPress = () => {
    navigation.navigate(navigationRoutes.Notifications);
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        userName="Sandeep"
        onNotificationPress={handleNotificationPress}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <HealthScoreCard />
        <AIHealthServices />
        <RecommendedDoctors />
        <RecommendedLaboratories />
        <View style={{ height: 24 }} />
      </ScrollView>
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
});

