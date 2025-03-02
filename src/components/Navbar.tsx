
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import CustomButton from './CustomButton';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'py-3 glass-effect' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="text-xl font-semibold tracking-tight transition-opacity duration-200 hover:opacity-80">
          Selflo
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          {["Features", "About", "Pricing", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          <CustomButton variant="ghost" size="sm" className="hidden md:flex">
            Log in
          </CustomButton>
          <CustomButton variant="primary" size="sm">
            Get Started
          </CustomButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
