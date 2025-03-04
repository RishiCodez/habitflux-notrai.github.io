
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Edit, Trash, MoreVertical } from 'lucide-react';
import CustomButton from './CustomButton';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  project?: string;
  listId?: string;  // Added listId property
}

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  lists?: Array<{ id: string; name: string; color: string }>;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, onEdit, lists }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onDelete(task.id);
    setIsMenuOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onEdit(task);
    setIsMenuOpen(false);
  };
  
  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsMenuOpen(!isMenuOpen);
  };

  // Find the list this task belongs to
  const taskList = task.listId && lists ? lists.find(list => list.id === task.listId) : undefined;
  
  return (
    <div className={cn(
      "glass-card p-4 rounded-lg transition-all duration-200",
      task.completed ? "opacity-60" : ""
    )}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onComplete(task.id)}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border transition-colors",
            task.completed 
              ? "bg-primary border-primary text-primary-foreground" 
              : "border-input hover:border-primary"
          )}
        >
          {task.completed && <Check className="h-4 w-4 m-auto" />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={cn(
              "text-base font-medium transition-all",
              task.completed ? "line-through text-muted-foreground" : ""
            )}>
              {task.title}
            </h3>
            {task.project && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {task.project}
              </span>
            )}
            {taskList && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full text-white",
                taskList.color
              )}>
                {taskList.name}
              </span>
            )}
          </div>
          
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                priorityColors[task.priority]
              )}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <span className="text-xs text-muted-foreground">
                  Due: {task.dueDate}
                </span>
              )}
            </div>
            
            <div className="relative">
              <CustomButton
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={handleMenuToggle}
              >
                <MoreVertical className="h-4 w-4" />
              </CustomButton>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-card border z-10">
                  <div className="py-1">
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={handleEdit}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleDelete}
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
