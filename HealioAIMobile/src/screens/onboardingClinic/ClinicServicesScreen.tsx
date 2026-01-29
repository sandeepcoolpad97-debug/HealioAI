import React, { useState, useCallback } from 'react';
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
  clinicOnboardingStrings,
  navigationRoutes,
} from '../../constants/strings';
import { sharedClinicOnboardingStyles as shared } from './clinicOnboardingStyles';
import {
  clinicAddDoctorStyles,
  clinicRemoveDoctorStyles,
  clinicSectionTitleStyles,
} from './clinicOnboardingStyles';

const s = clinicOnboardingStrings.services;
const SPECIALIZATIONS = s.specializationOptions;

type DoctorEntry = {
  id: string;
  name: string;
  specialization: string;
};

type ClinicServicesScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

let doctorIdCounter = 0;
const nextDoctorId = () => `doctor-${++doctorIdCounter}`;

export const ClinicServicesScreen: React.FC<ClinicServicesScreenProps> = ({
  navigation,
}) => {
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    readonly string[]
  >(['General Medicine']);
  const [inPersonConsultation, setInPersonConsultation] = useState(true);
  const [doctors, setDoctors] = useState<DoctorEntry[]>([
    { id: nextDoctorId(), name: '', specialization: '' },
  ]);

  const toggleSpecialization = useCallback((label: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(label)
        ? prev.filter((x) => x !== label)
        : [...prev, label]
    );
  }, []);

  const addDoctor = useCallback(() => {
    setDoctors((prev) => [
      ...prev,
      { id: nextDoctorId(), name: '', specialization: '' },
    ]);
  }, []);

  const removeDoctor = useCallback((id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateDoctor = useCallback(
    (id: string, field: keyof DoctorEntry, value: string) => {
      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
      );
    },
    []
  );

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
            <Text style={clinicSectionTitleStyles.text}>{s.specializations}</Text>
            <ChipRow gap={10}>
              {SPECIALIZATIONS.map((label) => (
                <SelectableChip
                  key={label}
                  label={label}
                  selected={selectedSpecializations.includes(label)}
                  onPress={() => toggleSpecialization(label)}
                  variant="green"
                />
              ))}
            </ChipRow>

            <Text style={clinicSectionTitleStyles.text}>{s.consultationType}</Text>
            <CheckboxRow
              checked={inPersonConsultation}
              onToggle={() => setInPersonConsultation((v) => !v)}
              label={s.inPersonConsultation}
              variant="blue"
            />

            <Text style={clinicSectionTitleStyles.text}>{s.doctorsList}</Text>
            {doctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <FormInput
                  label="Doctor Name"
                  value={doctor.name}
                  onChangeText={(value) =>
                    updateDoctor(doctor.id, 'name', value)
                  }
                  placeholder={s.doctorNamePlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                />
                <FormInput
                  label="Specialization"
                  value={doctor.specialization}
                  onChangeText={(value) =>
                    updateDoctor(doctor.id, 'specialization', value)
                  }
                  placeholder={s.specializationPlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                />
                <Pressable
                  onPress={() => removeDoctor(doctor.id)}
                  style={clinicRemoveDoctorStyles.row}
                  accessibilityRole="button"
                  accessibilityLabel={s.removeDoctor}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#DC2626"
                  />
                  <Text style={clinicRemoveDoctorStyles.text}>
                    {s.removeDoctor}
                  </Text>
                </Pressable>
              </View>
            ))}

            <Pressable
              onPress={addDoctor}
              style={clinicAddDoctorStyles.button}
              accessibilityRole="button"
              accessibilityLabel={s.addDoctor}
            >
              <Text style={clinicAddDoctorStyles.text}>{s.addDoctor}</Text>
            </Pressable>
          </FormCard>

          <AuthPrimaryButton label={s.continue} onPress={handleContinue} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  doctorCard: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.chipBorder,
  },
});
