import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SwordIcon } from './Icons';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-dark-surface border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/home"
            className="flex items-center gap-2 text-2xl font-bold text-white hover:text-success transition-colors"
          >
            <SwordIcon className="w-7 h-7" />
            SideQuest
          </Link>
          <div className="flex gap-2">
            <Link
              to="/available"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/available')
                  ? 'bg-danger text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              Available
            </Link>
            <Link
              to="/tracking"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/tracking')
                  ? 'bg-warning text-black'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              Tracking
            </Link>
            <Link
              to="/complete"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/complete')
                  ? 'bg-success text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              Complete
            </Link>
            <Link
              to="/stats"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/stats')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              Stats
            </Link>
            <Link
              to="/settings"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/settings')
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
