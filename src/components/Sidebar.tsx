
import React from 'react';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Clock, Calendar, MessageSquare, Settings, X, Lock, BookOpen } from 'lucide-react';
import CustomButton from './CustomButton';
import { useAuth } from '../contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { currentUser } = useAuth();
  const isGuest = currentUser?.isGuest || false;
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard', guestRestricted: true },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks', guestRestricted: true },
    { name: 'Pomodoro', icon: Clock, path: '/pomodoro', guestRestricted: false },
    { name: 'Planner', icon: Calendar, path: '/planner', guestRestricted: true },
    { name: 'Reflections', icon: BookOpen, path: '/reflections', guestRestricted: true },
    { name: 'Assistant', icon: MessageSquare, path: '/assistant', guestRestricted: true },
    { name: 'Settings', icon: Settings, path: '/settings', guestRestricted: true },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b">
          <h1 className="text-xl font-semibold">Notrai Habitflux</h1>
          <CustomButton 
            variant="ghost" 
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </CustomButton>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        isGuest && item.guestRestricted && "opacity-50 pointer-events-none"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {isGuest && item.guestRestricted && (
                        <Lock className="h-3.5 w-3.5 ml-auto" />
                      )}
                    </NavLink>
                  </div>
                </TooltipTrigger>
                {isGuest && item.guestRestricted && (
                  <TooltipContent>
                    <p>Sign in with Google to access this feature</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
