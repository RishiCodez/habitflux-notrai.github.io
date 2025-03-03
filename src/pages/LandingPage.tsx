
import { useNavigate } from 'react-router-dom';
import CustomButton from '@/components/CustomButton';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent">
      {/* Hero Section */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Selflo</h1>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 space-y-6 text-left animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Your Personal Productivity & Learning Assistant
          </h1>
          <p className="text-xl text-foreground/80 max-w-lg">
            Plan your day, focus on tasks, and reflect on your progress with AI-powered assistance.
          </p>
          <div className="pt-4">
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
            <h2 className="text-2xl font-bold">Welcome to Selflo!</h2>
            <p className="text-muted-foreground">
              Click the button below to access all features without any login required.
            </p>
            <CustomButton 
              className="w-full mt-4" 
              onClick={handleGetStarted}
            >
              Enter Dashboard
            </CustomButton>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-lg animate-fade-up">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-foreground/70">Create, organize, and track your tasks with our intuitive interface.</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-200">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pomodoro Timer</h3>
              <p className="text-foreground/70">Focus better with customizable Pomodoro sessions.</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-400">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Planner</h3>
              <p className="text-foreground/70">Plan your day efficiently with our AI-powered planner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground/60">© {new Date().getFullYear()} Selflo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
