
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';
import CustomButton from '../components/CustomButton';

const Index: React.FC = () => {
  // Observer for scroll animations
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fade-up');
          element.classList.remove('opacity-0');
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on mount
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);
  
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      
      {/* Call to action section */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 z-0" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl space-y-4 text-center md:text-left opacity-0 animate-on-scroll">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Ready to transform your design workflow?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Join thousands of designers who've elevated their projects with our platform.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 opacity-0 animate-on-scroll animation-delay-200">
                  <CustomButton size="lg">
                    Get Started
                  </CustomButton>
                  <CustomButton variant="outline" size="lg">
                    Book a Demo
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="max-w-xl mx-auto text-center mb-16 opacity-0 animate-on-scroll">
            <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Loved by designers worldwide
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Selflo has completely transformed how I approach design projects. The attention to detail is unmatched.",
                author: "Alex Morgan",
                role: "UI Designer"
              },
              {
                quote: "The simplicity and elegance of this platform allowed our team to focus on what matters most - creating exceptional experiences.",
                author: "Sarah Chen",
                role: "Product Lead"
              },
              {
                quote: "I've tried many design tools, but nothing comes close to the precision and thoughtfulness built into Selflo.",
                author: "James Wilson",
                role: "Creative Director"
              }
            ].map((testimonial, index) => (
              <div 
                key={testimonial.author}
                className={`glass-card rounded-xl p-6 opacity-0 animate-on-scroll animation-delay-${(index + 1) * 100}`}
              >
                <div className="flex flex-col space-y-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-10 w-10 text-primary/20" 
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-lg">{testimonial.quote}</p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
