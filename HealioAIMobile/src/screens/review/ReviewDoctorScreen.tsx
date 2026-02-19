import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';
import { ReviewDoctorCard } from './addReview/ReviewDoctorCard';
import { ReviewRatingSection } from './addReview/ReviewRatingSection';
import { ReviewNoteSection } from './addReview/ReviewNoteSection';
import { ReviewFooter } from './addReview/ReviewFooter';
import { reviewService } from '../../services/review.service';
import { useAppSelector } from '../../store/hooks';

type ReviewDoctorRouteProp = RouteProp<RootStackParamList, typeof navigationRoutes.ReviewDoctor>;
type ReviewDoctorNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ReviewDoctorScreen: React.FC = () => {
  const navigation = useNavigation<ReviewDoctorNavigationProp>();
  const route = useRoute<ReviewDoctorRouteProp>();
  const { 
    doctorId, 
    doctorName, 
    specialty, 
    date, 
    time, 
    appointmentId,
    initialRating, 
    initialReview 
  } = route.params;

  const [rating, setRating] = useState(initialRating ?? 0);
  const [reviewText, setReviewText] = useState(initialReview ?? '');
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.user);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!appointmentId) {
      Alert.alert('Error', 'Appointment information is missing. Cannot submit review.');
      return;
    }

    if (!user._id) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      setLoading(true);
      await reviewService.createReview({
        appointmentId,
        userId: user._id,
        reviewFor: 'Clinic', // Defaulting to Clinic for now as it's ReviewDoctorScreen
        reviewForId: doctorId, // Assuming doctorId is the ID of the entity being reviewed
        rating,
        comment: reviewText.trim() || undefined,
      });

      navigation.navigate(navigationRoutes.ReviewSuccess, {
        doctorId,
        doctorName,
        specialty,
        date,
        time,
        rating,
        appointmentId,
        reviewText: reviewText.trim() ? reviewText : undefined,
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A5FB4" />
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Your Doctor</Text>
          <View style={styles.placeholderButton} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ReviewDoctorCard
          doctorName={doctorName}
          specialty={specialty}
          date={date}
          time={time}
        />

        <ReviewRatingSection rating={rating} onChange={setRating} />

        <ReviewNoteSection value={reviewText} onChange={setReviewText} />

        <View style={styles.flagRow}>
          <Icon name="flag-outline" size={18} color="#6B7280" />
          <Text style={styles.flagText}>Flag inappropriate content</Text>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0A5FB4" />
        </View>
      )}

      <ReviewFooter onSubmit={handleSubmit} disabled={rating === 0 || loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerSafeArea: {
    backgroundColor: '#0A5FB4',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#0A5FB4',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholderButton: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  flagText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#6B7280',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
