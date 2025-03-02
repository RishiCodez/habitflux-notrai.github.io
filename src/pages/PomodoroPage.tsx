
import React from 'react';
import AppLayout from '../components/AppLayout';
import PomodoroTimer from '../components/PomodoroTimer';

const PomodoroPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Pomodoro Timer</h1>
        <p className="text-muted-foreground text-center mb-8">
          Use the Pomodoro technique to boost your productivity with focused work sessions and refreshing breaks.
        </p>
        
        <PomodoroTimer />
        
        <div className="mt-12 glass-card p-6 rounded-xl w-full">
          <h2 className="text-lg font-semibold mb-4">What is the Pomodoro Technique?</h2>
          <p className="text-muted-foreground">
            The Pomodoro Technique is a time management method that uses a timer to break work into intervals, 
            traditionally 25 minutes in length, separated by short breaks. The technique aims to improve focus 
            and concentration by working in short, intense bursts.
          </p>
          
          <h3 className="text-md font-medium mt-4 mb-2">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Set a timer for 25 minutes and work with full focus</li>
            <li>When the timer rings, take a 5-minute break</li>
            <li>After completing four cycles, take a longer 15-30 minute break</li>
            <li>Repeat as necessary</li>
          </ol>
        </div>
      </div>
    </AppLayout>
  );
};

export default PomodoroPage;
