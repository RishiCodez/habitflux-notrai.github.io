
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

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRHBQvnVLjmkNwv-90ATnCCQrzegcd6V8",
  authDomain: "selflo-app.firebaseapp.com",
  projectId: "selflo-app",
  storageBucket: "selflo-app.appspot.com",
  messagingSenderId: "1061151672741",
  appId: "1:1061151672741:web:64ba1b75daa2ef33ad0b0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar');

interface User {
  displayName?: string;
  email?: string;
  uid: string;
  photoURL?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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

  // Connect Google Calendar
  const connectGoogleCalendar = async () => {
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
      await signOut(auth);
      localStorage.removeItem('googleCalendarToken');
      setIsGoogleCalendarConnected(false);
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

  const value = {
    currentUser,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    firebaseInitialized: true,
    isGoogleCalendarConnected,
    connectGoogleCalendar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
