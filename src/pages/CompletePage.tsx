import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { QuestCard } from '../components/QuestCard';
import { CheckIcon, ArrowsUpDownIcon } from '../components/Icons';
import type { Quest } from '../types';

type SortOption = 'custom' | 'newest' | 'oldest' | 'most-tasks' | 'fewest-tasks' | 'a-z' | 'z-a';

const SORT_STORAGE_KEY = 'sort_complete';

export const CompletePage: React.FC = () => {
  const { quests } = useQuests();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [sortOption, setSortOption] = React.useState<SortOption>(() => {
    const stored = localStorage.getItem(SORT_STORAGE_KEY);
    return (stored as SortOption) || 'custom';
  });

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    localStorage.setItem(SORT_STORAGE_KEY, option);
    setIsDropdownOpen(false);
  };

  const sortQuests = (questsToSort: Quest[]): Quest[] => {
    const sorted = [...questsToSort];

    switch (sortOption) {
      case 'custom':
        // Pinned first, then by order
        sorted.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.order - a.order;
        });
        break;
      case 'newest':
        // Most recent completedAt first
        sorted.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
        break;
      case 'oldest':
        // Oldest completedAt first
        sorted.sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0));
        break;
      case 'most-tasks':
        // Most tasks first
        sorted.sort((a, b) => b.tasks.length - a.tasks.length);
        break;
      case 'fewest-tasks':
        // Fewest tasks first
        sorted.sort((a, b) => a.tasks.length - b.tasks.length);
        break;
      case 'a-z':
        // Alphabetical by title
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        // Reverse alphabetical by title
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return sorted;
  };

  const completedQuests = sortQuests(quests.filter((q) => q.status === 'complete'));

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto relative">
        {/* Floating Sort Button */}
        <div className="fixed top-20 right-6 z-50">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full shadow-lg flex items-center justify-center transition-all"
          >
            <ArrowsUpDownIcon className="w-6 h-6 text-gray-800" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-xl overflow-hidden">
              <button
                onClick={() => handleSortChange('custom')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'custom' ? 'bg-success text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Custom Order
              </button>
              <button
                onClick={() => handleSortChange('newest')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'newest' ? 'bg-success text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'oldest' ? 'bg-success text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Oldest First
              </button>
              <button
                onClick={() => handleSortChange('most-tasks')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'most-tasks' ? 'bg-success text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Most Tasks
              </button>
              <button
                onClick={() => handleSortChange('fewest-tasks')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'fewest-tasks' ? 'bg-success text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Fewest Tasks
              </button>
              <button
                onClick={() => handleSortChange('a-z')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'a-z' ? 'bg-success text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                A-Z
              </button>
              <button
                onClick={() => handleSortChange('z-a')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'z-a' ? 'bg-success text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Z-A
              </button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <CheckIcon className="w-10 h-10 text-success" />
            Completed Quests
          </h1>
          <p className="text-gray-400 mt-2">
            {completedQuests.length} {completedQuests.length === 1 ? 'quest' : 'quests'} completed
          </p>
        </div>

        {/* Completed Quests Grid */}
        {completedQuests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 text-gray-600">
              <CheckIcon className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No Completed Quests Yet
            </h2>
            <p className="text-gray-500">
              Complete your first quest to see it here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
