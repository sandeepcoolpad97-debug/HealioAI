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
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/userSlice';
import { colors } from '../../constants/colors';
import {
  navigationRoutes,
  signInStrings,
} from '../../constants/strings';
import { confirmPhoneOtp, getCurrentUser, loginAsUserOrClinicOrLab, signInWithGoogle } from '../../services';
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

type VerifyOTPScreenProps = {
  navigation: {
    navigate: (route: string, params?: object) => void;
    replace: (route: string, params?: object) => void;
    reset: (state: { index: number; routes: Array<{ name: string; params?: object }> }) => void;
  };
  route: { params?: { phone?: string } };
};

export const VerifyOTPScreen: React.FC<VerifyOTPScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const phone = route.params?.phone ?? '+91 ';
  const masked = maskPhone(phone);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleContinue = async () => {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) return;
    setLoadingOtp(true);
    try {
      await confirmPhoneOtp(code);
      const user = getCurrentUser();
      if (!user?.phoneNumber) {
        navigation.reset({
          index: 0,
          routes: [{ name: navigationRoutes.MainTabs }],
        });
        setLoadingOtp(false);
        return;
      }
      const idToken = await user.getIdToken(true);
      const { countryCode, number } = parsePhoneE164(user.phoneNumber);
      try {
        const res = await loginAsUserOrClinicOrLab({
          firebaseUid: user.uid,
          idToken,
          phone: { countryCode, number },
        });
        
        dispatch(setUser({
          _id: res.data._id as string,
          firebaseUid: user.uid,
          name: res.data.name as string,
          email: res.data.email as string,
          phone: typeof res.data.phone === 'object' ? (res.data.phone as any).number : res.data.phone as string,
          role: res.type as 'user' | 'clinic' | 'lab',
        }));

        navigation.reset({
          index: 0,
          routes: [{ name: navigationRoutes.MainTabs }],
        });
      } catch (loginErr: unknown) {
        const status = (loginErr as { status?: number })?.status;
        if (status === 404) {
          Alert.alert(
            'No account found',
            'Sign up to create an account and complete onboarding.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Up', onPress: () => navigation.navigate(navigationRoutes.CreateAccount) },
            ]
          );
        } else {
          const message = loginErr instanceof Error ? loginErr.message : 'Login failed. Try again.';
          Alert.alert('Error', message);
        }
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
        Alert.alert('Error', 'Sign-in did not complete. Try again.');
        setLoadingGoogle(false);
        return;
      }
      const idToken = await user.getIdToken(true);
      try {
        const res = await loginAsUserOrClinicOrLab({
          firebaseUid: user.uid,
          idToken,
          email: user.email ?? undefined,
        });

        dispatch(setUser({
          _id: res.data._id as string,
          firebaseUid: user.uid,
          name: res.data.name as string,
          email: res.data.email as string,
          role: res.type as 'user' | 'clinic' | 'lab',
        }));

        navigation.reset({
          index: 0,
          routes: [{ name: navigationRoutes.Home }],
        });
      } catch (loginErr: unknown) {
        const status = (loginErr as { status?: number })?.status;
        if (status === 404) {
          Alert.alert(
            'No account found',
            'Sign up to create an account and complete onboarding.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Up', onPress: () => navigation.navigate(navigationRoutes.CreateAccount) },
            ]
          );
        } else {
          const message = loginErr instanceof Error ? loginErr.message : 'Login failed. Try again.';
          Alert.alert('Error', message);
        }
      }
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

  const canContinue = digits.join('').length === OTP_LENGTH;

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
          <ScreenHeader
            title={signInStrings.verifyTitle}
            subtitle={`${signInStrings.verifySubtitle} ${masked}`}
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
            label={signInStrings.continue}
            onPress={handleContinue}
            disabled={!canContinue || loadingOtp}
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
