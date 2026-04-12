# GreenTrace Mobile Frontend — Agent Handoff

## Project Overview
- **Product**: GreenTrace — household waste segregation tracking with Green Points rewards
- **This repo**: React Native + Expo mobile app (resident-facing)
- **Backend repo**: `C:\Users\raiya\Code\GreenTrace-backend` (Firebase Functions + Firestore + Storage)
- **Firebase project**: `greentrace-25236` (project number: `1105694768`)
- **Authenticated user**: `yashthegreathaha@gmail.com`
- **Team**: User is backend lead. One teammate does mobile frontend, another does admin dashboard. User asked us to fix the frontend and connect it to the backend.

## What Was Completed

### Services Layer (all created from scratch)
The frontend had UI screens but **zero service files** — every screen imported from a `services/` directory that didn't exist. All 5 service files were created:

| File | Purpose |
|------|---------|
| `services/firebase.js` | Firebase init with Auth, Firestore, Storage, Functions. **Emulator connections enabled** (`USE_EMULATORS = true`) |
| `services/auth.js` | `login()`, `register()`, `logout()` wrapping Firebase Auth |
| `services/wasteLog.js` | `submitWasteLog()` — uploads photo to Storage, creates Firestore doc with full backend payload |
| `services/rewards.js` | Wallet balance, ledger history, rewards catalog, `redeemReward` callable |
| `services/leaderboard.js` | `getTopUsers()` / `getUserRank()` wrapping `getLeaderboard` callable |

### Contract Fixes (frontend → backend alignment)
| Issue | Before | After |
|-------|--------|-------|
| Category ID | `ewaste` | `e_waste` (matches backend `WASTE_CATEGORIES.E_WASTE`) |
| Point values | `10/15/25` | `5/8/12` (matches backend `POINTS_MAP`) |
| Status enum | `pending` | `pending_review` (matches `SUBMISSION_STATUS.PENDING_REVIEW`) |
| Leaderboard response | `userId`, `name`, `building` | `uid`, `displayName`, `buildingId` (mapped in service) |
| Wallet ledger | `credit/debit` + `points` | Backend `earn/redeem` + `amount` (mapped in service) |
| Submission payload | Only `userId, category, photoUrl, geoLocation` | Full: `uid, category, photoPath, gps, checklist, mlKitHints` |

### Structural Fixes
- Renamed `app/auth/` → `app/(auth)/` and `app/tabs/` → `app/(tabs)/` (Expo Router requires parenthesized route groups)
- Deleted typo file `constants/wasteCategorys.js` → created `constants/wasteCategories.js`
- Fixed `package.json` entry: `"main": "index.js"` → `"main": "expo-router/entry"` (critical — without this the blank `App.js` renders instead of Expo Router)
- Renamed app from `WasteWise` → `GreenTrace` in `app.json` and `package.json`
- Added `scheme: "greentrace"` to `app.json`

### New Screens
- `app/(auth)/register.jsx` — full registration (name, email, password, confirm)
- `app/(auth)/_layout.jsx` — auth group Stack layout

### Updated Screens
- **camera.jsx** — Added segregation checklist (3 toggles: `wetSeparated`, `drySeparated`, `hazardFree`), validates before submit
- **home.jsx** — Fetches real wallet balance and today's submissions
- **wallet.jsx** — Reads from `wallets/{uid}` and `wallets/{uid}/ledger`
- **leaderboard.jsx** — Calls `getLeaderboard` callable
- **LeaderboardItem.jsx** — Accepts `buildingId` + `streak`
- **SubmissionStatus.jsx** — Uses `pending_review` key

### Firebase Setup Done
- Firebase web app registered: `1:1105694768:web:fcd8a0c98a0be768deddf5`
- Real SDK config injected into `services/firebase.js`
- Backend `.firebaserc` updated from placeholder to `greentrace-25236`
- Firebase Auth Email/Password enabled
- Firestore database created in `asia-south1`
- Firestore rules + indexes deployed

### What Could NOT Be Deployed
- **Cloud Functions** — require Blaze (pay-as-you-go) plan. User declined to upgrade.
- **Storage rules** — also require Blaze.
- **Solution**: Firebase Emulator Suite is configured and working locally instead.

## Current Runtime State

### Firebase Emulators (may or may not still be running)
Started from `C:\Users\raiya\Code\GreenTrace-backend`:
```
npx firebase-tools emulators:start --project greentrace-25236
```
Ports:
- Auth: `127.0.0.1:9099`
- Functions: `127.0.0.1:5001`
- Firestore: `127.0.0.1:8080`
- Storage: `127.0.0.1:9199`
- Emulator UI: `http://127.0.0.1:4000`

