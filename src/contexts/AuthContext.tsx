import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail
} from 'firebase/auth';
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
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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

    if (auth) {
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            navigate('/dashboard', { replace: true });
            toast.success('Signed in with Google successfully');
          }
        })
        .catch((error) => {
          console.error('Error with redirect sign-in:', error);
          if (error.code !== 'auth/popup-closed-by-user') {
            toast.error('Failed to sign in with Google');
          }
        });
    }

    return unsubscribe;
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      if (!auth) {
        toast.error('Firebase is not initialized');
        return;
      }

      setLoading(true);
      const provider = new GoogleAuthProvider();
      
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          navigate('/dashboard', { replace: true });
          toast.success('Signed in with Google successfully');
        }
      }
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(`Failed to sign in with Google: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = async () => {
    try {
      setLoading(true);
      
      const guestUser: User = {
        uid: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        displayName: "Guest User",
        isGuest: true
      };
      
      setCurrentUser(guestUser);
      
      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      
      toast.success('You have access to the Pomodoro timer as a guest user');
      
      navigate('/pomodoro', { replace: true });
      
    } catch (error) {
      console.error('Failed to continue as guest:', error);
      toast.error('Failed to continue as guest');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      throw new Error('Firebase is not initialized');
    }
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      if (auth && currentUser && !currentUser.isGuest) {
        await auth.signOut();
      }
      
      setCurrentUser(null);
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const storedGuestUser = localStorage.getItem('guestUser');
      
      if (storedGuestUser && !currentUser) {
        const guestUser = JSON.parse(storedGuestUser);
        if (guestUser && guestUser.isGuest) {
          setCurrentUser(guestUser);
        }
      }
    } catch (error) {
      console.error('Error retrieving guest user from localStorage:', error);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    loading,
    continueAsGuest,
    signInWithGoogle,
    resetPassword,
    logout,
    firebaseInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
