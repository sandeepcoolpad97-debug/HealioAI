import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CommonButton} from '../../components/CommonButton';
import SkipButton from '../../components/SkipButton';
import {colors} from '../../constants/colors';
import {navigationRoutes, onboardingStrings} from '../../constants/strings';

type WelcomeTwoProps = {
  navigation: {
    navigate: (route: string) => void;
    replace: (route: string) => void;
  };
};

export const WelcomeTwo: React.FC<WelcomeTwoProps> = ({navigation}) => {
  const {title, subtitle, ctaLabel} = onboardingStrings.welcomeTwo;

  const handlePrimaryPress = () => {
    navigation.navigate(navigationRoutes.WelcomeThree);
  };

  const handleSkip = () => {
    navigation.replace(navigationRoutes.MainTabs);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top-right Skip button row — Flexbox, no absolute positioning */}
      <View style={styles.skipRow}>
        <SkipButton variant="light" onPress={handleSkip} />
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/images/wlimage2.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <CommonButton label={ctaLabel} onPress={handlePrimaryPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundOnboardingTwo,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustrationImage: {
    width: '80%',
    aspectRatio: 3 / 4,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});

