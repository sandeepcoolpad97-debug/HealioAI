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
import { ReviewSuccessHeader } from './successReview/ReviewSuccessHeader';
import { ReviewSuccessCard } from './successReview/ReviewSuccessCard';
import { ReviewSuccessFooter } from './successReview/ReviewSuccessFooter';

type ReviewSuccessRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.ReviewSuccess>;
type ReviewSuccessNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ReviewSuccessScreen: React.FC = () => {
  const navigation = useNavigation<ReviewSuccessNavigationProp>();
  const route = useRoute<ReviewSuccessRouteProp>();
  const { doctorId, doctorName, specialty, date, time, rating, reviewText, appointmentId } = route.params;

  const handleBackToProfile = () => {
    navigation.navigate(navigationRoutes.AppointmentSummary, {
      appointmentId,
    });
  };

  const handleEditReview = () => {
    navigation.navigate(navigationRoutes.ReviewDoctor, {
      doctorId,
      doctorName,
      specialty,
      date,
      time,
      initialRating: rating,
      initialReview: reviewText,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A5FB4" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ReviewSuccessHeader />
          <ReviewSuccessCard
            doctorName={doctorName}
            specialty={specialty}
            rating={rating}
            reviewText={reviewText}
            submittedText="Submitted just now"
          />
        </ScrollView>
      </SafeAreaView>

      <ReviewSuccessFooter
        onBackToProfile={handleBackToProfile}
        onEditReview={handleEditReview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A5FB4',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
});
