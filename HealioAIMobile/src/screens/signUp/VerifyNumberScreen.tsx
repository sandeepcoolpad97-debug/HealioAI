import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AuthPrimaryButton,
  DividerWithOr,
  FooterLink,
  GoogleSignInButton,
  OTPInput,
  PhoneInput,
  ScreenHeader,
} from '../../components';
import { colors } from '../../constants/colors';
import {
  navigationRoutes,
  signUpStrings,
} from '../../constants/strings';
import { confirmPhoneOtp, getCurrentUser, loginUser, signInWithGoogle } from '../../services';
import { maskPhone } from '../../utils/maskPhone';

/** Parse E.164 phone (e.g. +919876543210) to { countryCode, number }. */
function parsePhoneE164(e164: string): { countryCode: string; number: string } {
  const digits = e164.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length >= 12) {
    return { countryCode: '+91', number: digits.slice(2) };
  }
  return { countryCode: '+91', number: digits };
}

const OTP_LENGTH = 6;

type VerifyNumberScreenProps = {
  navigation: {
    navigate: (route: string, params?: object) => void;
    replace: (route: string, params?: object) => void;
    reset: (state: { index: number; routes: Array<{ name: string; params?: object }> }) => void;
  };
  route: { params?: { phone?: string } };
};

export const VerifyNumberScreen: React.FC<VerifyNumberScreenProps> = ({
  navigation,
  route,
}) => {
  const phone = route.params?.phone ?? '';
  const masked = maskPhone(phone) || '+91 XXXXXX';
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const goToRoleSelection = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: navigationRoutes.RoleSelection }],
    });
  };

  const handleContinue = async () => {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) return;
    setLoadingOtp(true);
    try {
      await confirmPhoneOtp(code);
      const user = getCurrentUser();
      if (!user?.phoneNumber) {
        goToRoleSelection();
        setLoadingOtp(false);
        return;
      }
      const idToken = await user.getIdToken(true);
      const { countryCode, number } = parsePhoneE164(user.phoneNumber);
      try {
        await loginUser({
          firebaseUid: user.uid,
          idToken,
          phone: { countryCode, number },
        });
        navigation.reset({
          index: 0,
          routes: [{ name: navigationRoutes.Home }],
        });
      } catch {
        goToRoleSelection();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid or expired code. Try again.';
      Alert.alert('Error', message);
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setLoadingGoogle(true);
    try {
      await signInWithGoogle();
      const user = getCurrentUser();
      if (!user) {
        goToRoleSelection();
        setLoadingGoogle(false);
        return;
      }
      const idToken = await user.getIdToken(true);
      try {
        await loginUser({
          firebaseUid: user.uid,
          idToken,
          email: user.email ?? undefined,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: navigationRoutes.Home }],
        });
      } catch {
        goToRoleSelection();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed. Try again.';
      Alert.alert('Error', message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate(navigationRoutes.SignIn);
  };

  const canContinue = digits.join('').length === OTP_LENGTH;

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
          <ScreenHeader
            title={signUpStrings.verifyTitle}
            subtitle={`${signUpStrings.verifySubtitlePrefix}${masked}`}
          />

          <PhoneInput
            editable={false}
            value={phone}
            displayValue={masked}
            withShadow
            style={styles.phoneInputWrap}
          />

          <View style={styles.otpWrap}>
            <OTPInput
              length={OTP_LENGTH}
              digits={digits}
              onDigitsChange={setDigits}
            />
          </View>

          <AuthPrimaryButton
            label={signUpStrings.continue}
            onPress={handleContinue}
            disabled={!canContinue || loadingOtp}
          />
          {loadingOtp && (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="small" color={colors.buttonTextOnPrimary} />
            </View>
          )}

          <DividerWithOr text={signUpStrings.or} />

          <GoogleSignInButton
            label={signUpStrings.signInWithGoogle}
            onPress={handleSignInWithGoogle}
            disabled={loadingGoogle}
          />
          {loadingGoogle && (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="small" color={colors.primaryText} />
            </View>
          )}

          <FooterLink
            prefix={signUpStrings.hasAccount}
            linkText={signUpStrings.signIn}
            onPress={handleSignIn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  phoneInputWrap: {
    marginBottom: 24,
  },
  otpWrap: {
    width: '100%',
    marginBottom: 24,
  },
  loaderWrap: {
    marginTop: 8,
    marginBottom: 8,
  },
});
