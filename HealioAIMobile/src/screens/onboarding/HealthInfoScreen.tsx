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
          <View style={shared.header}>
            <Text style={shared.title}>{s.title}</Text>
            <Text style={shared.subtitle}>{s.subtitle}</Text>
          </View>

          <View style={shared.card}>
            <Text style={styles.question}>{s.question}</Text>
            <View style={styles.chipWrap}>
              {s.conditions.map((label) => (
                <Pressable
                  key={label}
                  onPress={() => toggle(label)}
                  style={[
                    styles.chip,
                    selected.has(label) && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected.has(label) && styles.chipTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.otherLabel}>{s.otherLabel}</Text>
            <TextInput
              style={[shared.input, styles.otherInput]}
              placeholder={s.otherPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              value={other}
              onChangeText={setOther}
              accessibilityLabel={s.otherPlaceholder}
            />
          </View>

          <TouchableOpacity
            style={[shared.primaryButton, shared.primaryButtonEnabled]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={shared.primaryButtonText}>{s.continue}</Text>
          </TouchableOpacity>

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
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
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
  otherLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  otherInput: {
    marginBottom: 0,
  },
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
