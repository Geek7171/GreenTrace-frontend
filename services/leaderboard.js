import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from './firebase';

export async function getTopUsers(count = 20, scopeType = 'global', period = 'allTime', scopeId = null) {
  const usersRef = collection(db, 'users');
  let qArgs = [orderBy('points', 'desc'), limit(count)];

  if (scopeType === 'building' && scopeId) {
    qArgs.unshift(where('buildingId', '==', scopeId));
  } else if (scopeType === 'ward' && scopeId) {
    qArgs.unshift(where('wardId', '==', scopeId));
  }

  const result = await getDocs(query(usersRef, ...qArgs));
  return result.docs.map((doc, idx) => {
    const data = doc.data();
    return {
      userId: doc.id,
      name: data.displayName || 'Resident',
      buildingId: data.buildingId,
      wardId: data.wardId,
      points: data.points || 0,
      streak: data.streak || 0,
      rank: idx + 1,
    };
  });
}

export async function getUserRank(uid) {
  const top = await getTopUsers(100);
  const entry = top.find(e => e.userId === uid);
  return entry ? entry.rank : null;
}
