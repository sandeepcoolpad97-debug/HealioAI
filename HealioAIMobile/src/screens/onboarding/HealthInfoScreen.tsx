import React, { useMemo } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setHealthInfo } from '../../store/onboardingSlice';
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
  const dispatch = useAppDispatch();
  const health = useAppSelector((state) => state.onboarding.health);

  const selectedSet = useMemo(
    () => new Set(health.existingConditions),
    [health.existingConditions]
  );
  const other = health.otherConditions;

  const toggle = (label: string) => {
    let next: string[];
    if (label === 'None') {
      next = ['None'];
    } else {
      const arr = health.existingConditions.filter((c) => c !== 'None');
      if (arr.includes(label)) {
        next = arr.filter((c) => c !== label);
      } else {
        next = [...arr, label];
      }
    }
    dispatch(setHealthInfo({ existingConditions: next }));
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
                  selected={selectedSet.has(label)}
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
              onChangeText={(v) => dispatch(setHealthInfo({ otherConditions: v }))}
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