import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AuthPrimaryButton,
  DividerWithOr,
  FooterLink,
  GoogleSignInButton,
  PhoneInput,
  ScreenHeader,
} from '../../components';
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
          <ScreenHeader
            title={signUpStrings.createTitle}
            subtitle={signUpStrings.createSubtitle}
          />

          <PhoneInput
            value={phone}
            onChangeText={setPhone}
            placeholder={signUpStrings.phonePlaceholder}
            placeholderTextColor={colors.inputPlaceholderGrey}
            withShadow
            accessibilityLabel={signUpStrings.phonePlaceholder}
            style={styles.phoneInputWrap}
          />

          <AuthPrimaryButton
            label={signUpStrings.sendOtp}
            onPress={handleSendOtp}
            disabled={!canSendOtp}
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
});
