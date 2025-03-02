
import React, { useEffect, useRef } from 'react';
import CustomButton from './CustomButton';

const HeroSection: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const posX = (clientX - centerX) / centerX * 5;
      const posY = (clientY - centerY) / centerY * 5;
      
      if (elementRef.current) {
        elementRef.current.style.transform = `perspective(1000px) rotateX(${-posY}deg) rotateY(${posX}deg) scale3d(1, 1, 1)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background z-0" />
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-8 text-center lg:text-left">
            <div className="space-y-3 opacity-0 animate-fade-up">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                Introducing Selflo
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Design with precision, build with passion
              </h1>
              <p className="text-xl text-muted-foreground">
                Create stunning interfaces with our thoughtfully designed platform that brings your vision to life.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start opacity-0 animate-fade-up animation-delay-200">
              <CustomButton size="lg">
                Get Started
              </CustomButton>
              <CustomButton variant="outline" size="lg">
                Learn More
              </CustomButton>
            </div>
            
            <p className="text-sm text-muted-foreground opacity-0 animate-fade-up animation-delay-300">
              Join thousands of designers and creators who trust our platform
            </p>
          </div>
          
          <div 
            ref={elementRef}
            className="relative w-full max-w-lg opacity-0 animate-fade-in animation-delay-400 transition-transform duration-300 ease-out"
          >
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full opacity-30 filter blur-3xl animate-float" />
            <div className="absolute -bottom-8 right-4 w-72 h-72 bg-blue-300 rounded-full opacity-30 filter blur-3xl animate-float animation-delay-500" />
            
            <div className="relative glass-card rounded-xl p-1 shadow-xl">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Interface design" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 -rotate-12">
                <div className="glass-card px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-medium">Design that inspires</p>
                </div>
              </div>
              
              <div className="absolute -top-6 -left-6 rotate-6">
                <div className="glass-card px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-medium">Pixel perfect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
