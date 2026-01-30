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
  FormCard,
  FormInput,
  PhoneInput,
  ScreenHeader,
} from '../../components';
import { colors } from '../../constants/colors';
import { clinicOnboardingStrings, navigationRoutes } from '../../constants/strings';
import { sharedClinicOnboardingStyles as shared } from './clinicOnboardingStyles';
import {
  clinicSectionTitleStyles,
  clinicAddDoctorStyles,
  clinicRemoveDoctorStyles,
} from './clinicOnboardingStyles';

const s = clinicOnboardingStrings.details;

type SpecializationEntry = {
  id: string;
  name: string;
};

type ClinicDetailsScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

let specializationIdCounter = 0;
const nextSpecializationId = () => `specialization-${++specializationIdCounter}`;

export const ClinicDetailsScreen: React.FC<ClinicDetailsScreenProps> = ({
  navigation,
}) => {
  const [clinicName, setClinicName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specializations, setSpecializations] = useState<SpecializationEntry[]>([
    { id: nextSpecializationId(), name: '' },
  ]);

  const addSpecialization = useCallback(() => {
    setSpecializations((prev) => [...prev, { id: nextSpecializationId(), name: '' }]);
  }, []);

  const removeSpecialization = useCallback((id: string) => {
    setSpecializations((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSpecialization = useCallback((id: string, value: string) => {
    setSpecializations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: value } : s))
    );
  }, []);

  const handleContinue = () => {
    navigation.navigate(navigationRoutes.ClinicServices);
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
              label={s.clinicName}
              value={clinicName}
              onChangeText={setClinicName}
              placeholder={s.clinicNamePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />
            <FormInput
              label={s.registrationNumber}
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              placeholder={s.registrationPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />
            <Text style={shared.label}>{s.contactNumber}</Text>
            <PhoneInput
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder={s.contactPlaceholder}
              countryCode="+91"
              style={styles.phoneSpacer}
            />
            <FormInput
              label={s.email}
              value={email}
              onChangeText={setEmail}
              placeholder={s.emailPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormInput
              label={s.doctorName}
              value={doctorName}
              onChangeText={setDoctorName}
              placeholder={s.doctorNamePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />

            <Text style={clinicSectionTitleStyles.text}>{s.specializations}</Text>
            {specializations.map((specialization) => (
              <View key={specialization.id} style={styles.entryCard}>
                <FormInput
                  label="Specialization"
                  value={specialization.name}
                  onChangeText={(value) => updateSpecialization(specialization.id, value)}
                  placeholder={s.specializationPlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                />
                <Pressable
                  onPress={() => removeSpecialization(specialization.id)}
                  style={clinicRemoveDoctorStyles.row}
                  accessibilityRole="button"
                  accessibilityLabel={s.removeSpecialization}
                >
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  <Text style={clinicRemoveDoctorStyles.text}>{s.removeSpecialization}</Text>
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={addSpecialization}
              style={clinicAddDoctorStyles.button}
              accessibilityRole="button"
              accessibilityLabel={s.addSpecialization}
            >
              <Text style={clinicAddDoctorStyles.text}>{s.addSpecialization}</Text>
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
  phoneSpacer: { marginBottom: 16 },
  entryCard: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.chipBorder,
  },
});
