import React, { useState } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AuthPrimaryButton,
  ConsentRow,
  FormCard,
  ScreenHeader,
} from '../../components';
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [liabilityAccepted, setLiabilityAccepted] = useState(false);

  const allAccepted = termsAccepted && consentAccepted && liabilityAccepted;

  const handleSubmit = () => {
    if (!allAccepted) return;
    navigation.navigate(navigationRoutes.ClinicProfileSubmitted);
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
            onToggle={() => setTermsAccepted((v) => !v)}
            title={s.termsLabel}
            description={s.termsDescription}
            linkText={s.viewFullTerms}
            onLinkPress={handleViewTerms}
            variant="blue"
          />
          <ConsentRow
            checked={consentAccepted}
            onToggle={() => setConsentAccepted((v) => !v)}
            title={s.consentLabel}
            description={s.consentDescription}
            variant="blue"
          />
          <ConsentRow
            checked={liabilityAccepted}
            onToggle={() => setLiabilityAccepted((v) => !v)}
            title={s.liabilityLabel}
            description={s.liabilityDescription}
            variant="blue"
          />
        </FormCard>

        <AuthPrimaryButton
          label={s.submitButton}
          onPress={handleSubmit}
          disabled={!allAccepted}
          variant="green"
        />
      </ScrollView>
    </SafeAreaView>
  );
};
