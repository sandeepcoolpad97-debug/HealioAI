import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
} from '../../components';
import { colors } from '../../constants/colors';
import { navigationRoutes, signInStrings } from '../../constants/strings';
import {
  formatPhoneE164,
  sendPhoneOtp,
  signInWithGoogle,
} from '../../services';

type SignInScreenProps = {
  navigation: {
    navigate: (route: string, params?: { phone: string }) => void;
    reset: (state: { index: number; routes: Array<{ name: string; params?: object }> }) => void;
  };
};

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleSendOtp = async () => {
    const trimmed = phone.replace(/\D/g, '').slice(-10);
    if (trimmed.length < 10) return;
    const phoneE164 = formatPhoneE164(phone, '+91');
    setLoadingOtp(true);
    try {
      await sendPhoneOtp(phoneE164);
      navigation.navigate(navigationRoutes.VerifyOTP, {
        phone: `+91 ${trimmed}`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP. Try again.';
      Alert.alert('Error', message);
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setLoadingGoogle(true);
    try {
      await signInWithGoogle();
      navigation.reset({
        index: 0,
        routes: [{ name: navigationRoutes.Home }],
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed. Try again.';
      Alert.alert('Error', message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate(navigationRoutes.CreateAccount);
  };

  const trimmedPhone = phone.replace(/\D/g, '').slice(-10);
  const canSendOtp = trimmedPhone.length === 10;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.signInBackground} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{signInStrings.title}</Text>
          <Text style={styles.subtitle}>{signInStrings.subtitle}</Text>

          <PhoneInput
            value={phone}
            onChangeText={setPhone}
            placeholder={signInStrings.phonePlaceholder}
            placeholderTextColor={colors.inputPlaceholder}
            accessibilityLabel={signInStrings.phonePlaceholder}
            style={styles.phoneInputWrap}
          />

          <AuthPrimaryButton
            label={signInStrings.sendOtp}
            onPress={handleSendOtp}
            disabled={!canSendOtp || loadingOtp}
          />
          {loadingOtp && (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="small" color={colors.buttonTextOnPrimary} />
            </View>
          )}

          <DividerWithOr text={signInStrings.or} />

          <GoogleSignInButton
            label={signInStrings.signInWithGoogle}
            onPress={handleSignInWithGoogle}
            disabled={loadingGoogle}
          />
          {loadingGoogle && (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="small" color={colors.primaryText} />
            </View>
          )}

          <FooterLink
            prefix="Don't have an account? "
            linkText="Sign Up"
            onPress={handleSignUp}
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
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
    lineHeight: 24,
  },
  phoneInputWrap: {
    marginBottom: 24,
  },
  loaderWrap: {
    marginTop: 8,
    marginBottom: 8,
  },
});
