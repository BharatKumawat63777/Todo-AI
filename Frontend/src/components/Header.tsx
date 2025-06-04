import React from 'react';
import { CheckSquare } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckSquare className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-gray-600 hover:text-blue-500 transition-colors">
                Dashboard
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;