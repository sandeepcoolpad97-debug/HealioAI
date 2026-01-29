import React, { useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AuthPrimaryButton,
  CheckboxRow,
  ChipRow,
  FormCard,
  SelectableChip,
  ScreenHeader,
} from '../../components';
import { colors } from '../../constants/colors';
import {
  labOnboardingStrings,
  navigationRoutes,
} from '../../constants/strings';
import { sharedLabOnboardingStyles as shared } from './labOnboardingStyles';
import { labSectionTitleStyles } from './labOnboardingStyles';

const s = labOnboardingStrings.services;
const CATEGORIES = s.categoryOptions;

type LabServicesScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const LabServicesScreen: React.FC<LabServicesScreenProps> = ({
  navigation,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [homeSampleCollection, setHomeSampleCollection] = useState<'yes' | 'no' | null>(null);
  const [pdfSelected, setPdfSelected] = useState(false);
  const [digitalSelected, setDigitalSelected] = useState(false);

  const toggleCategory = useCallback((label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((x) => x !== label)
        : [...prev, label]
    );
  }, []);

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
            <Text style={labSectionTitleStyles.text}>{s.testCategories}</Text>
            <ChipRow gap={10}>
              {CATEGORIES.map((label) => (
                <SelectableChip
                  key={label}
                  label={label}
                  selected={selectedCategories.includes(label)}
                  onPress={() => toggleCategory(label)}
                  variant="green"
                />
              ))}
            </ChipRow>

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
});
