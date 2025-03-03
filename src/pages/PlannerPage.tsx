
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '../components/AppLayout';
import { Calendar, ChevronLeft, ChevronRight, Clock, PlusCircle, X } from 'lucide-react';
import CustomButton from '../components/CustomButton';
import { loadEvents, saveEvents } from '../utils/localStorageUtils';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  category: 'work' | 'personal' | 'focus' | 'meeting';
}

const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: '09:00',
    end: '10:00',
    category: 'meeting'
  },
  {
    id: '2',
    title: 'Project Work',
    start: '10:30',
    end: '12:30',
    category: 'work'
  },
  {
    id: '3',
    title: 'Lunch Break',
    start: '12:30',
    end: '13:30',
    category: 'personal'
  },
  {
    id: '4',
    title: 'Focus Session',
    start: '14:00',
    end: '16:00',
    category: 'focus'
  },
  {
    id: '5',
    title: 'Client Call',
    start: '16:30',
    end: '17:00',
    category: 'meeting'
  }
];

const PlannerPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    start: '09:00',
    end: '10:00',
    category: 'work'
  });
  
  const { toast } = useToast();
  
  // Load events from local storage on component mount
  useEffect(() => {
    const savedEvents = loadEvents();
    if (savedEvents) {
      setEvents(savedEvents);
    } else {
      setEvents(defaultEvents);
      saveEvents(defaultEvents);
    }
  }, []);
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hoursOfDay = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'personal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'focus':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'meeting':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const updatedEvents = [
      ...events,
      {
        id: Date.now().toString(),
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        category: newEvent.category as 'work' | 'personal' | 'focus' | 'meeting'
      }
    ];

    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setShowEventForm(false);
    setNewEvent({
      title: '',
      start: '09:00',
      end: '10:00',
      category: 'work'
    });

    toast({
      title: "Event added",
      description: "Your event has been added to the planner"
    });
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    
    toast({
      title: "Event deleted",
      description: "Your event has been removed from the planner"
    });
  };
  
  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daily Planner</h1>
        <div className="flex items-center space-x-2">
          <CustomButton variant="outline" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </CustomButton>
          <CustomButton variant="outline" size="sm" onClick={handleToday}>
            Today
          </CustomButton>
          <CustomButton variant="outline" size="sm" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </CustomButton>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-lg font-medium">
            {daysOfWeek[currentDate.getDay()]}, {formatDate(currentDate)}
          </div>
          <div className="text-sm text-muted-foreground">
            Your daily schedule
          </div>
        </div>
        
        <CustomButton onClick={() => setShowEventForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Event
        </CustomButton>
      </div>
      
      {showEventForm && (
        <div className="glass-card rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Add New Event</h3>
            <button 
              onClick={() => setShowEventForm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Event title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({...newEvent, category: e.target.value as any})}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="focus">Focus</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <CustomButton onClick={handleAddEvent}>
                Add Event
              </CustomButton>
            </div>
          </div>
        </div>
      )}
      
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 bg-secondary/50 border-b dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-medium">Daily Schedule</h2>
            </div>
            <div className="flex space-x-2">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Work
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Personal
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Focus
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                Meeting
              </span>
            </div>
          </div>
        </div>
        
        <div className="divide-y dark:divide-gray-700">
          {hoursOfDay.map((hour) => {
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            const hourEvents = events.filter(event => {
              const eventHour = parseInt(event.start.split(':')[0]);
              return eventHour === hour;
            });
            
            return (
              <div key={hour} className="flex">
                <div className="w-16 py-3 px-4 text-sm text-muted-foreground border-r dark:border-gray-700 flex items-start">
                  {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                <div className="flex-1 min-h-[80px] py-2 px-4 relative">
                  {hourEvents.length > 0 ? (
                    <div className="space-y-2">
                      {hourEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={cn(
                            "px-3 py-2 rounded-md text-sm relative group",
                            getCategoryColors(event.category)
                          )}
                        >
                          <div className="font-medium flex justify-between">
                            {event.title}
                            <button 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-xs mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.start} - {event.end}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      <span className="opacity-50">No events</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default PlannerPage;
