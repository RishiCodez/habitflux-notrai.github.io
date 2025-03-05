
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase only if we have the required configuration
let app: FirebaseApp | null = null;
let auth = null;
let database: Database | null = null;

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.databaseURL) {
  try {
    // Initialize Firebase only once
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
    console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);
    console.log("Realtime Database URL:", firebaseConfig.databaseURL);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn('Firebase configuration is missing or incomplete. Firebase features will be disabled.');
  
  if (!firebaseConfig.databaseURL) {
    console.error('Missing VITE_FIREBASE_DATABASE_URL environment variable. Realtime Database will not work.');
  }
}

export { app, auth, database };
