import React, { useCallback } from 'react';
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
  FormCard,
  FormInput,
  SelectableChip,
  ScreenHeader,
} from '../../components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLabServices } from '../../store/labOnboardingSlice';
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

type LabServicesScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const LabServicesScreen: React.FC<LabServicesScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const services = useAppSelector((s) => s.labOnboarding.services);

  const addTestCategory = useCallback(() => {
    dispatch(setLabServices({
      testCategories: [...services.testCategories, ''],
    }));
  }, [dispatch, services.testCategories]);

  const removeTestCategory = useCallback((index: number) => {
    const next = services.testCategories.filter((_, i) => i !== index);
    dispatch(setLabServices({ testCategories: next }));
  }, [dispatch, services.testCategories]);

  const updateTestCategory = useCallback((index: number, value: string) => {
    const next = [...services.testCategories];
    if (index >= next.length) next.push(value);
    else next[index] = value;
    dispatch(setLabServices({ testCategories: next }));
  }, [dispatch, services.testCategories]);

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
            {(services.testCategories.length ? services.testCategories : ['']).map((name, index) => (
              <View key={`test-${index}`} style={styles.testCategoryCard}>
                <FormInput
                  label="Test Name"
                  value={name}
                  onChangeText={(value) => updateTestCategory(index, value)}
                  placeholder={s.testNamePlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                />
                <Pressable
                  onPress={() => removeTestCategory(index)}
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

            <View style={styles.verticalChipGroup}>
              <SelectableChip
                label={s.homeSampleYes}
                selected={services.homeSampleCollection === true}
                onPress={() =>
                  dispatch(setLabServices({
                    homeSampleCollection: true,
                  }))
                }
                variant="green"
              />

              <SelectableChip
                label={s.homeSampleNo}
                selected={services.homeSampleCollection === false}
                onPress={() =>
                  dispatch(setLabServices({
                    homeSampleCollection: false,
                  }))
                }
                variant="green"
              />
            </View>


            <Text style={labSectionTitleStyles.text}>
              {s.reportDeliveryType}
            </Text>

            <CheckboxRow
              checked={services.reportDeliveryType.includes('pdf')}
              onToggle={() => {
                const next = services.reportDeliveryType.includes('pdf')
                  ? services.reportDeliveryType.filter((x) => x !== 'pdf')
                  : [...services.reportDeliveryType, 'pdf'];
                dispatch(setLabServices({ reportDeliveryType: next }));
              }}
              label={s.reportPdf}
              variant="blue"
              style={styles.checkboxContainer}
            />

            <CheckboxRow
              checked={services.reportDeliveryType.includes('in_app')}
              onToggle={() => {
                const next = services.reportDeliveryType.includes('in_app')
                  ? services.reportDeliveryType.filter((x) => x !== 'in_app')
                  : [...services.reportDeliveryType, 'in_app'];
                dispatch(setLabServices({ reportDeliveryType: next }));
              }}
              label={s.reportDigital}
              variant="blue"
              style={styles.checkboxContainer}
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

  verticalChipGroup: {
    gap: 12,
    marginBottom: 8,
  },

  checkboxContainer: {
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

});
