import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AuthPrimaryButton,
  ChipRow,
  FormCard,
  SelectableChip,
  ScreenHeader,
} from '../../components';
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
          <ScreenHeader title={s.title} subtitle={s.subtitle} />

          <FormCard>
            <Text style={shared.label}>{s.fullName} *</Text>
            <TextInput
              style={shared.input}
              placeholder={s.fullNamePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

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

            <Text style={[shared.label, styles.fieldSpacer]}>{s.gender} *</Text>
            <ChipRow>
              {GENDERS.map((g) => (
                <SelectableChip
                  key={g.key}
                  label={g.label}
                  selected={gender === g.key}
                  onPress={() => setGender(g.key)}
                />
              ))}
            </ChipRow>

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

            <Text style={[shared.label, styles.fieldSpacer]}>
              {s.preferredLanguage} *
            </Text>
            <ChipRow>
              {LANGUAGE_OPTIONS.map((opt) => (
                <SelectableChip
                  key={opt.value}
                  label={opt.label}
                  selected={language?.value === opt.value}
                  onPress={() => setLanguage(opt)}
                />
              ))}
            </ChipRow>
          </FormCard>

          <AuthPrimaryButton
            label={s.continue}
            onPress={handleContinue}
            disabled={!isValid}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  fieldSpacer: { marginTop: 20 },
});
