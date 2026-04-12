import { doc, getDoc, collection, query, orderBy, getDocs, where, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get the current wallet balance for a user.
 * Reads from wallets/{uid}.
 * Returns the balance number.
 */
export async function getWalletBalance(uid) {
  const walletRef = doc(db, 'wallets', uid);
  const snap = await getDoc(walletRef);
  if (!snap.exists()) return 0;
  return snap.data().balance || 0;
}

/**
 * Get wallet details (balance, totalEarned, totalRedeemed).
 */
export async function getWalletDetails(uid) {
  const walletRef = doc(db, 'wallets', uid);
  const snap = await getDoc(walletRef);
  if (!snap.exists()) return { balance: 0, totalEarned: 0, totalRedeemed: 0 };
  const data = snap.data();
  return {
    balance: data.balance || 0,
    totalEarned: data.totalEarned || 0,
    totalRedeemed: data.totalRedeemed || 0,
  };
}

/**
 * Get transaction history from the wallet ledger.
 * Reads from wallets/{uid}/ledger, ordered by createdAt desc.
 *
 * Backend ledger entries have shape:
 *   { type: 'earn'|'redeem', reason: string, entityId: string, amount: number, balanceAfter: number, createdAt: timestamp }
 *
 * Returns normalized array for the wallet UI.
 */
export async function getTransactionHistory(uid) {
  const ledgerRef = collection(db, 'wallets', uid, 'ledger');
  const q = query(ledgerRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);

  return snap.docs.map(d => {
    const entry = d.data();
    return {
      id: d.id,
      type: entry.type === 'earn' ? 'credit' : 'debit',
      reason: formatReason(entry.reason),
      points: Math.abs(entry.amount),
      balanceAfter: entry.balanceAfter,
      date: entry.createdAt?.toDate?.()
        ? entry.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '',
    };
  });
}

/**
 * Human-readable reason labels.
 */
function formatReason(reason) {
  const map = {
    submission_approved: 'Waste Submission Approved',
    streak_bonus: 'Streak Bonus',
    reward_redemption: 'Reward Redeemed',
  };
  return map[reason] || reason || 'Transaction';
}

/**
 * Get active rewards catalog.
 */
export async function getRewardsCatalog() {
  const q = query(
    collection(db, 'rewardsCatalog'),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function redeemReward(uid, rewardId, quantity = 1) {
  let resultBalance = 0;
  let redemptionId = '';

  await runTransaction(db, async (tx) => {
    const rewardRef = doc(db, 'rewardsCatalog', rewardId);
    const rewardSnap = await tx.get(rewardRef);
    if (!rewardSnap.exists()) throw new Error('Reward not found');
    const reward = rewardSnap.data();

    if (!reward.isActive) throw new Error('Reward is currently inactive');
    if (reward.inventory !== null && reward.inventory < quantity) {
      throw new Error('Not enough inventory');
    }

    const totalCost = reward.pointsCost * quantity;

    const walletRef = doc(db, 'wallets', uid);
    const walletSnap = await tx.get(walletRef);
    if (!walletSnap.exists()) throw new Error('Wallet not found');
    const wallet = walletSnap.data();

    if ((wallet.balance || 0) < totalCost) {
      throw new Error('Insufficient points');
    }

    const remainingBalance = wallet.balance - totalCost;
    resultBalance = remainingBalance;

    // 1. Update wallet balance
    tx.update(walletRef, {
      balance: remainingBalance,
      totalRedeemed: (wallet.totalRedeemed || 0) + totalCost,
      lastUpdated: serverTimestamp()
    });

    // 2. Reduce inventory if tracked
    if (reward.inventory !== null) {
      tx.update(rewardRef, {
        inventory: reward.inventory - quantity
      });
    }

    // 3. Create redemption record
    const redemptionsRef = collection(db, 'redemptions');
    const newRedemptionRef = doc(redemptionsRef);
    redemptionId = newRedemptionRef.id;

    tx.set(newRedemptionRef, {
      uid,
      rewardId,
      quantity,
      costUsed: totalCost,
      status: 'pending', // or 'fulfilled'
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 4. Create ledger entry
    const ledgerRef = doc(collection(db, 'wallets', uid, 'ledger'));
    tx.set(ledgerRef, {
      type: 'redeem',
      amount: -totalCost,
      balanceAfter: remainingBalance,
      reason: 'reward_redemption',
      entityId: newRedemptionRef.id,
      createdAt: serverTimestamp()
    });
  });

  return { success: true, newBalance: resultBalance, redemptionId };
}
