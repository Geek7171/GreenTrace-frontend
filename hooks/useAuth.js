import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = null;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    if (!auth || typeof onAuthStateChanged !== 'function') {
      console.error("Firebase Auth is not properly initialized.");
      setLoading(false);
      return;
    }

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Initial sync logic (keep as per original for stability)
        try {
          const userRef = doc(db, 'users', u.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: u.uid,
              role: 'RESIDENT',
              displayName: (u.displayName || 'Resident').trim(),
              email: u.email,
              warningCount: 0,
              isBlocked: false,
              updatedAt: serverTimestamp(),
            }, { merge: true });
          }

          // Start real-time Firestore listener
          unsubProfile = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              setUser({ ...u, ...docSnap.data() });
            } else {
              setUser(u);
            }
            setLoading(false);
            clearTimeout(timer);
          });
        } catch (e) {
          console.error("Profile sync/listener failed:", e);
          setUser(u);
          setLoading(false);
        }
      } else {
        if (unsubProfile) unsubProfile();
        setUser(null);
        setLoading(false);
        clearTimeout(timer);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
      clearTimeout(timer);
    };
  }, []);

  return { user, loading };
}