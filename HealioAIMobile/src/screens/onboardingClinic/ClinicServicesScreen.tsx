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
  FormCard,
  FormInput,
  ScreenHeader,
} from '../../components';
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
  const [doctorName, setDoctorName] = useState('');
  const [specializations, setSpecializations] = useState<SpecializationEntry[]>([
    { id: nextSpecializationId(), name: '' },
  ]);
  const [inPersonConsultation, setInPersonConsultation] = useState(true);

  const addSpecialization = useCallback(() => {
    setSpecializations((prev) => [...prev, { id: nextSpecializationId(), name: '' }]);
  }, []);

  const removeSpecialization = useCallback((id: string) => {
    setSpecializations((prev) => prev.filter((spec) => spec.id !== id));
  }, []);

  const updateSpecialization = useCallback((id: string, value: string) => {
    setSpecializations((prev) =>
      prev.map((spec) => (spec.id === id ? { ...spec, name: value } : spec))
    );
  }, []);

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
              value={doctorName}
              onChangeText={setDoctorName}
              placeholder={detailsStrings.doctorNamePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />

            <Text style={clinicSectionTitleStyles.text}>{detailsStrings.specializations}</Text>
            {specializations.map((specialization) => (
              <View key={specialization.id} style={styles.entryCard}>
                <FormInput
                  label="Specialization"
                  value={specialization.name}
                  onChangeText={(value) => updateSpecialization(specialization.id, value)}
                  placeholder={detailsStrings.specializationPlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                />
                <Pressable
                  onPress={() => removeSpecialization(specialization.id)}
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
              checked={inPersonConsultation}
              onToggle={() => setInPersonConsultation((v) => !v)}
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
