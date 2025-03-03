
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '../components/AppLayout';
import { CheckCircle, Circle, Clock, Calendar, BarChart3, BookOpen, Edit } from 'lucide-react';
import TaskCard, { Task } from '../components/TaskCard';
import CustomButton from '../components/CustomButton';
import { useToast } from '@/hooks/use-toast';
import PomodoroTimer from '../components/PomodoroTimer';
import { loadTasks, saveTasks, loadFocusTime, saveFocusTime, loadReflections, saveReflection } from '../utils/localStorageUtils';
import ReflectionForm from '../components/ReflectionForm';

// Sample reflection for demonstration
const sampleReflection = {
  id: '1',
  date: new Date().toISOString(),
  accomplishments: 'Completed the website design, had a productive meeting with the team.',
  challenges: 'Got distracted during the afternoon session, need to work on focus.',
  insights: 'Breaking tasks into smaller chunks helps me maintain focus and momentum.'
};

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusTime, setFocusTime] = useState(0); // Total focus time in minutes
  const [showReflectionForm, setShowReflectionForm] = useState(false);
  const [todayReflection, setTodayReflection] = useState<any>(null);
  const { toast } = useToast();
  
  // Load data from local storage on component mount
  useEffect(() => {
    // Load tasks
    const savedTasks = loadTasks();
    if (savedTasks) {
      setTasks(savedTasks);
    }
    
    // Load focus time
    const savedFocusTime = loadFocusTime();
    setFocusTime(savedFocusTime);
    
    // Load today's reflection if it exists
    const reflections = loadReflections() || [];
    const today = new Date().toISOString().split('T')[0];
    const todaysReflection = reflections.find((r: any) => r.date.split('T')[0] === today);
    if (todaysReflection) {
      setTodayReflection(todaysReflection);
    }
  }, []);
  
  // Calculate stats for the dashboard
  const completedTasks = tasks.filter(task => task.completed).length;
  const inProgressTasks = tasks.filter(task => !task.completed).length;
  const focusHours = (focusTime / 60).toFixed(1);
  
  // Calculate productivity percentage (completed tasks / total tasks * 100)
  const productivityPercentage = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;
  
  // Function to handle task completion
  const handleCompleteTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks); // Save to local storage
    
    toast({
      title: "Task updated",
      description: "Task status has been updated.",
    });
  };
  
  // Function to track focus time
  const handleFocusSessionComplete = (minutes: number) => {
    const newFocusTime = focusTime + minutes;
    setFocusTime(newFocusTime);
    saveFocusTime(minutes); // Save to local storage
    
    toast({
      title: "Focus session completed",
      description: `You've completed a ${minutes} minute focus session!`,
    });
  };

  // Function to handle reflection submission
  const handleReflectionSubmit = (reflection: any) => {
    setTodayReflection(reflection);
    saveReflection(reflection);
    setShowReflectionForm(false);
    
    toast({
      title: "Reflection saved",
      description: "Your daily reflection has been saved.",
    });
  };
  
  // Stats for the dashboard
  const stats = [
    {
      title: "Tasks Completed",
      value: completedTasks.toString(),
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "In Progress",
      value: inProgressTasks.toString(),
      icon: Circle,
      color: "text-blue-500"
    },
    {
      title: "Focus Time",
      value: `${focusHours}h`,
      icon: Clock,
      color: "text-purple-500"
    },
    {
      title: "Productivity",
      value: `${productivityPercentage}%`,
      icon: BarChart3,
      color: "text-orange-500"
    }
  ];
  
  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="glass-card p-4 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className={cn("p-2 rounded-full bg-background", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks For Today */}
        <div className="lg:col-span-2 glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Tasks</h2>
            <CustomButton size="sm" variant="outline" onClick={() => {}}>
              View All
            </CustomButton>
          </div>
          
          <div className="space-y-4">
            {tasks.slice(0, 4).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            ))}
            
            <CustomButton className="w-full" variant="outline" onClick={() => window.location.href = '/tasks'}>
              View All Tasks
            </CustomButton>
          </div>
        </div>
        
        {/* Focus Timer */}
        <div>
          <div className="glass-card p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
            <PomodoroTimer 
              initialWorkMinutes={25}
              initialBreakMinutes={5}
              onSessionComplete={handleFocusSessionComplete}
            />
          </div>
          
          {/* Daily Reflection */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Daily Reflection</h2>
              </div>
              {todayReflection && (
                <CustomButton variant="outline" size="sm" onClick={() => setShowReflectionForm(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </CustomButton>
              )}
            </div>
            
            {showReflectionForm ? (
              <ReflectionForm 
                onSubmit={handleReflectionSubmit}
                onCancel={() => setShowReflectionForm(false)}
                initialData={todayReflection}
              />
            ) : todayReflection ? (
              <div>
                <p className="text-sm mb-2">
                  <span className="font-medium">Accomplishments:</span> {todayReflection.accomplishments}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Challenges:</span> {todayReflection.challenges}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Insights:</span> {todayReflection.insights}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  No reflection for today yet. Take a moment to reflect on your day.
                </p>
                <CustomButton size="sm" onClick={() => setShowReflectionForm(true)}>
                  Add Reflection
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
