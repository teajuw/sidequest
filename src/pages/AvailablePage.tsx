import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { QuestCard } from '../components/QuestCard';
import { ClipboardIcon, ArrowsUpDownIcon } from '../components/Icons';
import type { Quest } from '../types';

type SortOption = 'custom' | 'newest' | 'oldest' | 'most-tasks' | 'fewest-tasks' | 'a-z' | 'z-a';

const SORT_STORAGE_KEY = 'sort_available';

export const AvailablePage: React.FC = () => {
  const { quests, addQuest } = useQuests();
  const [isAddingQuest, setIsAddingQuest] = React.useState(false);
  const [newQuestTitle, setNewQuestTitle] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [sortOption, setSortOption] = React.useState<SortOption>(() => {
    const stored = localStorage.getItem(SORT_STORAGE_KEY);
    return (stored as SortOption) || 'custom';
  });

  const handleAddQuest = () => {
    if (newQuestTitle.trim()) {
      addQuest(newQuestTitle.trim());
      setNewQuestTitle('');
      setIsAddingQuest(false);
    }
  };

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
        // Most recent createdAt first
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        // Oldest createdAt first
        sorted.sort((a, b) => a.createdAt - b.createdAt);
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

  const availableQuests = sortQuests(quests.filter((q) => q.status === 'available'));

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
                  sortOption === 'custom' ? 'bg-danger text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Custom Order
              </button>
              <button
                onClick={() => handleSortChange('newest')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'newest' ? 'bg-danger text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'oldest' ? 'bg-danger text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Oldest First
              </button>
              <button
                onClick={() => handleSortChange('most-tasks')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'most-tasks' ? 'bg-danger text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Most Tasks
              </button>
              <button
                onClick={() => handleSortChange('fewest-tasks')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'fewest-tasks' ? 'bg-danger text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Fewest Tasks
              </button>
              <button
                onClick={() => handleSortChange('a-z')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'a-z' ? 'bg-danger text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                A-Z
              </button>
              <button
                onClick={() => handleSortChange('z-a')}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === 'z-a' ? 'bg-danger text-white' : 'text-gray-300 hover:bg-gray-700'
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
            <ClipboardIcon className="w-10 h-10 text-danger" />
            Available Quests
          </h1>
          <p className="text-gray-400 mt-2">Plan your next quest and start tracking when you're ready</p>
        </div>

        {/* Quest Grid with Add Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}

          {/* Add Quest Card */}
          {isAddingQuest ? (
            <div className="bg-dark-surface border border-dark-border rounded-xl p-5 shadow-lg hover:border-gray-600 transition-all w-full">
              <input
                type="text"
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddQuest();
                  if (e.key === 'Escape') {
                    setNewQuestTitle('');
                    setIsAddingQuest(false);
                  }
                }}
                placeholder="Enter quest title..."
                autoFocus
                className="w-full bg-dark-bg border border-gray-600 rounded px-4 py-3 text-lg focus:outline-none focus:border-danger mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewQuestTitle('');
                    setIsAddingQuest(false);
                  }}
                  className="flex-1 px-4 py-2 bg-danger hover:bg-danger-hover rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuest}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingQuest(true)}
              className="bg-dark-surface border-2 border-dashed border-gray-600 hover:border-danger rounded-xl p-5 transition-all w-full min-h-[200px] flex flex-col items-center justify-center gap-3 group"
            >
              <div className="text-6xl text-gray-600 group-hover:text-danger transition-colors">+</div>
              <div className="text-lg font-medium text-gray-400 group-hover:text-danger transition-colors">Plan New Quest</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
