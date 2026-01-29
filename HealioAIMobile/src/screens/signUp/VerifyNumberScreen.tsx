import React, { useState } from 'react';
import {
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
import { maskPhone } from '../../utils/maskPhone';

const OTP_LENGTH = 6;

type VerifyNumberScreenProps = {
  navigation: {
    navigate: (route: string) => void;
    replace: (route: string) => void;
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

  const handleContinue = () => {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) return;
    navigation.replace(navigationRoutes.RoleSelection);
  };

  const handleSignInWithGoogle = () => {
    // Placeholder: wire to Google Sign-In
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
            disabled={!canContinue}
          />

          <DividerWithOr text={signUpStrings.or} />

          <GoogleSignInButton
            label={signUpStrings.signInWithGoogle}
            onPress={handleSignInWithGoogle}
          />

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
});
