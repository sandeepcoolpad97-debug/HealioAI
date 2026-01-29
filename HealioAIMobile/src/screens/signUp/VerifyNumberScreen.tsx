import React, { useCallback, useRef, useState } from 'react';
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

const OTP_LENGTH = 6;

type VerifyNumberScreenProps = {
  navigation: {
    navigate: (route: string) => void;
    replace: (route: string) => void;
  };
  route: { params?: { phone?: string } };
};

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length <= 4) return phone;
  return `+91 XXXXXX${digits.slice(-4)}`;
}

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

export const VerifyNumberScreen: React.FC<VerifyNumberScreenProps> = ({
  navigation,
  route,
}) => {
  const phone = route.params?.phone ?? '';
  const masked = maskPhone(phone) || '+91 XXXXXX';
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const refs = useRef<(TextInput | null)[]>([]);

  const updateOtp = useCallback((index: number, value: string) => {
    if (value.length > 1) {
      const chars = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      setOtp((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => {
          if (index + i < OTP_LENGTH) next[index + i] = c;
        });
        return next;
      });
      const nextIdx = Math.min(index + chars.length, OTP_LENGTH - 1);
      refs.current[nextIdx]?.focus();
      return;
    }
    setOtp((prev) => {
      const next = [...prev];
      next[index] = value.replace(/\D/g, '');
      return next;
    });
    if (value && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === 'Backspace' && !otp[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleContinue = () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) return;
    // Placeholder: verify OTP with backend, then navigate to Role Selection
    navigation.replace(navigationRoutes.RoleSelection);
  };

  const handleSignInWithGoogle = () => {
    // Placeholder: wire to Google Sign-In
  };

  const handleSignIn = () => {
    navigation.navigate(navigationRoutes.SignIn);
  };

  const code = otp.join('');
  const canContinue = code.length === OTP_LENGTH;

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
          <Text style={styles.title}>{signUpStrings.verifyTitle}</Text>
          <Text style={styles.subtitle}>
            {signUpStrings.verifySubtitlePrefix}{masked}
          </Text>

          <View style={styles.inputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>
                {signUpStrings.countryCode}
              </Text>
            </View>
            <View style={styles.phoneDisplay}>
              <Text style={styles.phoneDisplayText}>{masked}</Text>
            </View>
          </View>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(v) => updateOtp(index, v)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(index, nativeEvent.key)
                }
                keyboardType="number-pad"
                maxLength={index === 0 ? OTP_LENGTH : 1}
                selectTextOnFocus
                accessibilityLabel={`Digit ${index + 1} of ${OTP_LENGTH}`}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, !canContinue && styles.primaryDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {signUpStrings.continue}
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
    marginBottom: 28,
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
  phoneDisplay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  phoneDisplayText: {
    fontSize: 16,
    color: colors.inputPlaceholderGrey,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    gap: 10,
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 56,
    borderRadius: 12,
    backgroundColor: colors.backgroundOnboardingOne,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
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
