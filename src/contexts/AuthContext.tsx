
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { saveFirstVisitComplete, checkFirstVisit } from '../utils/localStorageUtils';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if API key is available
const app = import.meta.env.VITE_FIREBASE_API_KEY ? 
  initializeApp(firebaseConfig) : 
  null;

// Initialize auth only if Firebase is initialized
const auth = app ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar');

interface User {
  displayName?: string;
  email?: string;
  uid: string;
  photoURL?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  firebaseInitialized: boolean;
  isGoogleCalendarConnected: boolean;
  connectGoogleCalendar: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(!!app);
  const navigate = useNavigate();

  // Check if user has Google Calendar connection
  const checkGoogleCalendarConnection = (user: FirebaseUser | null) => {
    if (user) {
      const googleCalendarConnected = user.providerData.some(
        provider => provider.providerId === 'google.com'
      );
      setIsGoogleCalendarConnected(googleCalendarConnected);
      localStorage.setItem('isGoogleCalendarConnected', JSON.stringify(googleCalendarConnected));
    } else {
      setIsGoogleCalendarConnected(false);
      localStorage.removeItem('isGoogleCalendarConnected');
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return () => {};
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || undefined,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined
        });
        checkGoogleCalendarConnection(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    if (!auth) {
      toast.error('Firebase not initialized. Check your environment variables.');
      return Promise.reject(new Error('Firebase not initialized'));
    }
    
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signup = async (email: string, password: string) => {
    if (!auth) {
      toast.error('Firebase not initialized. Check your environment variables.');
      return Promise.reject(new Error('Firebase not initialized'));
    }
    
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Signup failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google (which also gives us calendar access)
  const loginWithGoogle = async () => {
    if (!auth) {
      toast.error('Firebase not initialized. Check your environment variables.');
      return Promise.reject(new Error('Firebase not initialized'));
    }
    
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // This gives you a Google Access Token for calendar API
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      // Store token for calendar API access
      if (token) {
        localStorage.setItem('googleCalendarToken', token);
        setIsGoogleCalendarConnected(true);
      }
      
      navigate('/dashboard');
      toast.success('Logged in with Google successfully');
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Google login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login as guest
  const loginAsGuest = async () => {
    try {
      setLoading(true);
      
      // Create a guest user
      const guestUser: User = {
        uid: `guest-${Date.now()}`,
        displayName: 'Guest',
        isGuest: true
      };
      
      setCurrentUser(guestUser);
      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      
      // Check if this is their first visit to show the tour
      const isFirstVisit = checkFirstVisit();
      if (isFirstVisit) {
        // We'll mark the visit in the tour completion
      } else {
        saveFirstVisitComplete(); // In case they've visited before
      }
      
      navigate('/dashboard');
      toast.success('Logged in as guest successfully! Explore the app and enjoy.');
      
    } catch (error) {
      console.error('Guest login failed:', error);
      toast.error('Guest login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Connect Google Calendar
  const connectGoogleCalendar = async () => {
    if (!auth) {
      toast.error('Firebase not initialized. Check your environment variables.');
      return Promise.reject(new Error('Firebase not initialized'));
    }
    
    try {
      setLoading(true);
      
      // If user is not logged in, we need to sign in with Google
      if (!currentUser) {
        await loginWithGoogle();
        return;
      }
      
      // If user is logged in but not with Google, we need to link Google account
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (token) {
        localStorage.setItem('googleCalendarToken', token);
        setIsGoogleCalendarConnected(true);
        toast.success('Google Calendar connected successfully');
      }
    } catch (error) {
      console.error('Google Calendar connection failed:', error);
      toast.error('Failed to connect Google Calendar. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      
      if (currentUser?.isGuest) {
        // For guest users, just clear the localStorage
        localStorage.removeItem('guestUser');
      } else if (auth) {
        // For authenticated users, sign out from Firebase
        await signOut(auth);
      }
      
      localStorage.removeItem('googleCalendarToken');
      setIsGoogleCalendarConnected(false);
      setCurrentUser(null);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check for guest user in localStorage on initial load
  useEffect(() => {
    if (!currentUser && !loading) {
      const guestUserData = localStorage.getItem('guestUser');
      if (guestUserData) {
        try {
          const guestUser = JSON.parse(guestUserData);
          setCurrentUser(guestUser);
        } catch (error) {
          console.error('Error parsing guest user data:', error);
          localStorage.removeItem('guestUser');
        }
      }
    }
  }, [loading]);

  const value = {
    currentUser,
    loading,
    login,
    signup,
    loginWithGoogle,
    loginAsGuest,
    logout,
    firebaseInitialized,
    isGoogleCalendarConnected,
    connectGoogleCalendar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
