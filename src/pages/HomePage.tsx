import React from 'react';
import { Link } from 'react-router-dom';
import { useQuests } from '../contexts/QuestContext';
import { MapIcon, CheckIcon, StarIcon } from '../components/Icons';

export const HomePage: React.FC = () => {
  const { quests } = useQuests();

  const activeQuests = quests.filter((q) => !q.completed);
  const completedQuests = quests.filter((q) => q.completed);
  const starredQuests = quests.filter((q) => q.starred && !q.completed);

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
            Welcome to <span className="text-success">Side Quest</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Your epic quest management system. Track tasks, complete quests, level up your productivity.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-success hover:bg-success-hover text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-success/20"
          >
            Start Your Quest
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-success">
              <MapIcon className="w-full h-full" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{activeQuests.length}</div>
            <div className="text-gray-400">Active Quests</div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-warning">
              <StarIcon filled className="w-full h-full" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{starredQuests.length}</div>
            <div className="text-gray-400">Pinned Quests</div>
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
              <div className="w-6 h-6 text-success flex-shrink-0 mt-1">
                <CheckIcon className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Quest & Task Management</h3>
                <p className="text-gray-400">Organize your work into quests with detailed task breakdowns</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 text-warning flex-shrink-0 mt-1">
                <StarIcon filled className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Pin Important Quests</h3>
                <p className="text-gray-400">Keep your top 3 priority quests pinned at the top for quick access</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 text-success flex-shrink-0 mt-1">
                <MapIcon className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Track Progress</h3>
                <p className="text-gray-400">Visual progress bars and completion statistics for all your quests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        {activeQuests.length === 0 && (
          <div className="mt-12 bg-dark-surface border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Begin?</h3>
            <p className="text-gray-400 mb-6">Create your first quest to start your journey</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-success hover:bg-success-hover text-white rounded-lg font-medium transition-all"
            >
              Create Your First Quest
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
