import { Task } from "../types";
import { createClient } from "@supabase/supabase-js";

const API_URL = "http://localhost:3001/api";
const CACHE_KEY = "taskflow_tasks";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Initialize Supabase client
console.log("Supabase is start");

const supabase = createClient(
  "https://gwouobofezujmzhjsidg.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Error handling helper
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.message || response.statusText || "An unknown error occurred";
    throw new Error(errorMessage);
  }
  return response.json();
};

// Cache management
const getCachedData = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch (error) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const setCachedData = (data: Task[]) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};

// Mock data for development if API is not available
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Finish report",
    description: "Complete Q2 summary",
    status: "todo",
  },
  {
    id: 2,
    title: "Team meeting",
    description: "Discuss project goals sets",
    status: "done",
  },
  {
    id: 3,
    title: "Update website",
    description: "Add new product features",
    status: "in progress",
  },
];

let mockId = 4; // For generating IDs in mock mode

// Check if we're in development mode without the API
const useMockData = import.meta.env.DEV && !import.meta.env.VITE_USE_API;

// Search tasks by similarity
export const searchSimilarTasks = async (query: string): Promise<Task[]> => {
  try {
    const { data: similarTasks, error } = await supabase.rpc('search_similar_tasks', {
      query_text: query,
      similarity_threshold: 0.3,
      max_results: 5
    });

    if (error) throw error;
    return similarTasks;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  // Check cache first
  const cachedTasks = getCachedData();
  if (cachedTasks) {
    return cachedTasks;
  }

  if (useMockData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCachedData(mockTasks);
        resolve([...mockTasks]);
      }, 800);
    });
  }

  try {
    const response = await fetch(`${API_URL}/tasks`);
    console.log("Fetch data: ", response);
    const tasks = await handleResponse(response);
    setCachedData(tasks);
    return tasks;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  if (useMockData) {
    const newTask = { ...task, id: mockId++ };
    mockTasks.push(newTask);
    setCachedData(mockTasks);
    return new Promise((resolve) => setTimeout(() => resolve(newTask), 500));
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const newTask = await handleResponse(response);
    const cachedTasks = getCachedData();
    if (cachedTasks) {
      setCachedData([...cachedTasks, newTask]);
    }
    return newTask;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (task: Task): Promise<Task> => {
  if (useMockData) {
    const index = mockTasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      mockTasks[index] = task;
      setCachedData(mockTasks);
    }
    return new Promise((resolve) => setTimeout(() => resolve(task), 500));
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const updatedTask = await handleResponse(response);
    const cachedTasks = getCachedData();
    if (cachedTasks) {
      setCachedData(
        cachedTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
    }
    return updatedTask;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  if (useMockData) {
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockTasks.splice(index, 1);
      setCachedData(mockTasks);
    }
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return handleResponse(response);
    }

    const cachedTasks = getCachedData();
    if (cachedTasks) {
      setCachedData(cachedTasks.filter((t) => t.id !== id));
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
