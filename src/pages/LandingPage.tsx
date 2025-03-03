import { useNavigate } from 'react-router-dom';
import CustomButton from '@/components/CustomButton';
import { 
  ClipboardCheck, Clock, Calendar, Brain, ChevronRight, 
  Star, Target, Layout, Sparkles, RefreshCw
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Selflo</h1>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">How It Works</a></li>
            <li><a href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors">Testimonials</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section flex items-center">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6 text-left animate-fade-up">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Personal Productivity & Learning Assistant
              </h1>
              <p className="text-xl text-foreground/80 max-w-lg">
                Plan your day, focus on tasks, and reflect on your progress with AI-powered assistance.
              </p>
              <div className="pt-4 flex space-x-4">
                <CustomButton 
                  size="lg" 
                  onClick={handleGetStarted}
                >
                  Get Started
                </CustomButton>
                <CustomButton 
                  variant="outline" 
                  size="lg"
                  onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})}
                >
                  Learn More <ChevronRight className="ml-2 h-4 w-4" />
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Everything you need to boost your productivity and maintain your focus
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-lg animate-fade-up feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-foreground/70">
                Create and organize tasks with custom lists, priorities, and due dates. Filter and sort to focus on what matters most.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-200 feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pomodoro Timer</h3>
              <p className="text-foreground/70">
                Enhance your focus with customizable Pomodoro sessions. Track your focus time and build productive habits.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-300 feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Planner</h3>
              <p className="text-foreground/70">
                Plan your day efficiently with an interactive daily schedule. Add, edit, and remove events with ease.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-400 feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Reflection</h3>
              <p className="text-foreground/70">
                Build self-awareness through guided daily reflections. Track your progress and identify areas for improvement.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-500 feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Focus Tracking</h3>
              <p className="text-foreground/70">
                Monitor your focus sessions and productivity trends. Set goals and celebrate your progress.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg animate-fade-up animation-delay-600 feature-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Dashboard</h3>
              <p className="text-foreground/70">
                View all your important information at a glance with a personalized dashboard experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Simple steps to boost your productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <ClipboardCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Plan Your Day</h3>
              <p className="text-foreground/70">
                Use the Daily Planner and Task Manager to organize your day efficiently
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Focus With Pomodoro</h3>
              <p className="text-foreground/70">
                Use the Pomodoro timer to maintain focus and track your productive time
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Reflect & Improve</h3>
              <p className="text-foreground/70">
                Complete daily reflections to learn from your experiences and improve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity
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
                "Selflo has completely transformed how I manage my day. The combination of task management and focus tools helps me stay on track."
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jane Doe</h4>
                  <p className="text-sm text-muted-foreground">Marketing Manager</p>
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
                "The daily reflection feature has been eye-opening for me. I've become much more aware of my productivity patterns and have made real improvements."
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Smith</h4>
                  <p className="text-sm text-muted-foreground">Software Developer</p>
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
                "I love the simplicity and effectiveness of Selflo. The Pomodoro timer has helped me overcome procrastination and focus on what matters."
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">AJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Alex Johnson</h4>
                  <p className="text-sm text-muted-foreground">Graduate Student</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start using Selflo today and take control of your time and focus.
            </p>
            <CustomButton 
              size="lg" 
              onClick={handleGetStarted}
              className="px-8"
            >
              Get Started Now <Sparkles className="ml-2 h-5 w-5" />
            </CustomButton>
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
