import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { QuestCard } from '../components/QuestCard';
import { MapIcon } from '../components/Icons';

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
  const pinnedQuests = activeQuests.filter((q) => q.starred).slice(0, 3);
  const otherQuests = activeQuests.filter((q) => !q.starred);

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Pinned Quests Section - Always Visible */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <span className="text-warning">📌</span>
            Pinned Quests
            <span className="text-sm text-gray-500 font-normal">
              ({pinnedQuests.length}/3)
            </span>
          </h2>
          {pinnedQuests.length > 0 ? (
            <div className="flex flex-wrap gap-6">
              {pinnedQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          ) : (
            <div className="bg-dark-surface border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
              <p className="text-gray-500">
                Pin your top 3 priority quests to keep them at the top
              </p>
            </div>
          )}
        </div>

        {/* Add Quest Button */}
        <div className="mb-6 flex justify-center">
          {isAddingQuest ? (
            <div className="bg-dark-surface border border-dark-border rounded-xl p-5 shadow-lg max-w-2xl w-full">
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
                className="w-full bg-dark-bg border border-gray-600 rounded px-4 py-3 text-lg focus:outline-none focus:border-success mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddQuest}
                  className="px-6 py-2 bg-success hover:bg-success-hover rounded-lg font-medium transition-colors"
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
              className="w-full max-w-2xl py-4 border-2 border-dashed border-gray-700 hover:border-success rounded-xl text-gray-400 hover:text-success transition-all font-medium text-lg"
            >
              + New Quest
            </button>
          )}
        </div>

        {/* All Quests Section */}
        {otherQuests.length > 0 && (
          <div>
            {pinnedQuests.length > 0 && (
              <h2 className="text-xl font-semibold text-gray-300 mb-4">All Quests</h2>
            )}
            <div className="flex flex-wrap gap-6">
              {otherQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeQuests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 text-gray-600">
              <MapIcon className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No Active Quests
            </h2>
            <p className="text-gray-500">Create your first quest to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
