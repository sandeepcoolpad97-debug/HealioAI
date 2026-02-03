import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AuthPrimaryButton,
  CheckboxRow,
  FormCard,
  ScreenHeader,
} from '../../components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setConsents, resetOnboarding } from '../../store/onboardingSlice';
import { getCurrentUser } from '../../services/auth.service';
import { onboardUser } from '../../services/api.service';
import { colors } from '../../constants/colors';
import {
  navigationRoutes,
  onboardingFlowStrings,
} from '../../constants/strings';
import { sharedOnboardingStyles as shared } from './onboardingStyles';

const s = onboardingFlowStrings.consent;

type ConsentScreenProps = {
  navigation: {
    replace: (route: string, params?: object) => void;
  };
};

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const onboarding = useAppSelector((state) => state.onboarding);

  const [termsAccepted, setTermsAccepted] = useState(onboarding.consents.termsAndConditions);
  const [privacyAccepted, setPrivacyAccepted] = useState(onboarding.consents.policyTerms);

  const canFinish = termsAccepted && privacyAccepted;
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async () => {
    if (!canFinish || submitting) return;

    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'Not signed in.');
      return;
    }
    if (!onboarding.roleId || !onboarding.subscriptionId || !onboarding.phone) {
      Alert.alert('Error', 'Missing role or subscription. Please go back and complete role selection.');
      return;
    }

    const personal = onboarding.personal;
    if (!personal.gender || !personal.language) {
      Alert.alert('Error', 'Please complete personal details.');
      return;
    }

    setSubmitting(true);
    try {
      const idToken = await user.getIdToken(true);
      const payload = {
        firebaseUid: user.uid,
        name: personal.fullName,
        age: personal.age ? parseInt(personal.age, 10) : undefined,
        gender: personal.gender as 'male' | 'female' | 'other',
        language: personal.language || 'en',
        roleId: onboarding.roleId,
        subscriptionId: onboarding.subscriptionId,
        email: personal.email.trim() || undefined,
        phone: {
          countryCode: onboarding.phone.countryCode,
          number: onboarding.phone.number,
          verified: onboarding.phone.verified,
        },
        consents: {
          termsAndConditions: true as const,
          policyTerms: true as const,
          medicalDisclaimer: true as const,
        },
        medical: {
          existingConditions: onboarding.health.existingConditions.filter((c) => c !== 'None'),
          otherConditions: onboarding.health.otherConditions.trim() || undefined,
        },
      };
      await onboardUser(idToken, payload);
      dispatch(resetOnboarding());
      navigation.replace(navigationRoutes.OnboardingSuccess);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Onboarding failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const openTerms = () => Linking.openURL('https://example.com/terms');
  const openPrivacy = () => Linking.openURL('https://example.com/privacy');

  return (
    <SafeAreaView style={shared.container} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.signInBackground}
      />
      <ScrollView
        contentContainerStyle={shared.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title={s.title} subtitle={s.subtitle} />

        <FormCard>
          <CheckboxRow
            checked={termsAccepted}
            onToggle={() => {
              const next = !termsAccepted;
              setTermsAccepted(next);
              dispatch(setConsents({ termsAndConditions: next }));
            }}
            label={
              <Text>
                {s.termsPrefix}
                <Text style={styles.link} onPress={openTerms}>
                  {s.termsLink}
                </Text>
              </Text>
            }
            accessibilityLabel={`${s.termsPrefix}${s.termsLink}`}
          />
          <CheckboxRow
            checked={privacyAccepted}
            onToggle={() => {
              const next = !privacyAccepted;
              setPrivacyAccepted(next);
              dispatch(setConsents({ policyTerms: next }));
            }}
            label={
              <Text>
                {s.privacyPrefix}
                <Text style={styles.link} onPress={openPrivacy}>
                  {s.privacyLink}
                </Text>
              </Text>
            }
            accessibilityLabel={`${s.privacyPrefix}${s.privacyLink}`}
          />
          <Text style={styles.supportingText}>{s.supportingText}</Text>
        </FormCard>

        <AuthPrimaryButton
          label={submitting ? 'Submitting…' : s.finishSetup}
          onPress={handleFinish}
          disabled={!canFinish || submitting}
        />
        {submitting && (
          <View style={shared.loadingWrap}>
            <ActivityIndicator size="small" color={colors.otpButtonGreen} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  link: {
    color: colors.primaryText,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  supportingText: {
    fontSize: 14,
    color: colors.inputPlaceholderGrey,
    lineHeight: 20,
    marginTop: 4,
  },
});
