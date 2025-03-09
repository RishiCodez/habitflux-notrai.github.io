
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
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if we have the required configuration
let app: FirebaseApp | null = null;
let auth = null;
let database: Database | null = null;

// Validate Firebase configuration
const isFirebaseConfigValid = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.error(`Missing required Firebase configuration: ${missingFields.join(', ')}`);
    return false;
  }
  return true;
};

if (isFirebaseConfigValid()) {
  try {
    // Initialize Firebase only once
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Only initialize database if databaseURL is provided
    if (firebaseConfig.databaseURL) {
      database = getDatabase(app);
      console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);
      console.log("Realtime Database URL:", firebaseConfig.databaseURL);
    } else {
      console.warn('Missing VITE_FIREBASE_DATABASE_URL environment variable. Realtime Database will not be available.');
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn('Firebase configuration is missing or incomplete. Firebase features will be disabled.');
}

export { app, auth, database };
