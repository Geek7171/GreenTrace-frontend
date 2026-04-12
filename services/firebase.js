import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAjEB5f4sC-gpu5UojiNtuyTqv-fqvkM2s',
  authDomain: 'greentrace-25236.firebaseapp.com',
  projectId: 'greentrace-25236',
  storageBucket: 'greentrace-25236.firebasestorage.app',
  messagingSenderId: '1105694768',
  appId: '1:1105694768:web:fcd8a0c98a0be768deddf5',
  measurementId: 'G-W0NJ80HTCT',
};

const app = initializeApp(firebaseConfig);

// Use AsyncStorage for auth persistence in React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

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
