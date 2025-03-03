// Add or update the Task interface to include listId
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  listId?: string; // Add this property to fix the TypeScript errors
}

interface TaskList {
    id: string;
    name: string;
    color: string;
}

interface DailyEvent {
    id: string;
    title: string;
    time: string;
    description?: string;
}
