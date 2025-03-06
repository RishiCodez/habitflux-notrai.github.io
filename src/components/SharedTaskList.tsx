
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Users, Share2, RefreshCw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard, { Task } from './TaskCard';
import TaskForm from './TaskForm';
import CollaborationModal from './CollaborationModal';
import { 
  subscribeToSharedList, 
  unsubscribeFromSharedList,
  addTaskToSharedList,
  updateSharedTask,
  deleteSharedTask,
  acceptInvitation,
  rejectInvitation,
  checkListAccess
} from '../utils/realtimeDbUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SharedTaskListProps {
  sharedListId: string;
  currentUserEmail?: string;
}

interface AccessStatus {
  canAccess: boolean;
  canModify?: boolean;
  reason?: string;
  invitation?: any;
}

const SharedTaskList: React.FC<SharedTaskListProps> = ({ 
  sharedListId,
  currentUserEmail = 'demo@example.com' // For demo purposes
}) => {
  const [sharedList, setSharedList] = useState<any>(null);
  const [sharedTasks, setSharedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!sharedListId) return;
    
    const checkAccess = async () => {
      try {
        const accessResult = await checkListAccess(sharedListId, currentUserEmail);
        setAccessStatus(accessResult as AccessStatus);
        
        if (!(accessResult as AccessStatus).canAccess) {
          setIsLoading(false);
          return;
        }
        
        // If user has access, load the list data
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
      } catch (error) {
        toast({
          title: "Error accessing shared list",
          description: "There was a problem checking your access to this list",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [sharedListId, currentUserEmail, toast]);

  const handleAddTask = async (task: Task) => {
    if (!accessStatus?.canModify && accessStatus?.reason !== 'public-list' && accessStatus?.reason !== 'is-collaborator') {
      toast({
        title: "Permission denied",
        description: "You don't have permission to modify this list",
        variant: "destructive",
      });
      return;
    }
    
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
    if (!accessStatus?.canModify && accessStatus?.reason !== 'public-list' && accessStatus?.reason !== 'is-collaborator') {
      toast({
        title: "Permission denied",
        description: "You don't have permission to modify this list",
        variant: "destructive",
      });
      return;
    }
    
    setEditingTask(task);
    setShowForm(true);
  };
  
  const handleDeleteTask = async (id: string) => {
    if (!accessStatus?.canModify && accessStatus?.reason !== 'public-list' && accessStatus?.reason !== 'is-collaborator') {
      toast({
        title: "Permission denied",
        description: "You don't have permission to modify this list",
        variant: "destructive",
      });
      return;
    }
    
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
    if (!accessStatus?.canModify && accessStatus?.reason !== 'public-list' && accessStatus?.reason !== 'is-collaborator') {
      toast({
        title: "Permission denied",
        description: "You don't have permission to modify this list",
        variant: "destructive",
      });
      return;
    }
    
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
  
  const handleAcceptInvitation = async () => {
    try {
      await acceptInvitation(sharedListId, currentUserEmail);
      
      toast({
        title: "Invitation accepted",
        description: "You are now a collaborator on this list",
      });
      
      // Refresh access status
      const accessResult = await checkListAccess(sharedListId, currentUserEmail);
      setAccessStatus(accessResult as AccessStatus);
    } catch (error: any) {
      toast({
        title: "Error accepting invitation",
        description: error.message || "Failed to accept the invitation",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectInvitation = async () => {
    try {
      await rejectInvitation(sharedListId, currentUserEmail);
      
      toast({
        title: "Invitation rejected",
        description: "You have declined to collaborate on this list",
      });
      
      // Refresh access status
      const accessResult = await checkListAccess(sharedListId, currentUserEmail);
      setAccessStatus(accessResult as AccessStatus);
    } catch (error: any) {
      toast({
        title: "Error rejecting invitation",
        description: error.message || "Failed to reject the invitation",
        variant: "destructive",
      });
    }
  };
  
  const handleDataUpdate = async () => {
    // Refresh the access status and list data
    const accessResult = await checkListAccess(sharedListId, currentUserEmail);
    setAccessStatus(accessResult as AccessStatus);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading shared tasks...</span>
      </div>
    );
  }

  if (!accessStatus?.canAccess) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to access this shared list.
        </p>
      </div>
    );
  }
  
  if (accessStatus?.reason === 'has-invitation') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-5 w-5" />
              {sharedList?.name || "Shared List"}
            </h2>
            <p className="text-sm text-muted-foreground">
              You've been invited to collaborate
            </p>
          </div>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertTitle>You're invited!</AlertTitle>
          <AlertDescription>
            You've been invited to collaborate on this shared task list.
            Accept the invitation to start collaborating or reject it if you're not interested.
          </AlertDescription>
          
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={handleAcceptInvitation}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Accept Invitation
            </Button>
            <Button size="sm" variant="outline" className="text-red-500 border-red-200" onClick={handleRejectInvitation}>
              <XCircle className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </div>
        </Alert>
        
        {sharedTasks.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preview of tasks:</h3>
            {sharedTasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                readOnly={true}
              />
            ))}
            {sharedTasks.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                ...and {sharedTasks.length - 3} more tasks
              </p>
            )}
          </div>
        ) : null}
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
            Collaborative task list • {sharedList.collaborators?.length || 1} collaborator(s) • 
            {sharedList.accessType === 'public' ? ' Public' : ' Private'}
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
        <Button 
          onClick={() => setShowForm(true)} 
          disabled={!accessStatus?.canModify && accessStatus?.reason !== 'public-list' && accessStatus?.reason !== 'is-collaborator'}
        >
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
              readOnly={!accessStatus?.canModify && accessStatus?.reason !== 'public-list' && accessStatus?.reason !== 'is-collaborator'}
            />
          ))
        ) : (
          <div className="glass-card p-8 rounded-xl text-center">
            <h3 className="text-lg font-medium">No tasks yet</h3>
            <p className="text-muted-foreground">
              Start by adding a task to this shared list.
            </p>
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)} 
                className="mt-4"
                disabled={!accessStatus?.canModify && accessStatus?.reason !== 'public-list' && accessStatus?.reason !== 'is-collaborator'}
              >
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
        listData={sharedList}
        onDataUpdate={handleDataUpdate}
      />
    </div>
  );
};

export default SharedTaskList;
