import React, { useCallback } from 'react';
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
import { setLabDetails } from '../../store/labOnboardingSlice';
import { colors } from '../../constants/colors';
import { labOnboardingStrings, navigationRoutes } from '../../constants/strings';
import { sharedLabOnboardingStyles as shared } from './labOnboardingStyles';
import { labInputWithIconStyles } from './labOnboardingStyles';

const s = labOnboardingStrings.details;

type LaboratoryDetailsScreenProps = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const LaboratoryDetailsScreen: React.FC<LaboratoryDetailsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const details = useAppSelector((s) => s.labOnboarding.details);

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
              value={details.labName}
              onChangeText={(v) => dispatch(setLabDetails({ labName: v }))}
              placeholder={s.labNamePlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />
            <FormInput
              label={s.registrationNumber}
              value={details.registrationNumber}
              onChangeText={(v) => dispatch(setLabDetails({ registrationNumber: v }))}
              placeholder={s.registrationPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
            />
            <Text style={shared.label}>{s.contactNumber}</Text>
            <PhoneInput
              value={details.contactNumber}
              onChangeText={(v) => dispatch(setLabDetails({ contactNumber: v }))}
              placeholder={s.contactPlaceholder}
              countryCode="+91"
              style={styles.phoneSpacer}
            />
            <FormInput
              label={s.email}
              value={details.email}
              onChangeText={(v) => dispatch(setLabDetails({ email: v }))}
              placeholder={s.emailPlaceholder}
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={shared.label}>{s.establishmentDate}</Text>
            <View style={labInputWithIconStyles.wrapper}>
              <TextInput
                style={labInputWithIconStyles.input}
                placeholder={s.establishmentPlaceholder}
                placeholderTextColor={colors.inputPlaceholder}
                value={details.establishmentDate}
                onChangeText={(v) => dispatch(setLabDetails({ establishmentDate: v }))}
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
