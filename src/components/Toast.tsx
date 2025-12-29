import React, { useEffect } from 'react';
import type { MilestoneNotification } from '../types';
import { StarIcon } from './Icons';
import { playMilestoneSound } from '../utils/sounds';

interface ToastProps {
  notification: MilestoneNotification;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    // Play milestone sound when toast appears
    playMilestoneSound();

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'level-up':
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'quest':
        return 'bg-gradient-to-r from-green-600 to-emerald-600';
      case 'task':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div
        className={`${getBackgroundColor()} text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px] border-2 border-white/20`}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <StarIcon filled className="w-8 h-8 text-yellow-300 animate-pulse" />
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-lg font-bold">{notification.message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
        >
          ×
        </button>
      </div>
    </div>
  );
};
