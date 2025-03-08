
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import CustomButton from '../components/CustomButton';

const LoginPage: React.FC = () => {
  const { continueAsGuest, loading, firebaseInitialized } = useAuth();

  const handleContinueAsGuest = async () => {
    try {
      await continueAsGuest();
      // Success toast is shown in the continueAsGuest function
    } catch (error) {
      // Error handling is done in the continueAsGuest function
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-md w-full glass-card rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Notrai Habitflux</h1>
          <p className="text-muted-foreground mt-2">Track habits, boost productivity</p>
        </div>
        
        {firebaseInitialized ? (
          <div className="space-y-6">
            <CustomButton 
              className="w-full" 
              onClick={handleContinueAsGuest}
              disabled={loading}
            >
              {loading ? "Loading..." : "Continue as Guest"}
            </CustomButton>

            <div className="text-center text-sm text-muted-foreground">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md">
            <h3 className="font-medium mb-2">Firebase Not Configured</h3>
            <p className="text-sm">
              To use authentication, you need to add your Firebase configuration to the .env file.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
