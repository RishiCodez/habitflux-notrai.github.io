
import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { Moon, Sun, Bell, User, Clock, Palette, Save } from 'lucide-react';
import CustomButton from '../components/CustomButton';
import { useToast } from '@/hooks/use-toast';
import { saveTheme, loadTheme, savePomodoroSettings, loadPomodoroSettings } from '../utils/localStorageUtils';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4
  });
  const [userName, setUserName] = useState('User');
  
  const { toast } = useToast();
  
  // Load settings from local storage on component mount
  useEffect(() => {
    const savedTheme = loadTheme();
    setDarkMode(savedTheme);
    
    // Apply the theme to the document
    if (savedTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Load Pomodoro settings if available
    const savedPomodoroSettings = loadPomodoroSettings();
    if (savedPomodoroSettings) {
      setPomodoroSettings(savedPomodoroSettings);
    }
  }, []);
  
  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveTheme(newDarkMode);
    
    // Apply the theme to the document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleSaveSettings = () => {
    // Save settings to local storage
    saveTheme(darkMode);
    savePomodoroSettings(pomodoroSettings);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="glass-card p-6 rounded-xl dark:bg-gray-800">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-orange-500" />
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={handleDarkModeToggle}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <Moon className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications Settings */}
          <div className="glass-card p-6 rounded-xl dark:bg-gray-800">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive alerts for tasks and events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Pomodoro Settings */}
          <div className="glass-card p-6 rounded-xl dark:bg-gray-800">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Pomodoro Timer</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Focus Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroSettings.workDuration}
                  onChange={(e) => setPomodoroSettings({
                    ...pomodoroSettings,
                    workDuration: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Break Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={pomodoroSettings.shortBreakDuration}
                  onChange={(e) => setPomodoroSettings({
                    ...pomodoroSettings,
                    shortBreakDuration: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Long Break Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={pomodoroSettings.longBreakDuration}
                  onChange={(e) => setPomodoroSettings({
                    ...pomodoroSettings,
                    longBreakDuration: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sessions Before Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={pomodoroSettings.sessionsBeforeLongBreak}
                  onChange={(e) => setPomodoroSettings({
                    ...pomodoroSettings,
                    sessionsBeforeLongBreak: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
          
          {/* Profile Settings */}
          <div className="glass-card p-6 rounded-xl dark:bg-gray-800">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <CustomButton onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </CustomButton>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
