import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import {
  navigationRoutes,
  signUpStrings,
} from '../../constants/strings';

type CreateAccountScreenProps = {
  navigation: {
    navigate: (route: string, params?: { phone: string }) => void;
  };
};

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  navigation,
}) => {
  const [phone, setPhone] = useState('');

  const handleSendOtp = () => {
    const trimmed = phone.replace(/\D/g, '').slice(-10);
    if (trimmed.length < 10) return;
    navigation.navigate(navigationRoutes.VerifyNumber, {
      phone: `+91 ${trimmed}`,
    });
  };

  const handleSignInWithGoogle = () => {
    // Placeholder: wire to Google Sign-In
  };

  const handleSignIn = () => {
    navigation.navigate(navigationRoutes.SignIn);
  };

  const trimmedPhone = phone.replace(/\D/g, '').slice(-10);
  const canSendOtp = trimmedPhone.length === 10;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.signInBackground}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{signUpStrings.createTitle}</Text>
          <Text style={styles.subtitle}>{signUpStrings.createSubtitle}</Text>

          <View style={styles.inputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>
                {signUpStrings.countryCode}
              </Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder={signUpStrings.phonePlaceholder}
              placeholderTextColor={colors.inputPlaceholderGrey}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={14}
              accessibilityLabel={signUpStrings.phonePlaceholder}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, !canSendOtp && styles.primaryDisabled]}
            onPress={handleSendOtp}
            disabled={!canSendOtp}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {signUpStrings.sendOtp}
            </Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{signUpStrings.or}</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleSignInWithGoogle}
            activeOpacity={0.8}
          >
            <Text style={styles.googleButtonText}>
              {signUpStrings.signInWithGoogle}
            </Text>
          </TouchableOpacity>

          <Pressable
            onPress={handleSignIn}
            style={({ pressed }) => [
              styles.footerWrap,
              pressed && styles.footerPressed,
            ]}
          >
            <Text style={styles.footerText}>
              {signUpStrings.hasAccount}
              <Text style={styles.footerLink}> {signUpStrings.signIn}</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const inputShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.signInBackground,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 15,
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 12,
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    minHeight: 52,
    backgroundColor: colors.backgroundOnboardingOne,
    ...inputShadow,
  },
  countryCode: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.countryCodeBg,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.countryCodeText,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.backgroundOnboardingOne,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.otpButtonGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  primaryDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.buttonTextOnPrimary,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.buttonTextOnPrimary,
    opacity: 0.6,
  },
  orText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.buttonTextOnPrimary,
    marginHorizontal: 16,
  },
  googleButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.backgroundOnboardingOne,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
  },
  footerWrap: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerPressed: {
    opacity: 0.8,
  },
  footerText: {
    fontSize: 16,
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
  },
  footerLink: {
    fontWeight: '600',
  },
});
