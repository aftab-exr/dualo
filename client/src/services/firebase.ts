import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type UserCredential
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
}

let recaptchaVerifier: RecaptchaVerifier | null = null;

export function getRecaptchaVerifier(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
  if (!auth) {
    throw new Error('Firebase configuration missing. Set VITE_FIREBASE_API_KEY in your environment.');
  }
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        recaptchaVerifier = null;
      },
    });
  }
  return recaptchaVerifier;
}

export function clearRecaptchaVerifier(): void {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      // Ignore cleanup error
    }
    recaptchaVerifier = null;
  }
}

export async function sendFirebaseOtp(
  phoneNumber: string,
  containerId: string = 'recaptcha-container'
): Promise<ConfirmationResult> {
  if (!auth) {
    throw new Error('Firebase configuration missing. Set VITE_FIREBASE_API_KEY in environment.');
  }
  const verifier = getRecaptchaVerifier(containerId);
  return await signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export async function confirmFirebaseOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<UserCredential> {
  return await confirmationResult.confirm(otpCode);
}

export type { ConfirmationResult, UserCredential };

export async function signInWithGoogle(): Promise<string> {
  if (!auth) {
    throw new Error('Firebase configuration missing. Set VITE_FIREBASE_API_KEY in your deployment environment.');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return idToken;
  } catch (error: any) {
    // Fallback to redirect for mobile/Capacitor
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, googleProvider);
      const redirectResult = await getRedirectResult(auth);
      if (redirectResult?.user) {
        return await redirectResult.user.getIdToken();
      }
    }
    throw error;
  }
}

export async function getCurrentIdToken(): Promise<string | null> {
  if (!auth) return null;
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}