import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPhone, setRoleSelection, type OnboardingRoleKey } from '../../store/onboardingSlice';
import { getCurrentUser } from '../../services/auth.service';
import {
  listRoles,
  listSubscriptionPlans,
  getFreeSubscriptionId,
  type RoleDto,
} from '../../services/api.service';
import { colors } from '../../constants/colors';
import {
  navigationRoutes,
  roleSelectStrings,
  type RoleKey,
} from '../../constants/strings';

const ALLOWED_ROLE_KEYS: OnboardingRoleKey[] = ['user', 'clinic', 'lab'];

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

function parsePhoneFromE164(e164: string): { countryCode: string; number: string } {
  const digits = e164.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length >= 12) {
    return { countryCode: '+91', number: digits.slice(2) };
  }
  return { countryCode: '+91', number: digits };
}

type RoleSelectionScreenProps = {
  navigation: {
    replace: (route: string, params?: { role: RoleKey }) => void;
  };
};

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const phone = useAppSelector((s) => s.onboarding.phone);

  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [freeSubscriptionId, setFreeSubscriptionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<RoleKey | null>(null);

  const loadRolesAndSubscription = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) {
      setError('Not signed in');
      setLoading(false);
      return;
    }
    try {
      const [idToken, rolesRes, plansRes] = await Promise.all([
        user.getIdToken(true),
        listRoles(),
        user.getIdToken(true).then((t) => listSubscriptionPlans(t)),
      ]);

      const allowedRoles = rolesRes.filter((r) =>
        ALLOWED_ROLE_KEYS.includes(r.name.toLowerCase() as OnboardingRoleKey)
      );
      setRoles(allowedRoles);

      const freeId = getFreeSubscriptionId(plansRes);
      setFreeSubscriptionId(freeId);

      if (!phone && user.phoneNumber) {
        const { countryCode, number } = parsePhoneFromE164(user.phoneNumber);
        dispatch(setPhone({ countryCode, number, verified: true }));
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load roles and subscription';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, phone]);

  useEffect(() => {
    loadRolesAndSubscription();
  }, [loadRolesAndSubscription]);

  const handleContinue = () => {
    if (!selected) return;
    const roleDto = roles.find((r) => r.name.toLowerCase() === selected);
    if (!roleDto) {
      Alert.alert('Error', 'Selected role not found.');
      return;
    }
    if (!freeSubscriptionId) {
      Alert.alert('Error', 'Free subscription plan is not available. Please try again later.');
      return;
    }
    dispatch(
      setRoleSelection({
        roleKey: selected as OnboardingRoleKey,
        roleId: roleDto._id,
        subscriptionId: freeSubscriptionId,
      })
    );
    if (selected === 'clinic') {
      navigation.replace(navigationRoutes.ClinicDetails, { role: selected });
    } else if (selected === 'lab') {
      navigation.replace(navigationRoutes.LabDetails, { role: selected });
    } else {
      navigation.replace(navigationRoutes.PersonalDetails, { role: selected });
    }
  };

  const visibleRoles = roles
    .filter((r) => ALLOWED_ROLE_KEYS.includes(r.name.toLowerCase() as OnboardingRoleKey))
    .map((r) => r.name.toLowerCase() as RoleKey);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.signInBackground} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.otpButtonGreen} />
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.signInBackground} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRolesAndSubscription}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          {visibleRoles.map((role) => {
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.buttonTextOnPrimary,
  },
  errorText: {
    fontSize: 16,
    color: colors.buttonTextOnPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.otpButtonGreen,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.buttonTextOnPrimary,
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
