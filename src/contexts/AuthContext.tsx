
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
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

    // Check for redirect result when the component mounts
    if (auth) {
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            // User successfully signed in with redirect
            navigate('/dashboard', { replace: true });
            toast.success('Signed in with Google successfully');
          }
        })
        .catch((error) => {
          console.error('Error with redirect sign-in:', error);
          // Only show error toast if it's not a popup closed error
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
      
      // Add scopes if needed
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Use popup for desktop and redirect for mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        // The result will be handled in the useEffect hook
      } else {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          navigate('/dashboard', { replace: true });
          toast.success('Signed in with Google successfully');
        }
      }
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      
      // Don't show error for user closing the popup
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
      // Create a guest user object
      const guestUser: User = {
        uid: `guest-${Date.now()}`,
        displayName: "Guest User",
        isGuest: true
      };
      
      setCurrentUser(guestUser);
      
      // Force navigation to dashboard with replace: true to prevent back navigation
      console.log("Continuing as guest, navigating to dashboard");
      
      // Add a small delay to ensure the state is updated before navigation
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
        toast.success('Continuing as guest');
        setLoading(false);
      }, 100);
      
    } catch (error) {
      console.error('Failed to continue as guest:', error);
      toast.error('Failed to continue as guest');
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
      navigate('/', { replace: true });
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
    signInWithGoogle,
    logout,
    firebaseInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
