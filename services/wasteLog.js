import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db, auth } from './firebase';

export async function submitWasteLog({
  uid,
  category,
  photoBase64,
  gps,
  checklist,
  mlKitHints = {},
  buildingId = null,
  wardId = null,
}) {
  const submissionsRef = collection(db, 'submissions');
  const user = auth.currentUser;
  
  const docData = {
    uid,
    userName: user?.displayName || 'Resident',
    userEmail: user?.email || '',
    category,
    checklist: checklist || { wetSeparated: false, drySeparated: false, hazardFree: false },
    photoPath: photoBase64 ? 'subcollection' : null,
    gps: {
      lat: gps.latitude ?? gps.lat,
      lng: gps.longitude ?? gps.lng,
      accuracy: gps.accuracy ?? null,
    },
    mlKitHints: mlKitHints || {},
    buildingId,
    wardId,
    status: 'pending_review',
    validationFlags: [],
    pointsAwarded: 0,
    pointsAwardedAt: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(submissionsRef, docData);
  
  if (photoBase64) {
    const evidenceRef = collection(db, `submissions/${docRef.id}/evidence`);
    await addDoc(evidenceRef, { data: `data:image/jpeg;base64,${photoBase64}` });
  }

  return { submissionId: docRef.id, photoPath: docData.photoPath };
}

/**
 * Get today's submissions for a user.
 */
export async function getTodaySubmissions(uid) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // We fetch a bit more and filter in memory to handle UIDs with spaces
  const q = query(
    collection(db, 'submissions'),
    where('createdAt', '>=', startOfDay),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const snap = await getDocs(q);
  const targetUid = uid ? uid.trim() : "";

  return snap.docs
    .map(doc => {
      const data = doc.data();
      // Clean UID check
      const docUid = (data.uid || data.UID || data.userId || "").trim();
      if (docUid !== targetUid) return null;
      return { id: doc.id, ...data };
    })
    .filter(Boolean);
}
