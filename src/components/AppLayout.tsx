
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import { Menu, LogOut } from 'lucide-react';
import CustomButton from './CustomButton';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, logout } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        sidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        {/* Header with menu button and user profile */}
        <header className="flex items-center justify-between px-4 h-14 border-b dark:border-gray-800">
          <div className="flex items-center">
            <CustomButton 
              variant="ghost" 
              size="sm" 
              className="mr-2 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </CustomButton>
            <h1 className="text-xl font-semibold">Notrai Habitflux</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {currentUser?.displayName ? currentUser.displayName[0] : 'U'}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {currentUser?.displayName || 'User'}
                  </div>
                  {currentUser?.email && (
                    <div className="px-2 pb-1.5 text-xs text-muted-foreground">
                      {currentUser.email}
                    </div>
                  )}
                  <CustomButton 
                    variant="ghost" 
                    size="sm" 
                    className="flex justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </CustomButton>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
