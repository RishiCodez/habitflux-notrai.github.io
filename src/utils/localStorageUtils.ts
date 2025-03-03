
// Utility functions for handling local storage

// Task storage
export const saveTasks = (tasks: any[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const loadTasks = () => {
  const tasksData = localStorage.getItem('tasks');
  return tasksData ? JSON.parse(tasksData) : null;
};

// Theme storage
export const saveTheme = (isDarkMode: boolean) => {
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
};

export const loadTheme = () => {
  const theme = localStorage.getItem('darkMode');
  return theme ? JSON.parse(theme) : false; // default to light mode
};

// Reflection storage
export const saveReflection = (reflection: any) => {
  const reflections = loadReflections() || [];
  
  // Check if today's reflection already exists
  const today = new Date().toISOString().split('T')[0];
  const existingIndex = reflections.findIndex((r: any) => r.date.split('T')[0] === today);
  
  if (existingIndex >= 0) {
    // Update existing reflection
    reflections[existingIndex] = { ...reflections[existingIndex], ...reflection };
  } else {
    // Add new reflection
    reflections.unshift({ ...reflection, date: today, id: Date.now().toString() });
  }
  
  localStorage.setItem('reflections', JSON.stringify(reflections));
};

export const loadReflections = () => {
  const reflectionsData = localStorage.getItem('reflections');
  return reflectionsData ? JSON.parse(reflectionsData) : null;
};

// Focus time storage
export const saveFocusTime = (minutes: number) => {
  const currentTime = loadFocusTime();
  localStorage.setItem('focusTime', JSON.stringify(currentTime + minutes));
};

export const loadFocusTime = () => {
  const focusTime = localStorage.getItem('focusTime');
  return focusTime ? JSON.parse(focusTime) : 0;
};
