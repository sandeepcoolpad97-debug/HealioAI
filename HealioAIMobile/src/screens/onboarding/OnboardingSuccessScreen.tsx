import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import {
  navigationRoutes,
  onboardingFlowStrings,
} from '../../constants/strings';

const s = onboardingFlowStrings.onboardingSuccess;

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  android: { elevation: 3 },
});

const buttonShadow = Platform.select({
  ios: {
    shadowColor: colors.dashboardButtonBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
});

type OnboardingSuccessScreenProps = {
  navigation: {
    replace: (route: string) => void;
  };
};

const OnboardingSuccessScreen: React.FC<OnboardingSuccessScreenProps> = ({
  navigation,
}) => {
  const handleGoToDashboard = () => {
    navigation.replace(navigationRoutes.Home);
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
        {/* 1. Centered success icon */}
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="checkmark"
              size={48}
              color={colors.successIconGreen}
            />
          </View>
        </View>

        {/* 2. Welcome text */}
        <Text style={styles.heading}>{s.heading}</Text>
        <Text style={styles.subtext}>{s.subtext}</Text>

        {/* 3. Features card */}
        <View style={styles.card}>
          {s.features.map((f, index) => (
            <View
              key={f.title}
              style={[styles.featureRow, index > 0 && styles.featureRowSpacer]}
            >
              <View style={styles.featureIconWrap}>
                <Ionicons
                  name={f.icon as 'shield-checkmark' | 'person' | 'business'}
                  size={22}
                  color={colors.successIconGreen}
                />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 4. CTA button */}
        <TouchableOpacity
          style={styles.cta}
          onPress={handleGoToDashboard}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>{s.cta}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingSuccessScreen;

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
    marginBottom: 28,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.successHeading,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  subtext: {
    fontSize: 15,
    color: colors.inputPlaceholderGrey,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    backgroundColor: colors.backgroundOnboardingOne,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    ...cardShadow,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureRowSpacer: {
    marginTop: 24,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.successFeatureIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.successHeading,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: colors.inputPlaceholderGrey,
    lineHeight: 20,
  },
  cta: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.dashboardButtonBlue,
    alignItems: 'center',
    justifyContent: 'center',
    ...buttonShadow,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.buttonTextOnPrimary,
  },
});
