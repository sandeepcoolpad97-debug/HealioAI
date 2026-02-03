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
import { setClinicConsents, resetClinicOnboarding } from '../../store/clinicOnboardingSlice';
import { getCurrentUser } from '../../services/auth.service';
import { createClinic } from '../../services/api.service';
import { colors } from '../../constants/colors';
import {
  clinicOnboardingStrings,
  navigationRoutes,
} from '../../constants/strings';
import { sharedClinicOnboardingStyles as shared } from './clinicOnboardingStyles';

const s = clinicOnboardingStrings.termsConsents;

type ClinicTermsConsentsScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const ClinicTermsConsentsScreen: React.FC<ClinicTermsConsentsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const clinicOnboarding = useAppSelector((s) => s.clinicOnboarding);
  const roleId = useAppSelector((s) => s.onboarding.roleId);

  const [termsAccepted, setTermsAccepted] = useState(clinicOnboarding.consents.termsAndConditions);
  const [consentAccepted, setConsentAccepted] = useState(clinicOnboarding.consents.policyTerms);
  const [liabilityAccepted, setLiabilityAccepted] = useState(clinicOnboarding.consents.medicalDisclaimer);
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
      Alert.alert('Error', 'Missing role. Please go back and select clinic.');
      return;
    }
    const d = clinicOnboarding.details;
    const svc = clinicOnboarding.services;
    if (!d.clinicName.trim() || !d.registrationNumber.trim() || !d.contactNumber.trim() || !svc.doctorName.trim()) {
      Alert.alert('Error', 'Please complete clinic details and doctor name.');
      return;
    }
    setSubmitting(true);
    try {
      const establishmentDateRaw = d.establishmentDate?.trim();
      let establishmentDate: string | undefined;
      if (establishmentDateRaw) {
        const parsed = new Date(establishmentDateRaw);
        if (!Number.isNaN(parsed.getTime())) {
          establishmentDate = parsed.toISOString();
        }
      }
      await createClinic({
        firebaseUid: user.uid,
        clinicName: d.clinicName.trim(),
        registrationNumber: d.registrationNumber.trim(),
        roleId,
        address: d.address?.trim() || undefined,
        establishmentDate,
        contactNumber: d.contactNumber.trim(),
        emailId: d.email?.trim() || undefined,
        operatingHours: [],
        specialisation: svc.specialisations.filter((x) => x?.trim()).map((x) => x.trim()),
        consultationType: svc.consultationType,
        doctorName: svc.doctorName.trim(),
        consents: {
          termsAndConditions: true as const,
          policyTerms: true as const,
          medicalDisclaimer: true as const,
        },
      });
      dispatch(resetClinicOnboarding());
      navigation.navigate(navigationRoutes.ClinicProfileSubmitted);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit clinic. Try again.';
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
              dispatch(setClinicConsents({ termsAndConditions: next }));
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
              dispatch(setClinicConsents({ policyTerms: next }));
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
              dispatch(setClinicConsents({ medicalDisclaimer: next }));
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
