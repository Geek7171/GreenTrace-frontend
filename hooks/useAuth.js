import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout to prevent loading hang
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Run a one-time sync to fix missing names/wallets in serverless mode
        try {
          const userRef = doc(db, 'users', u.uid);
          const snap = await getDoc(userRef);
          
          if (!snap.exists() || !snap.data().displayName || snap.data().displayName === 'Resident') {
             // If the name is default Auth name or missing, sync it
             await setDoc(userRef, {
               uid: u.uid,
               role: 'RESIDENT',
               displayName: (u.displayName || 'Resident').trim(),
               email: u.email,
               updatedAt: serverTimestamp(),
             }, { merge: true });
          }

          // Ensure wallet exists
          const walletRef = doc(db, 'wallets', u.uid);
          const walletSnap = await getDoc(walletRef);
          if (!walletSnap.exists()) {
            await setDoc(walletRef, {
              uid: u.uid,
              balance: 0,
              totalEarned: 0,
              totalRedeemed: 0,
              lastUpdated: serverTimestamp(),
            });
          }
        } catch (e) {
          console.error("Profile sync failed:", e);
        }
      }
      setUser(u);
      setLoading(false);
      clearTimeout(timer);
    });
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  return { user, loading };
}