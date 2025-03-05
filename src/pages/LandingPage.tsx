
import { useNavigate } from 'react-router-dom';
import CustomButton from '@/components/CustomButton';
import { 
  ClipboardCheck, Clock, Share2, ChevronRight, 
  Star, Target, Layout, Sparkles, RefreshCw, LogIn, UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">selflo.app</h1>
        <nav className="flex items-center space-x-4">
          <ul className="hidden md:flex space-x-8 mr-6">
            <li><a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors">Testimonials</a></li>
            <li><a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a></li>
          </ul>
          
          {currentUser ? (
            <CustomButton 
              onClick={handleGetStarted}
              variant="outline"
              className="flex items-center"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Dashboard
            </CustomButton>
          ) : (
            <div className="flex space-x-2">
              <CustomButton 
                onClick={handleLogin}
                variant="outline"
                className="flex items-center"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </CustomButton>
              <CustomButton 
                onClick={handleSignup}
                className="flex items-center"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Get Started
              </CustomButton>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section flex items-center">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6 text-left animate-fade-up">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Transform Your Productivity
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-primary">
                Set Goals. Track Progress. Achieve More.
              </h2>
              <p className="text-xl text-foreground/80 max-w-lg">
                selflo.app helps you break down your goals into actionable steps, track your progress, and stay motivated throughout your journey.
              </p>
              <div className="pt-4 flex space-x-4">
                <CustomButton 
                  size="lg" 
                  onClick={handleGetStarted}
                >
                  Get Started
                </CustomButton>
              </div>
            </div>

            <div className="md:w-5/12 w-full max-w-md glass-card rounded-xl p-6 animate-fade-up animation-delay-200">
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">Welcome to selflo.app!</h2>
                {currentUser ? (
                  <>
                    <p className="text-muted-foreground">
                      Welcome back! Click the button below to access your dashboard.
                    </p>
                    <CustomButton 
                      className="w-full mt-4" 
                      onClick={handleGetStarted}
                    >
                      Go to Dashboard
                    </CustomButton>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Sign in to access all features or continue as a guest.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <CustomButton 
                        variant="outline"
                        onClick={handleLogin}
                        className="flex items-center justify-center"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </CustomButton>
                      <CustomButton 
                        onClick={handleSignup}
                        className="flex items-center justify-center"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </CustomButton>
                    </div>
                    <div className="relative mt-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>
                    <CustomButton 
                      variant="secondary"
                      className="w-full" 
                      onClick={handleGetStarted}
                    >
                      Continue as Guest
                    </CustomButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section bg-accent/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Everything you need to stay organized and achieve your goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-lg animate-fade-up feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">📃 Lists</h3>
              <p className="text-foreground/70">
                Organize and separate your lists effortlessly.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-200 feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">⏳ Pomodoro Timer</h3>
              <p className="text-foreground/70">
                Set Pomodoro Timers for non-stop, distraction free work.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-300 feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">🌐 Shareable todos</h3>
              <p className="text-foreground/70">
                Share todo's with your friends seamlessly via X, Whatsapp and more.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing (Coming soon)</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="glass-card p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-3xl font-bold mb-4">Free/forever</p>
              
              <CustomButton 
                onClick={handleGetStarted}
                className="w-full mt-4"
              >
                Get Started
              </CustomButton>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section bg-accent/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Regular Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Join hundreds of satisfied users achieving their goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-lg animate-fade-up testimonial-card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mb-4 text-foreground/90">
                "selflo.app has completely transformed how I approach my goals. The visual tracking keeps me motivated!"
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">SJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Entrepreneur</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-200 testimonial-card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mb-4 text-foreground/90">
                "I like Selflo.app and it's features, such a powerful tool!"
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">MB</span>
                </div>
                <div>
                  <h4 className="font-semibold">Mboya</h4>
                  <p className="text-sm text-muted-foreground">Developer</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-300 testimonial-card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mb-4 text-foreground/90">
                "Selflo has made learning and task management so much simpler. It helps me stay organized without any hassle."
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">PR</span>
                </div>
                <div>
                  <h4 className="font-semibold">Priyanka</h4>
                  <p className="text-sm text-muted-foreground">Educator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 rounded-xl text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">selflo.app</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Your personal goal achievement companion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 mb-8">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-foreground/70 hover:text-foreground">Features</a></li>
                  <li><a href="#pricing" className="text-foreground/70 hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="text-foreground/70 hover:text-foreground">How it works</a></li>
                </ul>
              </div>
            </div>
            {currentUser ? (
              <CustomButton 
                size="lg" 
                onClick={handleGetStarted}
                className="px-8"
              >
                Go to Dashboard <ChevronRight className="ml-2 h-5 w-5" />
              </CustomButton>
            ) : (
              <CustomButton 
                size="lg" 
                onClick={handleSignup}
                className="px-8"
              >
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </CustomButton>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground/60">© 2025 Selflo.app. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
