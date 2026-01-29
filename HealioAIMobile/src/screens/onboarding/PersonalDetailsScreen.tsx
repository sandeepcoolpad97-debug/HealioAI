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
  onboardingFlowStrings,
  LANGUAGE_OPTIONS,
} from '../../constants/strings';
import { sharedOnboardingStyles as shared } from './onboardingStyles';

const s = onboardingFlowStrings.personalDetails;

const GENDERS = [
  { key: 'male' as const, label: s.genderMale },
  { key: 'female' as const, label: s.genderFemale },
  { key: 'other' as const, label: s.genderOther },
] as const;

type PersonalDetailsScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({
  navigation,
}) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState<{ label: string; value: string } | null>(null);

  const isValid =
    fullName.trim().length > 0 &&
    /^\d+$/.test(age) &&
    Number(age) > 0 &&
    Number(age) < 150 &&
    gender !== null &&
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    language !== null;

  const handleContinue = () => {
    if (!isValid) return;
    navigation.navigate(navigationRoutes.HealthInfo);
  };

  return (
    <SafeAreaView style={shared.container} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.signInBackground}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
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
            {/* Full Name */}
            <Text style={shared.label}>{s.fullName} *</Text>
            <TextInput
              style={shared.input}
              placeholder={s.fullNamePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            {/* Age */}
            <Text style={[shared.label, styles.fieldSpacer]}>{s.age} *</Text>
            <TextInput
              style={shared.input}
              placeholder={s.agePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={3}
            />

            {/* Gender */}
            <Text style={[shared.label, styles.fieldSpacer]}>{s.gender} *</Text>
            <View style={styles.chipRow}>
              {GENDERS.map((g) => (
                <Pressable
                  key={g.key}
                  onPress={() => setGender(g.key)}
                  style={[
                    styles.chip,
                    gender === g.key && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      gender === g.key && styles.chipTextSelected,
                    ]}
                  >
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Email */}
            <Text style={[shared.label, styles.fieldSpacer]}>{s.email} *</Text>
            <TextInput
              style={shared.input}
              placeholder={s.emailPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Preferred Language — inline chips (no dropdown/modal) */}
            <Text style={[shared.label, styles.fieldSpacer]}>
              {s.preferredLanguage} *
            </Text>
            <View style={styles.chipRow}>
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language?.value === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setLanguage(opt)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              shared.primaryButton,
              isValid
                ? shared.primaryButtonEnabled
                : shared.primaryButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isValid}
            activeOpacity={0.8}
          >
            <Text style={shared.primaryButtonText}>{s.continue}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  fieldSpacer: { marginTop: 20 },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.backgroundOnboardingOne,
  },
  chipSelected: {
    borderColor: colors.primaryText,
    backgroundColor: '#E8F4FD',
  },
  chipText: {
    fontSize: 14,
    color: colors.inputPlaceholderGrey,
  },
  chipTextSelected: {
    color: colors.primaryText,
    fontWeight: '600',
  },
});