All 7 functions loaded successfully:
- Triggers: `onUserCreated`, `onSubmissionCreated`, `onSubmissionStatusChanged`
- Callables: `redeemReward`, `getLeaderboard`, `getScopeStats`, `getHeatmapData`

### Expo Dev Server
Started from this repo with `npx expo start`. Metro Bundler running. QR code visible.

### Emulator Connection Config
In `services/firebase.js`:
```js
const USE_EMULATORS = true;
const EMULATOR_HOST = 'localhost';
```
**IMPORTANT**: If testing on a physical phone, `localhost` must be replaced with the PC's local IP (e.g. `192.168.1.7`). This was NOT done yet.

## IMMEDIATE ISSUE TO DEBUG

The app loads in Expo Go but shows an **error screen**. The user did not share the exact error message before handing off. Most likely causes:

1. **Emulator host mismatch** — The phone can't reach `localhost`. Fix: change `EMULATOR_HOST` in `services/firebase.js` to the PC's actual IP address (based on the Expo output, the IP is `192.168.1.7`).

2. **Module resolution** — Some import path might be wrong. Check with `npx expo start -c` (clear cache).

3. **`App.js` and `index.js` still exist** — These are orphan files from before Expo Router was configured. They shouldn't cause issues since `package.json` now points to `expo-router/entry`, but could be deleted for cleanliness.

### Debugging Steps
1. Ask the user what error message appears on the phone screen
2. If it's a network/emulator error → change `EMULATOR_HOST` to `192.168.1.7`
3. If it's a module error → check the Metro bundler output for the exact missing module
4. Run `npx expo start -c` to clear cache after any fix

## File Map

```
GreenTrace-mobile-frontend/
├── app/
│   ├── _layout.jsx              # Root layout + auth navigation guard
│   ├── camera.jsx               # Camera + checklist + submission
│   ├── (auth)/
│   │   ├── _layout.jsx          # Auth group Stack layout
│   │   ├── login.jsx            # Login screen
│   │   └── register.jsx         # Registration screen
│   └── (tabs)/
│       ├── _layout.jsx          # Tab bar layout
│       ├── home.jsx             # Dashboard with wallet balance + today's status
│       ├── log-waste.jsx        # Category picker → camera
│       ├── wallet.jsx           # Balance + transaction history
│       └── leaderboard.jsx      # Global leaderboard
├── components/
│   ├── LeaderboardItem.jsx
│   ├── SubmissionStatus.jsx
│   ├── WasteCategoryPicker.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── PointsBadge.jsx
│       └── card.jsx
├── services/                    # ← ALL NEW (created this session)
│   ├── firebase.js              # Firebase init + emulator connections
│   ├── auth.js                  # login, register, logout
│   ├── wasteLog.js              # photo upload + submission creation
│   ├── rewards.js               # wallet, ledger, catalog, redeem callable
│   └── leaderboard.js           # getLeaderboard callable wrapper
├── hooks/
│   ├── useAuth.js               # Firebase Auth state listener
│   ├── useCamera.js             # Camera capture logic
│   └── useLocation.js           # GPS capture
├── constants/
│   ├── theme.js                 # Colors, spacing, borderRadius
│   └── wasteCategories.js       # Category IDs matching backend (wet, dry, e_waste)
├── App.js                       # ORPHAN — not used (entry is expo-router/entry)
├── index.js                     # ORPHAN — not used
├── app.json                     # Expo config (GreenTrace, scheme: greentrace)
└── package.json                 # main: expo-router/entry
```

## Backend Contract Reference (from backend repo)
- **Submission status values**: `pending_review`, `approved`, `rejected`
- **Waste categories**: `wet`, `dry`, `e_waste`
- **Points**: wet=5, dry=8, e_waste=12
- **Callable functions**: `redeemReward`, `getLeaderboard`, `getScopeStats`, `getHeatmapData`
- **Trigger functions**: `onUserCreated`, `onSubmissionCreated`, `onSubmissionStatusChanged`
- **Firestore schema**: See `C:\Users\raiya\Code\GreenTrace-backend\firestore\schema.md`
- **Backend constants**: See `C:\Users\raiya\Code\GreenTrace-backend\functions\src\config\constants.js`

## Guardrails
- Do not modify the backend repo's function signatures or Firestore schema — it is the source of truth
- Do not upgrade to Blaze unless the user explicitly asks
- Keep emulator setup working as the primary dev flow
- Do not remove `App.js`/`index.js` without telling the user (they're harmless orphans)
