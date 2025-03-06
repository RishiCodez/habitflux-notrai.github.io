
import React from 'react';
import { Pencil, Trash2, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  project?: string;
  listId?: string;
}

interface TaskCardProps {
  task: Task;
  lists?: { id: string; name: string; color: string; isShared?: boolean }[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  readOnly?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  lists, 
  onComplete, 
  onDelete, 
  onEdit,
  readOnly = false
}) => {
  const { title, description, completed, priority, dueDate, project, listId } = task;
  
  const handleComplete = () => {
    if (!readOnly && onComplete) {
      onComplete(task.id);
    }
  };
  
  const handleDelete = () => {
    if (!readOnly && onDelete) {
      onDelete(task.id);
    }
  };
  
  const handleEdit = () => {
    if (!readOnly && onEdit) {
      onEdit(task);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const priorityClasses = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };
  
  const getListColor = () => {
    if (!listId || !lists) return '';
    const list = lists.find(l => l.id === listId);
    return list ? list.color : '';
  };
  
  const getListName = () => {
    if (!listId || !lists) return '';
    const list = lists.find(l => l.id === listId);
    return list ? list.name : '';
  };
  
  return (
    <div
      className={cn(
        "glass-card p-4 rounded-xl transition-all relative",
        completed ? "opacity-70" : "",
        listId && lists ? `border-l-4 ${getListColor()}` : ""
      )}
    >
      <div className="flex items-start gap-3">
        <button 
          onClick={handleComplete} 
          className={cn("mt-1 flex-shrink-0", readOnly ? "cursor-default" : "cursor-pointer")}
          disabled={readOnly}
        >
          {completed ? (
            <CheckCircle className="h-6 w-6 text-primary" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-lg font-medium line-clamp-2",
            completed && "line-through text-muted-foreground"
          )}>
            {title}
          </h3>
          
          {description && (
            <p className={cn(
              "text-muted-foreground mt-1 line-clamp-3",
              completed && "line-through"
            )}>
              {description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityClasses[priority]}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
            
            {dueDate && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Due: {formatDate(dueDate)}
              </span>
            )}
            
            {project && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {project}
              </span>
            )}
            
            {listId && lists && (
              <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getListColor()}`}>
                {getListName()}
              </span>
            )}
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex space-x-1">
            <button 
              onClick={handleEdit}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Pencil className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
