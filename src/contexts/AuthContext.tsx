
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { checkFirstVisit } from '../utils/localStorageUtils';
import { app, auth } from '../utils/firebase';

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
  const [firebaseInitialized, setFirebaseInitialized] = useState(!!app);
  const navigate = useNavigate();

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

  const loginWithGoogle = async () => {
    if (!auth) {
      toast.error('Firebase not initialized. Check your environment variables.');
      return Promise.reject(new Error('Firebase not initialized'));
    }
    
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
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

  const connectGoogleCalendar = async () => {
    if (!auth) {
      toast.error('Firebase not initialized. Check your environment variables.');
      return Promise.reject(new Error('Firebase not initialized'));
    }
    
    try {
      setLoading(true);
      
      if (!currentUser) {
        await loginWithGoogle();
        return;
      }
      
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

  const logout = async () => {
    try {
      setLoading(true);
      
      if (auth) {
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

  const value = {
    currentUser,
    loading,
    login,
    signup,
    loginWithGoogle,
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
