import React, { useState } from 'react';
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
  FormCard,
  FormInput,
  PhoneInput,
  ScreenHeader,
} from '../../components';
import { colors } from '../../constants/colors';
import { clinicOnboardingStrings, navigationRoutes } from '../../constants/strings';
import { sharedClinicOnboardingStyles as shared } from './clinicOnboardingStyles';
import { clinicStepStyles, clinicInputWithIconStyles } from './clinicOnboardingStyles';

const s = clinicOnboardingStrings.details;

type ClinicDetailsScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const ClinicDetailsScreen: React.FC<ClinicDetailsScreenProps> = ({
  navigation,
}) => {
  const [clinicName, setClinicName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [operatingStart, setOperatingStart] = useState('');
  const [operatingEnd, setOperatingEnd] = useState('');
  const [establishmentDate, setEstablishmentDate] = useState('');

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
            <FormInput
              label={s.address}
              value={address}
              onChangeText={setAddress}
              placeholder={s.addressPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              multiline
            />
            <Text style={shared.label}>{s.contactNumber}</Text>
            <PhoneInput
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder={s.contactPlaceholder}
              countryCode="+1"
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
          </FormCard>

          <Text style={clinicStepStyles.stepIndicator}>{s.stepIndicator}</Text>
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
