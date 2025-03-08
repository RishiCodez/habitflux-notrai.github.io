
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    console.log('Signup attempted with:', email);
  };

  const handleContinueAsGuest = async () => {
    try {
      await continueAsGuest();
    } catch (error) {
      setError('Failed to continue as guest');
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
