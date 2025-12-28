import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { QuestCard } from '../components/QuestCard';
import { ClipboardIcon } from '../components/Icons';

export const AvailablePage: React.FC = () => {
  const { quests, addQuest } = useQuests();
  const [isAddingQuest, setIsAddingQuest] = React.useState(false);
  const [newQuestTitle, setNewQuestTitle] = React.useState('');

  const handleAddQuest = () => {
    if (newQuestTitle.trim()) {
      addQuest(newQuestTitle.trim());
      setNewQuestTitle('');
      setIsAddingQuest(false);
    }
  };

  const availableQuests = quests
    .filter((q) => q.status === 'available')
    .sort((a, b) => {
      // Pinned quests first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then sort by order (descending - higher order numbers first)
      return b.order - a.order;
    });

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
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
