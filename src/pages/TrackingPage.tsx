import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { QuestCard } from '../components/QuestCard';
import { MapIcon } from '../components/Icons';

export const TrackingPage: React.FC = () => {
  const { quests } = useQuests();

  const trackingQuests = quests
    .filter((q) => q.status === 'tracking')
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
            <MapIcon className="w-10 h-10 text-warning" />
            Tracking Quests
          </h1>
          <p className="text-gray-400 mt-2">Active quests you're currently working on</p>
        </div>

        {/* Tracking Quests */}
        {trackingQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackingQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 text-gray-600">
              <MapIcon className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No Tracking Quests
            </h2>
            <p className="text-gray-500">Start tracking a quest from the Available tab!</p>
          </div>
        )}
      </div>
    </div>
  );
};
