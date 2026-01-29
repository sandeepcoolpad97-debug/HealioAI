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
} from '../../constants/strings';
import { sharedOnboardingStyles as shared } from './onboardingStyles';

const s = onboardingFlowStrings.healthInfo;

type HealthInfoScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const HealthInfoScreen: React.FC<HealthInfoScreenProps> = ({
  navigation,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [other, setOther] = useState('');

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (label === 'None') {
        next.clear();
        next.add('None');
        return next;
      }
      next.delete('None');
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleContinue = () => {
    navigation.navigate(navigationRoutes.Consent);
  };

  const handleSkip = () => {
    navigation.navigate(navigationRoutes.Consent);
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
            <Text style={styles.question}>{s.question}</Text>
            <ChipRow style={styles.chipWrap}>
              {s.conditions.map((label) => (
                <SelectableChip
                  key={label}
                  label={label}
                  selected={selected.has(label)}
                  onPress={() => toggle(label)}
                />
              ))}
            </ChipRow>
            <Text style={styles.otherLabel}>{s.otherLabel}</Text>
            <TextInput
              style={[shared.input, styles.otherInput]}
              placeholder={s.otherPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              value={other}
              onChangeText={setOther}
              accessibilityLabel={s.otherPlaceholder}
            />
          </FormCard>

          <AuthPrimaryButton
            label={s.continue}
            onPress={handleContinue}
          />

          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [
              styles.skipWrap,
              pressed && styles.skipPressed,
            ]}
          >
            <Text style={styles.skipText}>{s.skip}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  question: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 16,
  },
  chipWrap: { marginBottom: 20 },
  otherLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  otherInput: { marginBottom: 0 },
  skipWrap: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipPressed: { opacity: 0.8 },
  skipText: {
    fontSize: 16,
    color: colors.buttonTextOnPrimary,
  },
});