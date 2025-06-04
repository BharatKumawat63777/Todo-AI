import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { Task, TaskStatus } from '../types';
import { fetchTasks, createTask, updateTask, deleteTask, searchSimilarTasks } from '../services/api';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to add task. Please try again.');
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (!query) {
      loadTasks();
      return;
    }

    setIsSearching(true);
    try {
      const similarTasks = await searchSimilarTasks(query);
      setTasks(similarTasks);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search tasks. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const filteredTasks = tasks
    .filter(task => filter === 'all' || task.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search similar tasks..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TaskForm onAddTask={handleAddTask} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-colors ${filter === 'todo' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setFilter('todo')}
        >
          To Do
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-colors ${filter === 'in progress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setFilter('in progress')}
        >
          In Progress
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-colors ${filter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setFilter('done')}
        >
          Done
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          onUpdateTask={handleUpdateTask} 
          onDeleteTask={handleDeleteTask} 
        />
      )}
    </div>
  );
};

export default TaskBoard;