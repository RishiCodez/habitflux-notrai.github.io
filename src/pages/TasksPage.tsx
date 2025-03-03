import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Search, Filter, ListFilter } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import TaskCard, { Task } from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import CustomButton from '../components/CustomButton';
import { useToast } from '@/hooks/use-toast';
import { saveTasks, loadTasks } from '../utils/localStorageUtils';

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft the initial proposal for the new client project',
    completed: false,
    priority: 'high',
    dueDate: '2023-07-15',
    project: 'Work'
  },
  {
    id: '2',
    title: 'Schedule team meeting',
    description: 'Coordinate with team members for the weekly sync',
    completed: true,
    priority: 'medium',
    project: 'Work'
  },
  {
    id: '3',
    title: 'Grocery shopping',
    description: 'Buy vegetables, fruits, and other essentials',
    completed: false,
    priority: 'low',
    dueDate: '2023-07-10',
    project: 'Personal'
  }
];

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'low' | 'medium' | 'high' | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const savedTasks = loadTasks();
    if (savedTasks) {
      setTasks(savedTasks);
    } else {
      setTasks(sampleTasks);
      saveTasks(sampleTasks);
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
    
    return matchesSearch && matchesStatus && matchesProject && matchesPriority;
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
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <CustomButton onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </CustomButton>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full h-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
              className="h-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={priorityFilter || ''}
              onChange={(e) => setPriorityFilter(e.target.value ? e.target.value as 'low' | 'medium' | 'high' : null)}
              className="h-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <select
              value={projectFilter || ''}
              onChange={(e) => setProjectFilter(e.target.value || null)}
              className="h-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
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
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filter !== 'all' || projectFilter || priorityFilter
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
        )}
      </div>
    </AppLayout>
  );
};

export default TasksPage;
