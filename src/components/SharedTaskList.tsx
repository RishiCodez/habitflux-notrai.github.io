
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Users, Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard, { Task } from './TaskCard';
import TaskForm from './TaskForm';
import CollaborationModal from './CollaborationModal';
import { 
  subscribeToSharedList, 
  unsubscribeFromSharedList,
  addTaskToSharedList,
  updateSharedTask,
  deleteSharedTask
} from '../utils/realtimeDbUtils';

interface SharedTaskListProps {
  sharedListId: string;
}

const SharedTaskList: React.FC<SharedTaskListProps> = ({ sharedListId }) => {
  const [sharedList, setSharedList] = useState<any>(null);
  const [sharedTasks, setSharedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!sharedListId) return;
    
    setIsLoading(true);
    
    const listRef = subscribeToSharedList(sharedListId, (data) => {
      if (data) {
        setSharedList(data);
        
        // Convert tasks object to array
        if (data.tasks) {
          const tasksArray = Object.entries(data.tasks).map(([id, task]: [string, any]) => ({
            id,
            ...task
          }));
          setSharedTasks(tasksArray);
        } else {
          setSharedTasks([]);
        }
      } else {
        toast({
          title: "Shared list not found",
          description: "The shared list you're trying to access doesn't exist",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    });
    
    return () => {
      // Clean up subscription
      unsubscribeFromSharedList(listRef);
    };
  }, [sharedListId, toast]);

  const handleAddTask = async (task: Task) => {
    if (editingTask) {
      // Update existing task
      try {
        await updateSharedTask(sharedListId, task.id, task);
        toast({
          title: "Task updated",
          description: "Task has been successfully updated in the shared list",
        });
      } catch (error) {
        toast({
          title: "Error updating task",
          description: "Failed to update the task. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Add new task
      try {
        await addTaskToSharedList(sharedListId, task);
        toast({
          title: "Task added",
          description: "New task has been added to the shared list",
        });
      } catch (error) {
        toast({
          title: "Error adding task",
          description: "Failed to add the task. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    setShowForm(false);
    setEditingTask(undefined);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };
  
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteSharedTask(sharedListId, id);
      toast({
        title: "Task deleted",
        description: "Task has been successfully removed from the shared list",
      });
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCompleteTask = async (id: string) => {
    const task = sharedTasks.find(task => task.id === id);
    if (task) {
      try {
        await updateSharedTask(sharedListId, id, { 
          completed: !task.completed 
        });
      } catch (error) {
        toast({
          title: "Error updating task",
          description: "Failed to update the task status. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading shared tasks...</span>
      </div>
    );
  }

  if (!sharedList) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Shared list not found</h2>
        <p className="mt-2 text-muted-foreground">
          The shared list you're trying to access doesn't exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            {sharedList.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Collaborative task list • {sharedList.collaborators?.length || 1} collaborator(s)
          </p>
        </div>
        
        <Button onClick={() => setShowCollaborationModal(true)}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      
      {showForm && (
        <div className="mb-6 glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            {editingTask ? 'Edit Shared Task' : 'Add New Shared Task'}
          </h2>
          <TaskForm
            task={editingTask}
            onSubmit={handleAddTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(undefined);
            }}
          />
        </div>
      )}
      
      <div className="mb-4">
        <Button onClick={() => setShowForm(true)}>
          Add Task
        </Button>
      </div>
      
      <div className="space-y-4">
        {sharedTasks.length > 0 ? (
          sharedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ))
        ) : (
          <div className="glass-card p-8 rounded-xl text-center">
            <h3 className="text-lg font-medium">No tasks yet</h3>
            <p className="text-muted-foreground">
              Start by adding a task to this shared list.
            </p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="mt-4">
                Add Your First Task
              </Button>
            )}
          </div>
        )}
      </div>
      
      <CollaborationModal
        isOpen={showCollaborationModal}
        onClose={() => setShowCollaborationModal(false)}
        sharedListId={sharedListId}
        sharedListName={sharedList.name}
      />
    </div>
  );
};

export default SharedTaskList;
