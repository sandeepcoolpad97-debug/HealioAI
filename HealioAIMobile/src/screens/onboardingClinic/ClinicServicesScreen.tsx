import React, { useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
  clinicSectionTitleStyles,
  clinicInputWithIconStyles,
} from './clinicOnboardingStyles';

const s = clinicOnboardingStrings.services;
const OPERATING_DAYS = s.operatingDaysOptions;

type ClinicServicesScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const ClinicServicesScreen: React.FC<ClinicServicesScreenProps> = ({
  navigation,
}) => {
  const [address, setAddress] = useState('');
  const [selectedDays, setSelectedDays] = useState<readonly string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [operatingStart, setOperatingStart] = useState('');
  const [operatingEnd, setOperatingEnd] = useState('');
  const [establishmentDate, setEstablishmentDate] = useState('');
  const [inPersonConsultation, setInPersonConsultation] = useState(true);

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
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
              label={s.address}
              value={address}
              onChangeText={setAddress}
              placeholder={s.addressPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              multiline
            />

            <Text style={clinicSectionTitleStyles.text}>{s.operatingDays}</Text>
            <ChipRow gap={8}>
              {OPERATING_DAYS.map((day) => (
                <SelectableChip
                  key={day}
                  label={day}
                  selected={selectedDays.includes(day)}
                  onPress={() => toggleDay(day)}
                  variant="green"
                />
              ))}
            </ChipRow>

            <Text style={shared.label}>{s.operatingHours}</Text>
            <View style={styles.operatingRow}>
              <View style={[clinicInputWithIconStyles.wrapper, styles.operatingInput]}>
                <TextInput
                  style={clinicInputWithIconStyles.input}
                  placeholder={s.operatingHoursStartPlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                  value={operatingStart}
                  onChangeText={setOperatingStart}
                />
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.inputPlaceholderGrey}
                  style={clinicInputWithIconStyles.icon}
                />
              </View>
              <Text style={styles.operatingTo}>to</Text>
              <View style={[clinicInputWithIconStyles.wrapper, styles.operatingInput]}>
                <TextInput
                  style={clinicInputWithIconStyles.input}
                  placeholder={s.operatingHoursEndPlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                  value={operatingEnd}
                  onChangeText={setOperatingEnd}
                />
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.inputPlaceholderGrey}
                  style={clinicInputWithIconStyles.icon}
                />
              </View>
            </View>

            <Text style={shared.label}>{s.establishmentDate}</Text>
            <View style={clinicInputWithIconStyles.wrapper}>
              <TextInput
                style={clinicInputWithIconStyles.input}
                placeholder={s.establishmentPlaceholder}
                placeholderTextColor={colors.inputPlaceholder}
                value={establishmentDate}
                onChangeText={setEstablishmentDate}
              />
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.inputPlaceholderGrey}
                style={clinicInputWithIconStyles.icon}
              />
            </View>

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
  operatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  operatingInput: {
    flex: 1,
    marginBottom: 0,
  },
  operatingTo: {
    fontSize: 14,
    color: colors.inputPlaceholderGrey,
    fontWeight: '500',
  },
});
