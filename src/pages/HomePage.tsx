import React from 'react';
import { Link } from 'react-router-dom';
import { useQuests } from '../contexts/QuestContext';
import { MapIcon, CheckIcon, ClipboardIcon } from '../components/Icons';

export const HomePage: React.FC = () => {
  const { quests } = useQuests();

  const availableQuests = quests.filter((q) => q.status === 'available');
  const trackingQuests = quests.filter((q) => q.status === 'tracking');
  const completedQuests = quests.filter((q) => q.status === 'complete');

  const totalTasks = quests.reduce((sum, q) => sum + q.tasks.length, 0);
  const completedTasks = quests.reduce(
    (sum, q) => sum + q.tasks.filter((t) => t.completed).length,
    0
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Welcome to <span className="text-success">SideQuest</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Turn overwhelming tasks into achievable quests. Break it down, level up, and watch yourself win.
          </p>
          <Link
            to="/available"
            className="inline-block px-12 py-6 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold text-2xl transition-all shadow-2xl"
          >
            Plan Your Quests
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-danger">
              <ClipboardIcon className="w-full h-full" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{availableQuests.length}</div>
            <div className="text-gray-400">Available Quests</div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-warning">
              <MapIcon className="w-full h-full" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{trackingQuests.length}</div>
            <div className="text-gray-400">Tracking Quests</div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-success">
              <CheckIcon className="w-full h-full" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{completedQuests.length}</div>
            <div className="text-gray-400">Completed Quests</div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 text-danger flex-shrink-0 mt-1">
                <ClipboardIcon className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Available Quests</h3>
                <p className="text-gray-400">Plan your quests and add tasks before you start working on them</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 text-warning flex-shrink-0 mt-1">
                <MapIcon className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Track Active Quests</h3>
                <p className="text-gray-400">Start tracking when you're ready and focus on your active quests</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 text-success flex-shrink-0 mt-1">
                <CheckIcon className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Complete & Review</h3>
                <p className="text-gray-400">Mark quests as complete and track your daily task completion stats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        {quests.length === 0 && (
          <div className="mt-12 bg-dark-surface border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Begin?</h3>
            <p className="text-gray-400 mb-6">Plan your first quest to start your journey</p>
            <Link
              to="/available"
              className="inline-block px-10 py-5 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold text-xl transition-all shadow-xl"
            >
              Plan Your First Quest
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
