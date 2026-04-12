import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Sign in an existing user.
 */
export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // Ensure firestore doc exists (useful if created during old cloud-functions era)
  await ensureUserDoc(cred.user);
  return cred.user;
}

/**
 * Register a new resident account.
 */
export async function register(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Manually initialize Firestore documents since Cloud Functions are disabled
  await setDoc(doc(db, 'users', user.uid), {
    displayName: displayName || user.email.split('@')[0],
    email: user.email,
    points: 0,
    totalWaste: 0,
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(db, 'wallets', user.uid), {
    balance: 0,
    totalEarned: 0,
    lastUpdated: serverTimestamp(),
  });

  return user;
}

/**
 * Ensure user document and wallet exist in Firestore.
 */
async function ensureUserDoc(user, displayName) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  const name = displayName || user.displayName || 'Resident';

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      role: 'RESIDENT',
      displayName: name,
      email: user.email,
      points: 0,
      totalWaste: 0,
      streak: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Initialize wallet
    await setDoc(doc(db, 'wallets', user.uid), {
      uid: user.uid,
      balance: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      lastUpdated: serverTimestamp(),
    });
  } else if (displayName && userSnap.data().displayName !== displayName) {
    // Update name if changed
    await setDoc(userRef, { displayName: name, updatedAt: serverTimestamp() }, { merge: true });
  }
}

/**
 * Sign out the current user.
 */
export async function logout() {
  await signOut(auth);
}
