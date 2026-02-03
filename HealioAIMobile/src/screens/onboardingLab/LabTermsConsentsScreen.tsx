import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AuthPrimaryButton,
  ConsentRow,
  FormCard,
  ScreenHeader,
} from '../../components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLabConsents, resetLabOnboarding } from '../../store/labOnboardingSlice';
import { getCurrentUser } from '../../services/auth.service';
import { createLab } from '../../services/api.service';
import { colors } from '../../constants/colors';
import {
  labOnboardingStrings,
  navigationRoutes,
} from '../../constants/strings';
import { sharedLabOnboardingStyles as shared } from './labOnboardingStyles';

const s = labOnboardingStrings.termsConsents;

type LabTermsConsentsScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const LabTermsConsentsScreen: React.FC<LabTermsConsentsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const labOnboarding = useAppSelector((s) => s.labOnboarding);
  const roleId = useAppSelector((s) => s.onboarding.roleId);

  const [termsAccepted, setTermsAccepted] = useState(labOnboarding.consents.termsAndConditions);
  const [consentAccepted, setConsentAccepted] = useState(labOnboarding.consents.policyTerms);
  const [liabilityAccepted, setLiabilityAccepted] = useState(labOnboarding.consents.medicalDisclaimer);
  const [submitting, setSubmitting] = useState(false);

  const allAccepted = termsAccepted && consentAccepted && liabilityAccepted;

  const handleSubmit = async () => {
    if (!allAccepted || submitting) return;
    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'Not signed in.');
      return;
    }
    if (!roleId) {
      Alert.alert('Error', 'Missing role. Please go back and select lab.');
      return;
    }
    const d = labOnboarding.details;
    const svc = labOnboarding.services;
    if (!d.labName.trim() || !d.registrationNumber.trim() || !d.contactNumber.trim()) {
      Alert.alert('Error', 'Please complete lab details.');
      return;
    }
    setSubmitting(true);
    try {
      await createLab({
        firebaseUid: user.uid,
        labName: d.labName.trim(),
        registrationNumber: d.registrationNumber.trim(),
        roleId,
        address: d.address?.trim() || undefined,
        contactNumber: d.contactNumber.trim(),
        emailId: d.email?.trim() || undefined,
        operatingHours: [],
        services: {
          testCategories: svc.testCategories.filter((x) => x?.trim()).map((x) => x.trim()),
          homeSampleCollection: svc.homeSampleCollection ?? false,
          reportDeliveryType: svc.reportDeliveryType.length ? svc.reportDeliveryType : ['pdf'],
        },
        consents: {
          termsAndConditions: true as const,
          policyTerms: true as const,
          medicalDisclaimer: true as const,
        },
      });
      dispatch(resetLabOnboarding());
      navigation.navigate(navigationRoutes.LabProfileSubmitted);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit lab. Try again.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewTerms = () => {
    // Placeholder: open terms URL or modal
  };

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
          <ConsentRow
            checked={termsAccepted}
            onToggle={() => {
              const next = !termsAccepted;
              setTermsAccepted(next);
              dispatch(setLabConsents({ termsAndConditions: next }));
            }}
            title={s.termsLabel}
            description={s.termsDescription}
            linkText={s.viewFullTerms}
            onLinkPress={handleViewTerms}
            variant="blue"
          />
          <ConsentRow
            checked={consentAccepted}
            onToggle={() => {
              const next = !consentAccepted;
              setConsentAccepted(next);
              dispatch(setLabConsents({ policyTerms: next }));
            }}
            title={s.consentLabel}
            description={s.consentDescription}
            variant="blue"
          />
          <ConsentRow
            checked={liabilityAccepted}
            onToggle={() => {
              const next = !liabilityAccepted;
              setLiabilityAccepted(next);
              dispatch(setLabConsents({ medicalDisclaimer: next }));
            }}
            title={s.liabilityLabel}
            description={s.liabilityDescription}
            variant="blue"
          />
        </FormCard>

        <AuthPrimaryButton
          label={submitting ? 'Submitting…' : s.submitButton}
          onPress={handleSubmit}
          disabled={!allAccepted || submitting}
          variant="green"
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
