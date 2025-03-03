
// Define types for the application

// Task-related types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | string;
  createdAt: Date | string;
  listId?: string; // Add listId to associate tasks with lists
}

export interface TaskList {
  id: string;
  name: string;
  color?: string;
}

// Event-related types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  description?: string;
  color?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

// Reflection-related types
export interface Reflection {
  id: string;
  date: Date | string;
  accomplishments: string;
  challenges: string;
  insights: string;
  goals: string;
}

// Pomodoro-related types
export interface PomodoroSession {
  id: string;
  date: Date | string;
  duration: number;
  task?: string;
}

// Form props types
export interface TaskFormProps {
  task?: Task;
  lists?: TaskList[];
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export interface ReflectionFormProps {
  onSubmit: (reflection: Reflection) => void;
  onCancel: () => void;
  initialData?: Reflection;
}
