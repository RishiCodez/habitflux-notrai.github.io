
import React, { useState } from 'react';
import { X } from 'lucide-react';
import CustomButton from './CustomButton';

interface TourGuideProps {
  onComplete: () => void;
}

type TourStep = {
  title: string;
  description: string;
  targetId: string;
  position: 'top' | 'right' | 'bottom' | 'left';
};

const TourGuide: React.FC<TourGuideProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tourSteps: TourStep[] = [
    {
      title: 'Welcome to your Task Manager',
      description: 'This tour will help you get started with the task management system.',
      targetId: 'tasks-container',
      position: 'top',
    },
    {
      title: 'Add Your First Task',
      description: 'Click this button to create a new task with a title, description, priority, and due date.',
      targetId: 'add-task-button',
      position: 'left',
    },
    {
      title: 'Organize with Lists',
      description: 'Create different lists to categorize your tasks by project, context, or any way you prefer.',
      targetId: 'new-list-button',
      position: 'left',
    },
    {
      title: 'Filter Your Tasks',
      description: 'Use these lists to quickly filter and find the tasks you need to focus on.',
      targetId: 'lists-bar',
      position: 'bottom',
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];
  const targetElement = document.getElementById(currentTourStep.targetId);
  
  // Default position if target element not found
  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999
  };
  
  // Position the tooltip relative to the target element if it exists
  if (targetElement) {
    const targetRect = targetElement.getBoundingClientRect();
    
    switch (currentTourStep.position) {
      case 'top':
        tooltipStyle = {
          position: 'absolute',
          bottom: `calc(100vh - ${targetRect.top}px + 10px)`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
          zIndex: 9999
        };
        break;
      case 'right':
        tooltipStyle = {
          position: 'absolute',
          left: `${targetRect.right + 10}px`,
          top: `${targetRect.top + targetRect.height / 2}px`,
          transform: 'translateY(-50%)',
          zIndex: 9999
        };
        break;
      case 'bottom':
        tooltipStyle = {
          position: 'absolute',
          top: `${targetRect.bottom + 10}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
          zIndex: 9999
        };
        break;
      case 'left':
        tooltipStyle = {
          position: 'absolute',
          right: `calc(100vw - ${targetRect.left}px + 10px)`,
          top: `${targetRect.top + targetRect.height / 2}px`,
          transform: 'translateY(-50%)',
          zIndex: 9999
        };
        break;
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleSkip}></div>
      
      {/* Tooltip */}
      <div 
        className="bg-card border shadow-lg rounded-lg p-4 w-80 z-[9999] fixed"
        style={tooltipStyle}
      >
        <button 
          onClick={handleSkip}
          className="absolute top-2 right-2 p-1 hover:bg-accent rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="mb-4">
          <h3 className="font-bold text-lg">{currentTourStep.title}</h3>
          <p className="text-muted-foreground text-sm">{currentTourStep.description}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {tourSteps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <CustomButton variant="outline" size="sm" onClick={handleSkip}>
              Skip
            </CustomButton>
            <CustomButton size="sm" onClick={handleNext}>
              {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourGuide;
