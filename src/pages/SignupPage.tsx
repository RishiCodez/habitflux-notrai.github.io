
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { toast } from 'sonner';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { continueAsGuest, signInWithGoogle, loading, firebaseInitialized } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    try {
      if (!auth) {
        throw new Error('Firebase is not initialized');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const displayName = email.split('@')[0];
      await updateProfile(user, { displayName });
      
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Error creating account:', error);
      let errorMessage = error.message || 'Failed to create account';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Please use a stronger password (at least 6 characters).';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password registration is not enabled. Please contact support.';
      }
      
      setError(errorMessage);
    }
  };

  const handleContinueAsGuest = async () => {
    try {
      console.log("Continue as guest clicked from signup page");
      await continueAsGuest();
    } catch (error) {
      setError('Failed to continue as guest');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setError('Failed to sign in with Google');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Sign up to get started with Notrai Habitflux
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-xl mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {firebaseInitialized ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xl font-medium">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 py-6 text-lg rounded-xl border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-xl font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 py-6 text-lg rounded-xl border-gray-300 dark:border-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xl font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 py-6 text-lg rounded-xl border-gray-300 dark:border-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-lg rounded-xl bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/90"
              disabled={loading}
            >
              Create Account
            </Button>
            
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
              <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400 text-lg">
                or
              </span>
              <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-6 text-lg rounded-xl border-gray-300 dark:border-gray-700 mb-4"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              Sign up with Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-6 text-lg rounded-xl border-gray-300 dark:border-gray-700"
              onClick={handleContinueAsGuest}
              disabled={loading}
            >
              <User className="h-5 w-5" />
              Continue as Guest
            </Button>
            
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <span>Already have an account? </span>
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Log in
              </Link>
            </div>
          </form>
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
