
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (!auth) {
        throw new Error('Firebase is not initialized');
      }
      
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        setError('No account exists with this email address');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError(error.message || 'Failed to send password reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {success 
              ? "Password reset email sent. Check your inbox!" 
              : "Enter your email and we'll send you instructions to reset your password."}
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Password Reset Email Sent</h3>
              <p className="text-green-700 dark:text-green-400 mt-2">
                We've sent instructions to {email}. Please check your inbox and spam folder.
              </p>
            </div>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/login" className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xl font-medium">
                Email Address
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
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-lg rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
            
            <div className="text-center">
              <Link 
                to="/login" 
                className="text-primary hover:underline flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
