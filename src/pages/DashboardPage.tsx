
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '../components/AppLayout';
import { CheckCircle, Circle, Clock, Calendar, BarChart3, BookOpen } from 'lucide-react';
import TaskCard, { Task } from '../components/TaskCard';
import CustomButton from '../components/CustomButton';
import { useToast } from '@/hooks/use-toast';

// Sample tasks for demonstration
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft the initial proposal for the new client project',
    completed: false,
    priority: 'high',
    dueDate: '2023-07-15',
    project: 'Work'
  },
  {
    id: '2',
    title: 'Schedule team meeting',
    description: 'Coordinate with team members for the weekly sync',
    completed: false,
    priority: 'medium',
    project: 'Work'
  },
  {
    id: '3',
    title: 'Grocery shopping',
    description: 'Buy vegetables, fruits, and other essentials',
    completed: false,
    priority: 'low',
    dueDate: '2023-07-10',
    project: 'Personal'
  }
];

// Sample reflections for demonstration
const sampleReflections = [
  {
    id: '1',
    date: '2023-07-09',
    accomplishments: 'Completed the website design, had a productive meeting with the team.',
    challenges: 'Got distracted during the afternoon session, need to work on focus.',
    insights: 'Breaking tasks into smaller chunks helps me maintain focus and momentum.'
  }
];

const DashboardPage: React.FC = () => {
  const [tasks] = useState<Task[]>(sampleTasks);
  const { toast } = useToast();
  
  // Placeholder function for demo
  const handleStartTimer = () => {
    toast({
      title: "Timer started",
      description: "Your focus session has begun. Stay focused!",
    });
  };
  
  // Stats for the dashboard
  const stats = [
    {
      title: "Tasks Completed",
      value: "12",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "In Progress",
      value: "5",
      icon: Circle,
      color: "text-blue-500"
    },
    {
      title: "Focus Time",
      value: "8.5h",
      icon: Clock,
      color: "text-purple-500"
    },
    {
      title: "Productivity",
      value: "85%",
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
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            ))}
            
            <CustomButton className="w-full" variant="outline">
              View All Tasks
            </CustomButton>
          </div>
        </div>
        
        {/* Focus Timer */}
        <div>
          <div className="glass-card p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold">25:00</div>
              <p className="text-sm text-muted-foreground">Ready to start a focus session?</p>
              <CustomButton className="w-full" onClick={handleStartTimer}>
                <Clock className="mr-2 h-4 w-4" />
                Start Focus Session
              </CustomButton>
              <div className="text-xs text-muted-foreground">
                Complete <span className="font-medium">4</span> sessions today
              </div>
            </div>
          </div>
          
          {/* Daily Reflection */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Daily Reflection</h2>
            </div>
            
            {sampleReflections.length > 0 ? (
              <div>
                <p className="text-sm mb-2">
                  <span className="font-medium">Accomplishments:</span> {sampleReflections[0].accomplishments}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Challenges:</span> {sampleReflections[0].challenges}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Insights:</span> {sampleReflections[0].insights}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  No reflection for today yet. Take a moment to reflect on your day.
                </p>
                <CustomButton size="sm">
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
