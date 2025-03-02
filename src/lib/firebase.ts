
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if Firebase environment variables are properly set
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// Validate required Firebase configuration
if (!apiKey || !authDomain || !projectId || !appId) {
  console.error(
    'Firebase configuration is incomplete. Please set all required environment variables:',
    `VITE_FIREBASE_API_KEY: ${apiKey ? 'Set' : 'Missing'}`,
    `VITE_FIREBASE_AUTH_DOMAIN: ${authDomain ? 'Set' : 'Missing'}`,
    `VITE_FIREBASE_PROJECT_ID: ${projectId ? 'Set' : 'Missing'}`,
    `VITE_FIREBASE_APP_ID: ${appId ? 'Set' : 'Missing'}`
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

// Initialize Firebase - only if we have the minimum required config
let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { auth, db };
export default app;
