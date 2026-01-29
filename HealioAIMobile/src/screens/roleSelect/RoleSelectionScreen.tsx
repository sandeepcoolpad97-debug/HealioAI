import React, { useState } from 'react';
import {
  Platform,
  Pressable,
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
  roleSelectStrings,
  type RoleKey,
} from '../../constants/strings';

const ROLES: RoleKey[] = ['user', 'clinic', 'lab'];

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
});

type RoleSelectionScreenProps = {
  navigation: {
    replace: (route: string, params?: { role: RoleKey }) => void;
  };
};

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  navigation,
}) => {
  const [selected, setSelected] = useState<RoleKey | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    // Clinic → clinic onboarding; Lab → lab onboarding; User → personal details
    if (selected === 'clinic') {
      navigation.replace(navigationRoutes.ClinicDetails, { role: selected });
    } else if (selected === 'lab') {
      navigation.replace(navigationRoutes.LabDetails, { role: selected });
    } else {
      navigation.replace(navigationRoutes.PersonalDetails, { role: selected });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.signInBackground}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{roleSelectStrings.title}</Text>
        <Text style={styles.subtitle}>{roleSelectStrings.subtitle}</Text>

        <View style={styles.cards}>
          {ROLES.map((role) => {
            const config = roleSelectStrings.roles[role];
            const isSelected = selected === role;
            return (
              <Pressable
                key={role}
                onPress={() => setSelected(role)}
                style={({ pressed }) => [
                  styles.card,
                  isSelected && styles.cardSelected,
                  pressed && styles.cardPressed,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`${config.title}. ${config.description}`}
              >
                {isSelected && (
                  <View style={styles.checkWrap} pointerEvents="none">
                    <View style={styles.checkCircle}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.buttonTextOnPrimary}
                      />
                    </View>
                  </View>
                )}
                <Text style={styles.cardTitle}>{config.title}</Text>
                <Text style={styles.cardDescription}>{config.description}</Text>
              </Pressable>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>
            {roleSelectStrings.continue}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.signInBackground,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 15,
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 12,
    lineHeight: 22,
  },
  cards: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: colors.backgroundOnboardingOne,
    borderRadius: 14,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    ...cardShadow,
  },
  cardSelected: {
    borderColor: colors.otpButtonGreen,
  },
  cardPressed: {
    opacity: 0.95,
  },
  checkWrap: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.otpButtonGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.inputPlaceholderGrey,
    lineHeight: 20,
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.otpButtonGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueDisabled: {
    opacity: 0.6,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.buttonTextOnPrimary,
  },
});
