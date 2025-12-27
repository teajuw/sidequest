import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { QuestCard } from '../components/QuestCard';
import { CheckIcon } from '../components/Icons';

export const CompletePage: React.FC = () => {
  const { quests } = useQuests();

  const completedQuests = quests.filter((q) => q.completed);

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <CheckIcon className="w-10 h-10 text-success" />
            Completed Quests
          </h1>
          <p className="text-gray-400">
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
          <div className="flex flex-wrap gap-6">
            {completedQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
