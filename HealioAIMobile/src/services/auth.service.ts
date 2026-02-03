import auth, {
  FirebaseAuthTypes,
  GoogleAuthProvider,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Store confirmation result for Phone OTP so VerifyOTPScreen can confirm the code
let phoneConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

const DEFAULT_COUNTRY_CODE = '+91';

/**
 * Format phone to E.164 for Firebase (e.g. +919876543210).
 */
export function formatPhoneE164(phone: string, countryCode: string = DEFAULT_COUNTRY_CODE): string {
  const digits = phone.replace(/\D/g, '').trim();
  const code = countryCode.replace(/\D/g, '');
  return `${code.startsWith('+') ? code : `+${code}`}${digits}`;
}

/**
 * Send Firebase Phone OTP. Saves confirmation for later use in confirmPhoneOtp.
 * Enable "Phone" sign-in method in Firebase Console → Authentication → Sign-in method.
 */
export async function sendPhoneOtp(phoneNumberE164: string): Promise<void> {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumberE164);
  phoneConfirmation = confirmation;
}

/**
 * Confirm Phone OTP and sign in. Call after sendPhoneOtp and user enters code.
 */
export async function confirmPhoneOtp(code: string): Promise<FirebaseAuthTypes.UserCredential> {
  if (!phoneConfirmation) {
    throw new Error('No OTP sent. Please request a new code.');
  }
  const credential = await phoneConfirmation.confirm(code);
  phoneConfirmation = null;
  if (!credential) {
    throw new Error('Verification failed. Please try again.');
  }
  return credential;
}

/**
 * Sign in with Google. Requires @react-native-google-signin/google-signin and
 * Web Client ID from Firebase Console (client_type 3 in google-services.json).
 * Enable "Google" sign-in method in Firebase Console → Authentication.
 */
export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
  const response = await GoogleSignin.signIn();
  let idToken: string | null =
    response?.data?.idToken ??
    (response as { idToken?: string })?.idToken ??
    null;
  if (!idToken) {
    try {
      const tokens = await GoogleSignin.getTokens();
      idToken = tokens?.idToken ?? null;
    } catch {
      // User may have cancelled
    }
  }
  if (!idToken) {
    throw new Error('Google sign-in was cancelled or failed.');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(credential);
}

/**
 * Get current Firebase user (null if not signed in).
 */
export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}

/**
 * Sign out from Firebase (and optionally Google).
 */
export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore if Google Sign-In not used or not installed
  }
  await auth().signOut();
}
