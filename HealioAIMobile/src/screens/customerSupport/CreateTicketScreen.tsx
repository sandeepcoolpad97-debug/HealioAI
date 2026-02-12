import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { navigationRoutes } from '../../constants/strings';
import { colors } from '../../constants/colors';
import { SupportForm } from './create/SupportForm';
import { AttachmentUpload } from './create/AttachmentUpload';
import { Loader } from '../../components';

type CreateTicketNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CreateTicketScreen: React.FC = () => {
  const navigation = useNavigation<CreateTicketNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = (formData: any) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigation.navigate(navigationRoutes.SupportSuccess, {
        ticketId: 'HL-SUP-24567',
        status: 'Open',
      });
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.signInBackground}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* SECTION 1 */}
        <View style={styles.headerBackground}>
          <SafeAreaView edges={['top']}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Customer Support</Text>
              <View style={styles.placeholderButton} />
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.headerHeading}>We’re here to help</Text>
              <Text style={styles.headerSubheading}>
                Submit your query and our support team will get back to you
              </Text>
            </View>
          </SafeAreaView>
        </View>

        {/* SECTION 2 */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.cardContainer}>
            <SupportForm onSubmit={handleSubmit} />
            <AttachmentUpload />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit({})}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.supportInfo}>
            <View style={styles.infoItem}>
              <Icon
                name="headset-outline"
                size={18}
                color={colors.signInBackground}
              />
              <Text style={styles.infoText}>24/7 Support</Text>
            </View>

            <View style={styles.infoItem}>
              <Icon
                name="shield-checkmark-outline"
                size={18}
                color={colors.signInBackground}
              />
              <Text style={styles.infoText}>Secure Data</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },

  /* ✅ FIXED HEADER HEIGHT */
  headerBackground: {
    backgroundColor: colors.signInBackground,
    height: 240, // 🔥 important (controls overlap)
    position: 'relative',
  },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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

  headerContent: {
    paddingHorizontal: 24,
    marginTop: 16,
  },

  headerHeading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  headerSubheading: {
    fontSize: 15,
    color: '#F3F4F6',
    lineHeight: 22,
    opacity: 0.9,
  },

  content: {
    flex: 1,
  },

  /* ✅ added paddingTop so overlap looks clean */
  scrollContent: {
    paddingBottom: 40,
  },

  /* ✅ stronger overlap */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -40, // 🔥 pull card upward more
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },

  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  supportInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
    gap: 40,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  infoText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
});
