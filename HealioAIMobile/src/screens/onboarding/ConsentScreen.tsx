import React, { useState } from 'react';
import {
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const canFinish = termsAccepted && privacyAccepted;

  const handleFinish = () => {
    if (!canFinish) return;
    navigation.replace(navigationRoutes.OnboardingSuccess);
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
            onToggle={() => setTermsAccepted((v) => !v)}
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
            onToggle={() => setPrivacyAccepted((v) => !v)}
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
          label={s.finishSetup}
          onPress={handleFinish}
          disabled={!canFinish}
        />
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
