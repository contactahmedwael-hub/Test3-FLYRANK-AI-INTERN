import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

/**
 * All Firebase config comes from env vars (see .env.example) so no
 * credentials are hardcoded or committed.
 *
 * Three Firebase products are initialized here:
 *  - Auth        -> `auth`  (email/password sign-in)
 *  - Firestore   -> `db`    (reserved for auth-related / future data)
 *  - Realtime DB -> `rtdb`  (existing favourites feature, unchanged)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  // Don't throw — the OMDb-only parts of the app should still work even
  // if Firebase env vars haven't been filled in yet. Just warn loudly.
  console.warn(
    `Firebase config is missing values for: ${missingKeys.join(', ')}. ` +
      'Add them to your .env file (see .env.example).'
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
