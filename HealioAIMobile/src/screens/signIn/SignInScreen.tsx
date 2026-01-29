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
import { navigationRoutes, signInStrings } from '../../constants/strings';

type SignInScreenProps = {
  navigation: {
    navigate: (route: string, params?: { phone: string }) => void;
  };
};

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  const handleSendOtp = () => {
    const trimmed = phone.replace(/\D/g, '').slice(-10);
    if (trimmed.length < 10) return;
    navigation.navigate(navigationRoutes.VerifyOTP, {
      phone: `+91 ${trimmed}`,
    });
  };

  const handleSignInWithGoogle = () => {
    // Placeholder: wire to Google Sign-In
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

          {/* Phone input: country code + number */}
          <View style={styles.inputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>
                {signInStrings.countryCode}
              </Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder={signInStrings.phonePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={14}
              accessibilityLabel={signInStrings.phonePlaceholder}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, !canSendOtp && styles.primaryDisabled]}
            onPress={handleSendOtp}
            disabled={!canSendOtp}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>{signInStrings.sendOtp}</Text>
          </TouchableOpacity>

          {/* OR divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{signInStrings.or}</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleSignInWithGoogle}
            activeOpacity={0.8}
          >
            <Text style={styles.googleButtonText}>
              {signInStrings.signInWithGoogle}
            </Text>
          </TouchableOpacity>

          <Pressable
            onPress={handleSignUp}
            style={({ pressed }) => [
              styles.signUpWrap,
              pressed && styles.signUpPressed,
            ]}
          >
            <Text style={styles.signUpText}>{signInStrings.noAccount}</Text>
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
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    minHeight: 52,
    backgroundColor: colors.backgroundOnboardingOne,
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
  signUpWrap: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  signUpPressed: {
    opacity: 0.8,
  },
  signUpText: {
    fontSize: 16,
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
  },
});
