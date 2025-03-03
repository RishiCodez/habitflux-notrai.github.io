import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Task } from './TaskCard';
import CustomButton from './CustomButton';
import { v4 as uuidv4 } from 'uuid';

interface TaskFormProps {
  task?: Task;
  lists?: TaskList[];  // Add this property to fix the TypeScript error
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, lists, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('');
  
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
      setProject(task.project || '');
    }
  }, [task]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedTask: Task = {
      id: task ? task.id : uuidv4(),
      title,
      description: description || undefined,
      completed: task ? task.completed : false,
      priority,
      dueDate: dueDate || undefined,
      project: project || undefined,
    };
    
    onSubmit(updatedTask);
    
    // Reset form if creating a new task
    if (!task) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setProject('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Task title"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Task description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="project" className="block text-sm font-medium mb-1">
          Project
        </label>
        <input
          id="project"
          type="text"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Project name"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <CustomButton variant="outline" type="button" onClick={onCancel}>
          Cancel
        </CustomButton>
        <CustomButton type="submit">
          {task ? 'Update Task' : 'Add Task'}
        </CustomButton>
      </div>
    </form>
  );
};

export default TaskForm;
