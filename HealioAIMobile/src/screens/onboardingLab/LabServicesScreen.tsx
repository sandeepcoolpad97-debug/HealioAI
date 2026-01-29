import React, { useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AuthPrimaryButton,
  CheckboxRow,
  ChipRow,
  FormCard,
  FormInput,
  SelectableChip,
  ScreenHeader,
} from '../../components';
import { colors } from '../../constants/colors';
import {
  labOnboardingStrings,
  navigationRoutes,
} from '../../constants/strings';
import { sharedLabOnboardingStyles as shared } from './labOnboardingStyles';
import {
  labSectionTitleStyles,
  labAddTestCategoryStyles,
  labRemoveTestCategoryStyles,
} from './labOnboardingStyles';

const s = labOnboardingStrings.services;

type LabTestCategoryEntry = {
  id: string;
  testName: string;
};

type LabServicesScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

let testCategoryIdCounter = 0;
const nextTestCategoryId = () => `test-category-${++testCategoryIdCounter}`;

export const LabServicesScreen: React.FC<LabServicesScreenProps> = ({
  navigation,
}) => {
  const [testCategoryEntries, setTestCategoryEntries] = useState<
    LabTestCategoryEntry[]
  >([{ id: nextTestCategoryId(), testName: '' }]);
  const [homeSampleCollection, setHomeSampleCollection] = useState<
    'yes' | 'no' | null
  >(null);
  const [pdfSelected, setPdfSelected] = useState(false);
  const [digitalSelected, setDigitalSelected] = useState(false);

  const addTestCategory = useCallback(() => {
    setTestCategoryEntries((prev) => [
      ...prev,
      { id: nextTestCategoryId(), testName: '' },
    ]);
  }, []);

  const removeTestCategory = useCallback((id: string) => {
    setTestCategoryEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateTestCategory = useCallback(
    (id: string, field: keyof LabTestCategoryEntry, value: string) => {
      setTestCategoryEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  const handleContinue = () => {
    navigation.navigate(navigationRoutes.LabTermsConsents);
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
            <Text style={labSectionTitleStyles.text}>{s.testsList}</Text>
            {testCategoryEntries.map((entry) => (
              <View key={entry.id} style={styles.testCategoryCard}>
                <FormInput
                  label="Test Name"
                  value={entry.testName}
                  onChangeText={(value) =>
                    updateTestCategory(entry.id, 'testName', value)
                  }
                  placeholder={s.testNamePlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                />
                <Pressable
                  onPress={() => removeTestCategory(entry.id)}
                  style={labRemoveTestCategoryStyles.row}
                  accessibilityRole="button"
                  accessibilityLabel={s.removeTest}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#DC2626"
                  />
                  <Text style={labRemoveTestCategoryStyles.text}>
                    {s.removeTest}
                  </Text>
                </Pressable>
              </View>
            ))}

            <Pressable
              onPress={addTestCategory}
              style={labAddTestCategoryStyles.button}
              accessibilityRole="button"
              accessibilityLabel={s.addTest}
            >
              <Text style={labAddTestCategoryStyles.text}>{s.addTest}</Text>
            </Pressable>

            <Text style={labSectionTitleStyles.text}>
              {s.homeSampleCollection}
            </Text>
            <ChipRow gap={10}>
              <SelectableChip
                label={s.homeSampleYes}
                selected={homeSampleCollection === 'yes'}
                onPress={() =>
                  setHomeSampleCollection((v) => (v === 'yes' ? null : 'yes'))
                }
                variant="green"
              />
              <SelectableChip
                label={s.homeSampleNo}
                selected={homeSampleCollection === 'no'}
                onPress={() =>
                  setHomeSampleCollection((v) => (v === 'no' ? null : 'no'))
                }
                variant="green"
              />
            </ChipRow>

            <Text style={labSectionTitleStyles.text}>
              {s.reportDeliveryType}
            </Text>
            <CheckboxRow
              checked={pdfSelected}
              onToggle={() => setPdfSelected((v) => !v)}
              label={s.reportPdf}
              variant="blue"
            />
            <CheckboxRow
              checked={digitalSelected}
              onToggle={() => setDigitalSelected((v) => !v)}
              label={s.reportDigital}
              variant="blue"
            />
          </FormCard>

          <AuthPrimaryButton label={s.continue} onPress={handleContinue} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  testCategoryCard: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.chipBorder,
  },
});
