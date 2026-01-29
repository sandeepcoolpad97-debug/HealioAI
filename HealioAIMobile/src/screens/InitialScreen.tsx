import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {CommonButton} from '../components/CommonButton';
import {colors} from '../constants/colors';
import {navigationRoutes, onboardingStrings} from '../constants/strings';

type InitialScreenProps = {
  navigation: {
    navigate: (route: string) => void;
    replace: (route: string) => void;
  };
};

export const InitialScreen: React.FC<InitialScreenProps> = ({navigation}) => {
  const {title, subtitle, ctaLabel} = onboardingStrings.initial;

  const handleGetStarted = () => {
    navigation.navigate(navigationRoutes.WelcomeOne);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>{title}</Text>
        </View>

        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.buttonContainer}>
        <CommonButton label={ctaLabel} onPress={handleGetStarted} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundOnboardingOne,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  appName: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.primaryText,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});

