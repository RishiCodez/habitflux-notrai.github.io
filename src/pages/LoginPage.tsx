import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, Calendar, AlertCircle, User } from 'lucide-react';
import CustomButton from '../components/CustomButton';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, loginAsGuest, loading, firebaseInitialized } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
      // Success toast is shown in the login function
    } catch (error) {
      // Error handling is done in the login function
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Success toast is shown in the loginWithGoogle function
    } catch (error) {
      // Error handling is done in the loginWithGoogle function
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      toast("Welcome!", {
        description: "You've logged in as a guest. Enjoy exploring the app!"
      });
    } catch (error) {
      // Error handling is done in the loginAsGuest function
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-md w-full glass-card rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Log in to your account to continue</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {firebaseInitialized ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <CustomButton 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </CustomButton>
            </form>
            
            <div className="mt-6">
              <div className="relative flex items-center justify-center">
                <div className="border-t w-full border-gray-300 dark:border-gray-700"></div>
                <div className="px-3 bg-card text-sm text-muted-foreground">or continue with</div>
                <div className="border-t w-full border-gray-300 dark:border-gray-700"></div>
              </div>
              
              <div className="mt-4 space-y-3">
                <CustomButton
                  type="button"
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Calendar className="h-5 w-5 text-primary" />
                  Google (with Calendar)
                </CustomButton>
                
                <CustomButton
                  type="button"
                  onClick={handleGuestLogin}
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <User className="h-5 w-5" />
                  Continue as Guest
                </CustomButton>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <CustomButton
              type="button"
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <User className="h-5 w-5" />
              Continue as Guest
            </CustomButton>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account?</span>{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
