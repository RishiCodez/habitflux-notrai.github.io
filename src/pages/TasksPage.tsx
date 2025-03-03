import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Search, Filter, ListFilter, List, FolderPlus, CheckSquare } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import TaskCard, { Task } from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import CustomButton from '../components/CustomButton';
import { useToast } from '@/hooks/use-toast';
import { saveTasks, loadTasks, saveTaskLists, loadTaskLists } from '../utils/localStorageUtils';

interface TaskList {
  id: string;
  name: string;
  color: string;
}

const defaultLists: TaskList[] = [
  { id: 'work', name: 'Work', color: 'bg-blue-500' },
  { id: 'personal', name: 'Personal', color: 'bg-purple-500' },
  { id: 'shopping', name: 'Shopping', color: 'bg-green-500' }
];

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
  
  const { toast } = useToast();

  useEffect(() => {
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
  }, []);

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
    // Don't allow deleting if tasks are associated with this list
    const tasksInList = tasks.filter(task => task.listId === id);
    if (tasksInList.length > 0) {
      toast({
        title: "Cannot delete list",
        description: "There are tasks associated with this list. Please delete them first or move them to another list.",
        variant: "destructive"
      });
      return;
    }

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
  };
  
  const colorOptions = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex space-x-2">
          <CustomButton onClick={() => setShowListForm(true)} variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            New List
          </CustomButton>
          <CustomButton onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </CustomButton>
        </div>
      </div>
      
      {/* Lists Bar */}
      <div className="mb-6 glass-card p-3 rounded-lg overflow-x-auto">
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
            <button
              key={list.id}
              onClick={() => setListFilter(list.id)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                listFilter === list.id 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className={`h-3 w-3 rounded-full mr-2 ${list.color}`}></span>
              {list.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* List Form */}
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
      
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
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
    </AppLayout>
  );
};

export default TasksPage;
