
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import CustomButton from './CustomButton';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser } = useAuth();
  
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
          
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {currentUser?.displayName ? currentUser.displayName[0] : 'U'}
            </AvatarFallback>
          </Avatar>
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
