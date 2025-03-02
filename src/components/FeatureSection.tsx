
import React from 'react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: "Intuitive Design",
    description: "Create beautiful interfaces with our easy-to-use platform that feels natural and intuitive.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
    )
  },
  {
    title: "Responsive Framework",
    description: "Build once and deploy everywhere with fully responsive components that work on any device.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>
    )
  },
  {
    title: "Component Library",
    description: "Access our extensive library of pre-built components to accelerate your development process.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M3 2v2.5"></path><path d="m9 2 3 2v2"></path><path d="M21 9h-4.5"></path><path d="M21 15h-4.5"></path><path d="M3 22v-2.5"></path><path d="m9 22 3-2v-2"></path><path d="M18 12v.5"></path><path d="M21 12v.5"></path><path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 6-2.3"></path><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3"></path></svg>
    )
  },
  {
    title: "Performance Optimized",
    description: "Experience lightning-fast performance with our optimized codebase and efficient rendering.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="m8 18-6-6 6-6"></path><path d="m16 6 6 6-6 6"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
    )
  }
];

const FeatureSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="max-w-xl mx-auto text-center mb-16 opacity-0 animate-fade-up">
          <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
            Features
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Crafted with attention to detail
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform combines powerful features with elegant design principles to create a seamless experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={cn(
                "glass-card rounded-xl p-6 opacity-0",
                `animate-scale-in animation-delay-${(index + 1) * 100}`
              )}
            >
              <div className="flex flex-col space-y-4">
                <div className="p-2 w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
