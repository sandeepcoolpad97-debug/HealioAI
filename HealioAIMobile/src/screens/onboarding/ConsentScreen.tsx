import React, { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        <View style={shared.header}>
          <Text style={shared.title}>{s.title}</Text>
          <Text style={shared.subtitle}>{s.subtitle}</Text>
        </View>

        <View style={shared.card}>
          <Pressable
            onPress={() => setTermsAccepted((v) => !v)}
            style={styles.checkRow}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: termsAccepted }}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
              {termsAccepted && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={colors.buttonTextOnPrimary}
                />
              )}
            </View>
            <Text style={styles.checkLabel}>
              {s.termsPrefix}
              <Text style={styles.link} onPress={openTerms}>
                {s.termsLink}
              </Text>
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setPrivacyAccepted((v) => !v)}
            style={styles.checkRow}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: privacyAccepted }}
          >
            <View style={[styles.checkbox, privacyAccepted && styles.checkboxChecked]}>
              {privacyAccepted && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={colors.buttonTextOnPrimary}
                />
              )}
            </View>
            <Text style={styles.checkLabel}>
              {s.privacyPrefix}
              <Text style={styles.link} onPress={openPrivacy}>
                {s.privacyLink}
              </Text>
            </Text>
          </Pressable>

          <Text style={styles.supportingText}>{s.supportingText}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.finishButton,
            canFinish ? styles.finishButtonEnabled : styles.finishButtonDisabled,
          ]}
          onPress={handleFinish}
          disabled={!canFinish}
          activeOpacity={0.8}
        >
          <Text style={shared.primaryButtonText}>{s.finishSetup}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.chipBorder,
    backgroundColor: colors.backgroundOnboardingOne,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.otpButtonGreen,
    backgroundColor: colors.otpButtonGreen,
  },
  checkLabel: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
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
  finishButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonEnabled: {
    backgroundColor: colors.consentGreen,
  },
  finishButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
});
