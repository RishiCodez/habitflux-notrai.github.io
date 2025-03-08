
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import CustomButton from '@/components/CustomButton';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { continueAsGuest, loading, firebaseInitialized } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    // You can add signup functionality here if needed
  };

  const handleContinueAsGuest = async () => {
    try {
      await continueAsGuest();
    } catch (error) {
      setError('Failed to continue as guest');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-md w-full glass-card rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">Join Notrai Habitflux today</p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-start mb-6">
            <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        {firebaseInitialized ? (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800"
                  required
                />
              </div>
              
              <CustomButton className="w-full" type="submit" disabled={loading}>
                Create Account
              </CustomButton>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            
            <CustomButton
              className="w-full"
              variant="outline"
              onClick={handleContinueAsGuest}
              disabled={loading}
            >
              Continue as Guest
            </CustomButton>
            
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
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

export default SignupPage;
