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
  ScreenHeader,
} from '../../components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setClinicServices } from '../../store/clinicOnboardingSlice';
import { colors } from '../../constants/colors';
import {
  clinicOnboardingStrings,
  navigationRoutes,
} from '../../constants/strings';
import { sharedClinicOnboardingStyles as shared } from './clinicOnboardingStyles';
import {
  clinicSectionTitleStyles,
  clinicAddDoctorStyles,
  clinicRemoveDoctorStyles,
} from './clinicOnboardingStyles';

const s = clinicOnboardingStrings.services;
const detailsStrings = clinicOnboardingStrings.details;

type SpecializationEntry = {
  id: string;
  name: string;
};

let specializationIdCounter = 0;
const nextSpecializationId = () => `specialization-${++specializationIdCounter}`;

type ClinicServicesScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const ClinicServicesScreen: React.FC<ClinicServicesScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const services = useAppSelector((s) => s.clinicOnboarding.services);

  const specializationsList = services.specialisations.length
    ? services.specialisations.map((name, i) => ({ id: `spec-${i}`, name }))
    : [{ id: nextSpecializationId(), name: '' }];

  const addSpecialization = useCallback(() => {
    dispatch(setClinicServices({
      specialisations: [...services.specialisations, ''],
    }));
  }, [dispatch, services.specialisations]);

  const removeSpecialization = useCallback((index: number) => {
    const next = services.specialisations.filter((_, i) => i !== index);
    dispatch(setClinicServices({ specialisations: next }));
  }, [dispatch, services.specialisations]);

  const updateSpecialization = useCallback((index: number, value: string) => {
    const next = [...services.specialisations];
    if (index >= next.length) next.push(value);
    else next[index] = value;
    dispatch(setClinicServices({ specialisations: next }));
  }, [dispatch, services.specialisations]);

  const handleContinue = () => {
    navigation.navigate(navigationRoutes.ClinicTermsConsents);
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
            <FormInput
              label={detailsStrings.doctorName}
              value={services.doctorName}
              onChangeText={(v) => dispatch(setClinicServices({ doctorName: v }))}
              placeholder={detailsStrings.doctorNamePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />

            <Text style={clinicSectionTitleStyles.text}>{detailsStrings.specializations}</Text>
            {specializationsList.map((specialization, index) => (
              <View key={specialization.id} style={styles.entryCard}>
                <FormInput
                  label="Specialization"
                  value={specialization.name}
                  onChangeText={(value) => updateSpecialization(index, value)}
                  placeholder={detailsStrings.specializationPlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                />
                <Pressable
                  onPress={() => removeSpecialization(index)}
                  style={clinicRemoveDoctorStyles.row}
                  accessibilityRole="button"
                  accessibilityLabel={detailsStrings.removeSpecialization}
                >
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  <Text style={clinicRemoveDoctorStyles.text}>{detailsStrings.removeSpecialization}</Text>
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={addSpecialization}
              style={clinicAddDoctorStyles.button}
              accessibilityRole="button"
              accessibilityLabel={detailsStrings.addSpecialization}
            >
              <Text style={clinicAddDoctorStyles.text}>{detailsStrings.addSpecialization}</Text>
            </Pressable>

            <Text style={clinicSectionTitleStyles.text}>{s.consultationType}</Text>
            <CheckboxRow
              checked={services.consultationType === 'in_person'}
              onToggle={() =>
                dispatch(setClinicServices({
                  consultationType: services.consultationType === 'in_person' ? 'both' : 'in_person',
                }))
              }
              label={s.inPersonConsultation}
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
  entryCard: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.chipBorder,
  },
});
