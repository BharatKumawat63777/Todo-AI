import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { CheckCircle, Clock, CircleDot, Trash, Edit } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedStatus, setEditedStatus] = useState<TaskStatus>(task.status);

  const statusColors = {
    'todo': 'bg-yellow-100 text-yellow-800',
    'in progress': 'bg-blue-100 text-blue-800',
    'done': 'bg-green-100 text-green-800'
  };

  const statusIcons = {
    'todo': <CircleDot className="h-4 w-4 mr-1" />,
    'in progress': <Clock className="h-4 w-4 mr-1" />,
    'done': <CheckCircle className="h-4 w-4 mr-1" />
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...task,
      title: editedTitle,
      description: editedDescription,
      status: editedStatus
    });
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdate({
      ...task,
      status: newStatus
    });
  };

  return (
    <div className="bg-white rounded-lg shadow transition-all duration-300 hover:shadow-md overflow-hidden">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  aria-label="Edit task"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{task.description}</p>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                {statusIcons[task.status]}
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              {task.status !== 'done' && (
                <button
                  onClick={() => handleStatusChange(task.status === 'todo' ? 'in progress' : 'done')}
                  className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                >
                  {task.status === 'todo' ? 'Start Task' : 'Mark Complete'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;