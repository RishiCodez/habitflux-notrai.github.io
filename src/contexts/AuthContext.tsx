
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';

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
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  firebaseInitialized: boolean;
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
  const [firebaseInitialized, setFirebaseInitialized] = useState(!!auth);
  const navigate = useNavigate();

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
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const continueAsGuest = async () => {
    try {
      setLoading(true);
      // Create a guest user object
      const guestUser: User = {
        uid: `guest-${Date.now()}`,
        displayName: "Guest User",
        isGuest: true
      };
      
      setCurrentUser(guestUser);
      navigate('/dashboard');
      toast.success('Continuing as guest');
    } catch (error) {
      console.error('Failed to continue as guest:', error);
      toast.error('Failed to continue as guest');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      if (auth && currentUser && !currentUser.isGuest) {
        await auth.signOut();
      }
      
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
    continueAsGuest,
    logout,
    firebaseInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
