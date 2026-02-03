import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {CommonButton} from '../../components/CommonButton';
import {colors} from '../../constants/colors';
import {navigationRoutes, onboardingStrings} from '../../constants/strings';

type WelcomeThreeProps = {
  navigation: {
    navigate: (route: string) => void;
    replace: (route: string) => void;
  };
};

export const WelcomeThree: React.FC<WelcomeThreeProps> = ({navigation}) => {
  const {title, subtitle, ctaLabel} = onboardingStrings.welcomeThree;

  const handlePrimaryPress = () => {
    navigation.navigate(navigationRoutes.SignIn);
  };

  const handleSkip = () => {
    navigation.replace(navigationRoutes.MainTabs);
  };

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/images/wlimage3.png')}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundOnboardingThree,
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

