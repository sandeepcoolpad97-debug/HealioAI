import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthPrimaryButton } from '../../components';
import { colors } from '../../constants/colors';
import {
  clinicOnboardingStrings,
  navigationRoutes,
} from '../../constants/strings';

const s = clinicOnboardingStrings.profileSubmitted;

const WHATS_NEXT_ICONS: string[] = [
  'document-text-outline',
  'wallet-outline',
  'people-outline',
  'notifications-outline',
];

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  android: { elevation: 3 },
});

type ClinicProfileSubmittedScreenProps = {
  navigation: {
    replace: (route: string) => void;
  };
};

export const ClinicProfileSubmittedScreen: React.FC<ClinicProfileSubmittedScreenProps> = ({
  navigation,
}) => {
  const handleGoToDashboard = () => {
    navigation.replace(navigationRoutes.MainTabs);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.backgroundOnboardingOne}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="checkmark"
              size={48}
              color={colors.successIconGreen}
            />
          </View>
        </View>

        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.message}>{s.message}</Text>

        <View style={[styles.card, styles.whatsNextCard]}>
          <Text style={styles.cardTitle}>{s.whatsNextTitle}</Text>
          {s.whatsNextItems.map((item, index) => (
            <View
              key={item}
              style={[
                styles.whatsNextRow,
                index > 0 && styles.whatsNextRowSpacer,
              ]}
            >
              <View style={styles.whatsNextIconWrap}>
                <Ionicons
                  name={WHATS_NEXT_ICONS[index] as 'document-text-outline' | 'wallet-outline' | 'people-outline' | 'notifications-outline'}
                  size={22}
                  color={colors.successIconGreen}
                />
              </View>
              <Text style={styles.whatsNextText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.verificationCard]}>
          <View style={styles.verificationRow}>
            <View style={styles.verificationIconWrap}>
              <Ionicons
                name="time-outline"
                size={24}
                color={colors.primaryText}
              />
            </View>
            <View style={styles.verificationTextWrap}>
              <Text style={styles.verificationTitle}>
                {s.verificationTitle}
              </Text>
              <Text style={styles.verificationSubtext}>
                {s.verificationSubtext}
              </Text>
            </View>
          </View>
        </View>

        <AuthPrimaryButton
          label={s.goToDashboard}
          onPress={handleGoToDashboard}
          variant="blue"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundOnboardingOne,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  message: {
    fontSize: 15,
    color: colors.inputPlaceholderGrey,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...cardShadow,
  },
  whatsNextCard: {
    backgroundColor: colors.backgroundOnboardingOne,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 16,
  },
  whatsNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsNextRowSpacer: {
    marginTop: 14,
  },
  whatsNextIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.successFeatureIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  whatsNextText: {
    flex: 1,
    fontSize: 15,
    color: colors.inputPlaceholderGrey,
    lineHeight: 21,
  },
  verificationCard: {
    backgroundColor: colors.backgroundOnboardingTwo,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundOnboardingOne,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  verificationTextWrap: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 2,
  },
  verificationSubtext: {
    fontSize: 14,
    color: colors.inputPlaceholderGrey,
  },
});
