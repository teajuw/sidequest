import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { QuestCard } from '../components/QuestCard';

export const QuestBoard: React.FC = () => {
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

  const activeQuests = quests.filter((q) => !q.completed);

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Side Quest</h1>
          <p className="text-gray-400">Your epic quest management system</p>
        </div>

        {/* Add Quest Button */}
        <div className="mb-6">
          {isAddingQuest ? (
            <div className="bg-dark-surface border border-dark-border rounded-xl p-5 shadow-lg">
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
                className="w-full bg-dark-bg border border-gray-600 rounded px-4 py-3 text-lg focus:outline-none focus:border-emerald-500 mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddQuest}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
                >
                  Create Quest
                </button>
                <button
                  onClick={() => {
                    setNewQuestTitle('');
                    setIsAddingQuest(false);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingQuest(true)}
              className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-emerald-500 rounded-xl text-gray-400 hover:text-emerald-400 transition-all font-medium text-lg"
            >
              + New Quest
            </button>
          )}
        </div>

        {/* Quest Grid */}
        {activeQuests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No Active Quests
            </h2>
            <p className="text-gray-500">Create your first quest to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
