import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "MISSING_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Defensive App Initialization
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.error("Firebase App Init Error:", e);
  // Create a dummy app object to prevent downstream crashes
  app = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
}

// Use AsyncStorage for auth persistence in React Native
let auth;
try {
  if (!process.env.EXPO_PUBLIC_FIREBASE_API_KEY) {
    console.warn("CRITICAL: Firebase API Key is missing! APK build might be missing environment secrets.");
  }
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  console.error("Auth init error:", e);
  try {
    auth = initializeAuth(app, {});
  } catch (innerE) {
    auth = {}; // Final fallback
  }
}

export { auth };

export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'asia-south1');

// ──────────────────────────────────────────────
// LOCAL EMULATOR CONNECTIONS
// Set USE_EMULATORS to false when you deploy to production / upgrade to Blaze.
// ──────────────────────────────────────────────
const USE_EMULATORS = false;

// Use your machine's local IP so the Expo Go app on your phone can reach the emulators.
// Replace this if your machine has a different local IP.
const EMULATOR_HOST = '192.168.1.7';

if (USE_EMULATORS) {
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
  connectStorageEmulator(storage, EMULATOR_HOST, 9199);
  connectFunctionsEmulator(functions, EMULATOR_HOST, 5001);
}

export default app;
