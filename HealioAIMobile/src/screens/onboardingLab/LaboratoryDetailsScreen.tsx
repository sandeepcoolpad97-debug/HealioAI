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
  ChipRow,
  FormCard,
  FormInput,
  PhoneInput,
  SelectableChip,
  ScreenHeader,
} from '../../components';
import { colors } from '../../constants/colors';
import { labOnboardingStrings, navigationRoutes } from '../../constants/strings';
import { sharedLabOnboardingStyles as shared } from './labOnboardingStyles';
import { labInputWithIconStyles, labSectionTitleStyles } from './labOnboardingStyles';

const s = labOnboardingStrings.details;
const OPERATING_DAYS = s.operatingDaysOptions;

type LaboratoryDetailsScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const LaboratoryDetailsScreen: React.FC<LaboratoryDetailsScreenProps> = ({
  navigation,
}) => {
  const [labName, setLabName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDays, setSelectedDays] = useState<readonly string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [opensAt, setOpensAt] = useState('');
  const [closesAt, setClosesAt] = useState('');
  const [establishmentDate, setEstablishmentDate] = useState('');

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, []);

  const handleContinue = () => {
    navigation.navigate(navigationRoutes.LabServices);
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
              label={s.labName}
              value={labName}
              onChangeText={setLabName}
              placeholder={s.labNamePlaceholder}
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

            <Text style={labSectionTitleStyles.text}>{s.operatingDays}</Text>
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
              <View style={[labInputWithIconStyles.wrapper, styles.operatingInput]}>
                <TextInput
                  style={labInputWithIconStyles.input}
                  placeholder={s.opensAtPlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                  value={opensAt}
                  onChangeText={setOpensAt}
                />
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.inputPlaceholderGrey}
                  style={labInputWithIconStyles.icon}
                />
              </View>
              <Text style={styles.operatingTo}>to</Text>
              <View style={[labInputWithIconStyles.wrapper, styles.operatingInput]}>
                <TextInput
                  style={labInputWithIconStyles.input}
                  placeholder={s.closesAtPlaceholder}
                  placeholderTextColor={colors.inputPlaceholder}
                  value={closesAt}
                  onChangeText={setClosesAt}
                />
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.inputPlaceholderGrey}
                  style={labInputWithIconStyles.icon}
                />
              </View>
            </View>
            <Text style={shared.label}>{s.establishmentDate}</Text>
            <View style={labInputWithIconStyles.wrapper}>
              <TextInput
                style={labInputWithIconStyles.input}
                placeholder={s.establishmentPlaceholder}
                placeholderTextColor={colors.inputPlaceholder}
                value={establishmentDate}
                onChangeText={setEstablishmentDate}
              />
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.inputPlaceholderGrey}
                style={labInputWithIconStyles.icon}
              />
            </View>
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
