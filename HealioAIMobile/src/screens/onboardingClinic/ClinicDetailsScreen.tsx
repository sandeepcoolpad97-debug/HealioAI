import React from 'react';
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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setClinicDetails } from '../../store/clinicOnboardingSlice';
import { colors } from '../../constants/colors';
import { clinicOnboardingStrings, navigationRoutes } from '../../constants/strings';
import { sharedClinicOnboardingStyles as shared } from './clinicOnboardingStyles';
import { clinicInputWithIconStyles } from './clinicOnboardingStyles';

const detailsStrings = clinicOnboardingStrings.details;
const servicesStrings = clinicOnboardingStrings.services;

type ClinicDetailsScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const ClinicDetailsScreen: React.FC<ClinicDetailsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const details = useAppSelector((s) => s.clinicOnboarding.details);

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
          <ScreenHeader title={detailsStrings.title} subtitle={detailsStrings.subtitle} />

          <FormCard>
            <FormInput
              label={detailsStrings.clinicName}
              value={details.clinicName}
              onChangeText={(v) => dispatch(setClinicDetails({ clinicName: v }))}
              placeholder={detailsStrings.clinicNamePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />
            <FormInput
              label={detailsStrings.registrationNumber}
              value={details.registrationNumber}
              onChangeText={(v) => dispatch(setClinicDetails({ registrationNumber: v }))}
              placeholder={detailsStrings.registrationPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />
            <Text style={shared.label}>{detailsStrings.contactNumber}</Text>
            <PhoneInput
              value={details.contactNumber}
              onChangeText={(v) => dispatch(setClinicDetails({ contactNumber: v }))}
              placeholder={detailsStrings.contactPlaceholder}
              countryCode="+91"
              style={styles.phoneSpacer}
            />
            <FormInput
              label={detailsStrings.email}
              value={details.email}
              onChangeText={(v) => dispatch(setClinicDetails({ email: v }))}
              placeholder={detailsStrings.emailPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={shared.label}>{servicesStrings.establishmentDate}</Text>
            <View style={clinicInputWithIconStyles.wrapper}>
              <TextInput
                style={clinicInputWithIconStyles.input}
                placeholder={servicesStrings.establishmentPlaceholder}
                placeholderTextColor={colors.inputPlaceholder}
                value={details.establishmentDate}
                onChangeText={(v) => dispatch(setClinicDetails({ establishmentDate: v }))}
              />
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.inputPlaceholderGrey}
                style={clinicInputWithIconStyles.icon}
              />
            </View>
          </FormCard>

          <AuthPrimaryButton label={detailsStrings.continue} onPress={handleContinue} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  phoneSpacer: { marginBottom: 16 },
});
