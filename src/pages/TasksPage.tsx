import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Search, ListFilter, FolderPlus, CheckSquare, Users, Share2, Trash2 } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import TaskCard, { Task } from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import CustomButton from '../components/CustomButton';
import SharedTaskList from '../components/SharedTaskList';
import InvitationsList from '../components/InvitationsList';
import ShareOptions from '../components/ShareOptions';
import { useToast } from '@/hooks/use-toast';
import { 
  saveTasks, 
  loadTasks, 
  saveTaskLists, 
  loadTaskLists, 
  checkFirstVisit, 
  saveFirstVisitComplete 
} from '../utils/localStorageUtils';
import { 
  createSharedTaskList, 
  getSharedListIdFromUrl
} from '../utils/realtimeDbUtils';
import TourGuide from '../components/TourGuide';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from 'react-router-dom';

interface TaskList {
  id: string;
  name: string;
  color: string;
  isShared?: boolean;
}

const defaultLists: TaskList[] = [
  { id: 'work', name: 'Work', color: 'bg-blue-500' },
  { id: 'personal', name: 'Personal', color: 'bg-purple-500' },
  { id: 'shopping', name: 'Shopping', color: 'bg-green-500' }
];

// Use the current user's email from the auth context if available
const currentUserEmail = 'user@example.com';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'low' | 'medium' | 'high' | null>(null);
  const [listFilter, setListFilter] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState('bg-blue-500');
  const [showTour, setShowTour] = useState(false);
  const [showSharedListModal, setShowSharedListModal] = useState(false);
  const [newSharedListName, setNewSharedListName] = useState('');
  const [sharedListId, setSharedListId] = useState<string | null>(null);
  const [isCreatingSharedList, setIsCreatingSharedList] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const loadInitialData = useCallback(async () => {
    const savedTasks = loadTasks();
    if (savedTasks) {
      setTasks(savedTasks);
    } else {
      setTasks([]);
      saveTasks([]);
    }

    const savedLists = loadTaskLists();
    if (savedLists) {
      setTaskLists(savedLists);
    } else {
      setTaskLists(defaultLists);
      saveTaskLists(defaultLists);
    }
    
    const isFirstVisit = checkFirstVisit();
    if (isFirstVisit) {
      setShowTour(true);
    }
    
    // Modified to check URL params first, then try from location state
    const urlSharedListId = getSharedListIdFromUrl();
    if (urlSharedListId) {
      setSharedListId(urlSharedListId);
    } else if (location.state?.sharedListId) {
      setSharedListId(location.state.sharedListId);
      
      // Update URL with shared list ID
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('shared', location.state.sharedListId);
      window.history.pushState({}, '', newUrl.toString());
    }
  }, [location]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const projects = Array.from(new Set(tasks.map(task => task.project).filter(Boolean)));
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesStatus = 
      filter === 'all' ? true :
      filter === 'active' ? !task.completed :
      task.completed;
    
    const matchesProject = !projectFilter || task.project === projectFilter;
    
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    
    const matchesList = !listFilter || task.listId === listFilter;
    
    return matchesSearch && matchesStatus && matchesProject && matchesPriority && matchesList;
  });
  
  const handleAddTask = (task: Task) => {
    let updatedTasks;
    
    if (editingTask) {
      updatedTasks = tasks.map(t => t.id === task.id ? task : t);
      setTasks(updatedTasks);
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    } else {
      updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      toast({
        title: "Task added",
        description: "Your new task has been successfully created.",
      });
    }
    
    saveTasks(updatedTasks);
    setShowForm(false);
    setEditingTask(undefined);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };
  
  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast({
      title: "Task deleted",
      description: "Your task has been successfully removed.",
    });
  };
  
  const handleCompleteTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleAddList = () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive"
      });
      return;
    }

    const newList = {
      id: newListName.toLowerCase().replace(/\s+/g, '-'),
      name: newListName,
      color: newListColor
    };

    const updatedLists = [...taskLists, newList];
    setTaskLists(updatedLists);
    saveTaskLists(updatedLists);
    setShowListForm(false);
    setNewListName('');
    setNewListColor('bg-blue-500');

    toast({
      title: "List created",
      description: `"${newListName}" list has been created.`
    });
  };

  const handleDeleteList = (id: string) => {
    const tasksInList = tasks.filter(task => task.listId === id);
    if (tasksInList.length > 0) {
      toast({
        title: "Cannot delete list",
        description: "There are tasks associated with this list. Please delete them first or move them to another list.",
        variant: "destructive"
      });
      return;
    }

    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete the "${taskLists.find(list => list.id === id)?.name}" list?`)) {
      const updatedLists = taskLists.filter(list => list.id !== id);
      setTaskLists(updatedLists);
      saveTaskLists(updatedLists);
      if (listFilter === id) {
        setListFilter(null);
      }
      
      toast({
        title: "List deleted",
        description: "The list has been successfully removed."
      });
    }
  };
  
  const colorOptions = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  const handleTourComplete = () => {
    setShowTour(false);
    saveFirstVisitComplete();
    toast({
      title: "Tour completed",
      description: "You're all set to start using the task manager!",
    });
  };
  
  const handleCreateSharedList = async () => {
    if (!newSharedListName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your shared list",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreatingSharedList(true);
    
    try {
      const userId = currentUserEmail;
      const newSharedListId = await createSharedTaskList(newSharedListName, userId);
      
      const newList = {
        id: newSharedListId,
        name: newSharedListName,
        color: 'bg-indigo-500',
        isShared: true
      };
      
      const updatedLists = [...taskLists, newList];
      setTaskLists(updatedLists);
      saveTaskLists(updatedLists);
      
      setSharedListId(newSharedListId);
      setShowSharedListModal(false);
      
      // Update URL with shared list ID
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('shared', newSharedListId);
      window.history.pushState({}, '', newUrl.toString());
      
      toast({
        title: "Shared list created",
        description: `"${newSharedListName}" collaborative list has been created.`
      });
    } catch (error) {
      toast({
        title: "Error creating shared list",
        description: "There was a problem creating your shared list",
        variant: "destructive"
      });
    } finally {
      setIsCreatingSharedList(false);
      setNewSharedListName('');
    }
  };
  
  const handleBackToMyTasks = () => {
    setSharedListId(null);
    
    const url = new URL(window.location.href);
    url.searchParams.delete('shared');
    window.history.replaceState({}, '', url.toString());
  };
  
  const handleAcceptInvitation = (listId: string) => {
    setSharedListId(listId);
    
    // Update URL with shared list ID
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('shared', listId);
    window.history.pushState({}, '', newUrl.toString());
  };
  
  const handleShareCurrentList = () => {
    setShowShareOptions(true);
  };
  
  return (
    <AppLayout>
      {showTour && <TourGuide onComplete={handleTourComplete} />}
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {sharedListId ? 'Collaborative Tasks' : 'Task Management'}
        </h1>
        
        <div className="flex space-x-2">
          {sharedListId ? (
            <>
              <CustomButton onClick={handleBackToMyTasks} variant="outline">
                Back to My Tasks
              </CustomButton>
              <CustomButton onClick={handleShareCurrentList} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton onClick={handleShareCurrentList} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </CustomButton>
              <CustomButton onClick={() => setShowSharedListModal(true)} variant="outline">
                <Users className="mr-2 h-4 w-4" />
                New Shared List
              </CustomButton>
              <CustomButton onClick={() => setShowListForm(true)} variant="outline" id="new-list-button">
                <FolderPlus className="mr-2 h-4 w-4" />
                New List
              </CustomButton>
              <CustomButton onClick={() => setShowForm(true)} id="add-task-button">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </CustomButton>
            </>
          )}
        </div>
      </div>
      
      {sharedListId ? (
        <SharedTaskList sharedListId={sharedListId} currentUserEmail={currentUserEmail} />
      ) : (
        <>
          <div className="mb-6 glass-card p-3 rounded-lg overflow-x-auto" id="lists-bar">
            <div className="flex space-x-2 min-w-max">
              <button
                onClick={() => setListFilter(null)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  !listFilter 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <CheckSquare className="h-4 w-4 mr-2 inline-block" />
                All Tasks
              </button>
              
              {taskLists.map(list => (
                <div key={list.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (list.isShared) {
                        // For shared lists, navigate to the tasks page with the shared list ID
                        setSharedListId(list.id);
                        
                        // Update URL with shared list ID
                        const newUrl = new URL(window.location.href);
                        newUrl.searchParams.set('shared', list.id);
                        window.history.pushState({}, '', newUrl.toString());
                      } else {
                        setListFilter(list.id);
                      }
                    }}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                      (listFilter === list.id || (list.isShared && sharedListId === list.id))
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <span className={`h-3 w-3 rounded-full mr-2 ${list.color}`}></span>
                    {list.name} {list.isShared && <Users className="ml-1 h-3 w-3" />}
                  </button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0 ml-1">
                        <span className="sr-only">Open menu</span>
                        <span className="h-1 w-1 rounded-full bg-current"></span>
                        <span className="h-1 w-1 rounded-full bg-current"></span>
                        <span className="h-1 w-1 rounded-full bg-current"></span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 flex items-center cursor-pointer"
                        onClick={() => handleDeleteList(list.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete List
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
          
          {showListForm && (
            <div className="mb-6 glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Create New List</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">List Name</label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter list name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">List Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewListColor(color)}
                        className={cn(
                          `h-8 w-8 rounded-full ${color}`,
                          newListColor === color && "ring-2 ring-offset-2 ring-primary"
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <CustomButton 
                    variant="outline" 
                    onClick={() => setShowListForm(false)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton onClick={handleAddList}>
                    Create List
                  </CustomButton>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full h-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                  className="h-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Tasks</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                
                <select
                  value={priorityFilter || ''}
                  onChange={(e) => setPriorityFilter(e.target.value ? e.target.value as 'low' | 'medium' | 'high' : null)}
                  className="h-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                
                <select
                  value={projectFilter || ''}
                  onChange={(e) => setProjectFilter(e.target.value || null)}
                  className="h-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {showForm && (
            <div className="mb-6 glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <TaskForm
                task={editingTask}
                lists={taskLists}
                onSubmit={handleAddTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(undefined);
                }}
              />
            </div>
          )}
          
          <div className="space-y-4" id="tasks-container">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  lists={taskLists}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              ))
            ) : (
              <div className="glass-card p-8 rounded-xl text-center">
                <div className="flex flex-col items-center justify-center">
                  <img 
                    src="/lovable-uploads/ee69a7fe-8e00-4753-909b-b10210f77674.png" 
                    alt="Person working at desk" 
                    className="max-w-full h-auto max-h-64 mb-6"
                  />
                  <h3 className="text-lg font-medium">No tasks found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filter !== 'all' || projectFilter || priorityFilter || listFilter
                      ? "Try adjusting your filters to see more tasks."
                      : "Add a new task to get started."}
                  </p>
                  {!showForm && (
                    <CustomButton onClick={() => setShowForm(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Task
                    </CustomButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      <Dialog open={showSharedListModal} onOpenChange={setShowSharedListModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Create Collaborative Task List
            </DialogTitle>
            <DialogDescription>
              Create a shared task list that you can collaborate on with others in real-time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="shared-list-name" className="text-sm font-medium">
                List Name
              </label>
              <Input
                id="shared-list-name"
                value={newSharedListName}
                onChange={(e) => setNewSharedListName(e.target.value)}
                placeholder="Enter a name for your shared list"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSharedListModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSharedList}
              disabled={isCreatingSharedList || !newSharedListName.trim()}
            >
              {isCreatingSharedList ? 'Creating...' : 'Create Shared List'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ShareOptions
        isOpen={showShareOptions}
        onClose={() => setShowShareOptions(false)}
        taskList={filteredTasks}
        isSharedList={!!sharedListId}
        sharedListLink={sharedListId ? window.location.href : undefined}
        listName={listFilter ? taskLists.find(list => list.id === listFilter)?.name || "My Tasks" : "My Tasks"}
      />
    </AppLayout>
  );
};

export default TasksPage;
