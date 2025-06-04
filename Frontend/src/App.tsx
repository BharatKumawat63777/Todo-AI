import React from 'react';
import { Toaster } from 'react-hot-toast';
import TaskBoard from './components/TaskBoard';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TaskBoard />
      </main>
    </div>
  );
}

export default App;