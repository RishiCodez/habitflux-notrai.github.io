
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import CustomButton from './CustomButton';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  initialWorkMinutes?: number;
  initialBreakMinutes?: number;
  onSessionComplete?: (minutes: number) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  initialWorkMinutes = 25,
  initialBreakMinutes = 5,
  onSessionComplete
}) => {
  const [workMinutes, setWorkMinutes] = useState(initialWorkMinutes);
  const [breakMinutes, setBreakMinutes] = useState(initialBreakMinutes);
  
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const focusAlarmRef = useRef<HTMLAudioElement | null>(null);
  const breakAlarmRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Initialize audio elements
  useEffect(() => {
    // Using Google alarm sounds via direct URLs
    focusAlarmRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
    breakAlarmRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    
    focusAlarmRef.current.volume = 0.7;
    breakAlarmRef.current.volume = 0.7;
    
    return () => {
      if (focusAlarmRef.current) {
        focusAlarmRef.current.pause();
      }
      if (breakAlarmRef.current) {
        breakAlarmRef.current.pause();
      }
    };
  }, []);
  
  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (mode === 'work') {
        // Play focus-end alarm when timer ends
        if (soundEnabled && focusAlarmRef.current) {
          focusAlarmRef.current.play().catch(e => console.error("Could not play sound:", e));
        }
        
        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Break time!", {
            body: "Take a short break to recharge.",
            icon: "/favicon.ico"
          });
        }
        
        toast({
          title: "Break time!",
          description: "Take a short break to recharge.",
        });
        
        if (onSessionComplete) {
          onSessionComplete(workMinutes);
        }
        
        // Switch to break mode
        setMode('break');
        setTimeLeft(breakMinutes * 60);
        setCycles(cycles + 1);
      } else {
        // Play break-end alarm when break ends
        if (soundEnabled && breakAlarmRef.current) {
          breakAlarmRef.current.play().catch(e => console.error("Could not play sound:", e));
        }
        
        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Break finished!", {
            body: "Your break has ended. Start a new session when ready.",
            icon: "/favicon.ico"
          });
        }
        
        toast({
          title: "Break finished!",
          description: "Your break has ended. Start a new session when ready.",
        });
        
        // Stop the timer and reset to work mode
        setIsActive(false);
        setMode('work');
        setTimeLeft(workMinutes * 60);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, workMinutes, breakMinutes, cycles, toast, onSessionComplete, soundEnabled]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(workMinutes * 60);
    setCycles(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleWorkMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 60) {
      setWorkMinutes(value);
      if (mode === 'work' && !isActive) {
        setTimeLeft(value * 60);
      }
    }
  };
  
  const handleBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 30) {
      setBreakMinutes(value);
      if (mode === 'break' && !isActive) {
        setTimeLeft(value * 60);
      }
    }
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast({
      title: soundEnabled ? "Sound disabled" : "Sound enabled",
      description: soundEnabled ? "Notifications will be silent." : "You'll hear a sound when timer ends.",
    });
  };
  
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div
            className={cn(
              "inline-flex rounded-full p-1",
              "bg-secondary"
            )}
          >
            <button
              onClick={() => {
                if (!isActive) {
                  setMode('work');
                  setTimeLeft(workMinutes * 60);
                }
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                mode === 'work'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Focus
            </button>
            <button
              onClick={() => {
                if (!isActive) {
                  setMode('break');
                  setTimeLeft(breakMinutes * 60);
                }
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                mode === 'break'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Break
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="text-6xl font-bold tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {mode === 'work' ? 'Focus Session' : 'Break Time'} | Cycles: {cycles}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <CustomButton onClick={toggleTimer} size="lg" variant={isActive ? "secondary" : "primary"}>
            {isActive ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </CustomButton>
          <CustomButton onClick={resetTimer} size="lg" variant="outline">
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </CustomButton>
          <CustomButton onClick={toggleSound} size="sm" variant="ghost">
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </CustomButton>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-sm font-medium mb-4">Timer Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="workMinutes" className="block text-xs mb-1">
              Focus Time (minutes)
            </label>
            <input
              id="workMinutes"
              type="number"
              min="1"
              max="60"
              value={workMinutes}
              onChange={handleWorkMinutesChange}
              disabled={isActive}
              className="w-full px-3 py-1 text-sm border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="breakMinutes" className="block text-xs mb-1">
              Break Time (minutes)
            </label>
            <input
              id="breakMinutes"
              type="number"
              min="1"
              max="30"
              value={breakMinutes}
              onChange={handleBreakMinutesChange}
              disabled={isActive}
              className="w-full px-3 py-1 text-sm border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
