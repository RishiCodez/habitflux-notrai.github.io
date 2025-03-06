
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Edit2, Trash2, AlertCircle, MessageSquare, ArrowUpRight, Share2 } from 'lucide-react';
import ShareOptions from './ShareOptions';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  project?: string;
  listId?: string;
  sharedId?: string;
}

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  lists?: { id: string; name: string; color: string }[];
  readOnly?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onComplete, 
  onDelete, 
  onEdit,
  lists = [],
  readOnly = false
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const taskList = task.listId && lists ? lists.find(list => list.id === task.listId) : null;
  
  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  };
  
  const priorityLabels = {
    low: "Low",
    medium: "Medium",
    high: "High"
  };
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  return (
    <div className={cn(
      "glass-card p-4 rounded-xl transition-all",
      task.completed ? "opacity-70 dark:bg-gray-800/50" : ""
    )}>
      <div className="flex items-start gap-3">
        {onComplete && !readOnly && (
          <button 
            onClick={() => onComplete(task.id)} 
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5",
              task.completed 
                ? "bg-primary border-primary hover:bg-primary/90" 
                : "border-gray-300 hover:border-primary/50 dark:border-gray-600"
            )}
          >
            {task.completed && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
          </button>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-lg break-words",
              task.completed ? "line-through text-muted-foreground" : ""
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setShowShareOptions(true)}
                className="p-1.5 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
              
              {!readOnly && onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
              
              {!readOnly && onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1.5 rounded-full text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {task.description && (
            <p className="mt-1 text-muted-foreground text-sm break-words">
              {task.description}
            </p>
          )}
          
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {taskList && (
              <Badge variant="outline" className={cn("flex items-center gap-1 px-2 py-0.5")}>
                <div className={cn("w-2 h-2 rounded-full", taskList.color)} />
                <span>{taskList.name}</span>
              </Badge>
            )}
            
            {task.priority && (
              <Badge variant="outline" className={cn("px-2 py-0.5", priorityColors[task.priority])}>
                {priorityLabels[task.priority]} Priority
              </Badge>
            )}
            
            {task.project && (
              <Badge variant="outline" className="px-2 py-0.5 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {task.project}
              </Badge>
            )}
          </div>
          
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
            
            {task.dueDate && (
              <span className="ml-2 flex items-center">
                •
                <span className={cn(
                  "ml-2 flex items-center",
                  isOverdue ? "text-destructive" : ""
                )}>
                  {isOverdue && <AlertCircle className="h-3 w-3 mr-1" />}
                  Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                </span>
              </span>
            )}
            
            {task.sharedId && (
              <span className="ml-2 flex items-center">
                • <MessageSquare className="h-3 w-3 mx-1" /> Shared
              </span>
            )}
          </div>
        </div>
      </div>
      
      <ShareOptions
        isOpen={showShareOptions}
        onClose={() => setShowShareOptions(false)}
        taskList={[task]}
        listName={taskList?.name || "My Tasks"}
      />
    </div>
  );
};

export default TaskCard;
