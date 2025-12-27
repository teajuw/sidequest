import React from 'react';
import { useQuests } from '../contexts/QuestContext';

export const StatsPage: React.FC = () => {
  const { quests } = useQuests();

  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.completed).length;
  const activeQuests = totalQuests - completedQuests;

  const totalTasks = quests.reduce((sum, q) => sum + q.tasks.length, 0);
  const completedTasks = quests.reduce(
    (sum, q) => sum + q.tasks.filter((t) => t.completed).length,
    0
  );

  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quest Statistics</h1>
          <p className="text-gray-400">Track your progress and achievements</p>
        </div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Quests */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Total Quests</div>
            <div className="text-4xl font-bold text-white">{totalQuests}</div>
          </div>

          {/* Active Quests */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Active Quests</div>
            <div className="text-4xl font-bold text-blue-400">{activeQuests}</div>
          </div>

          {/* Completed Quests */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Completed Quests</div>
            <div className="text-4xl font-bold text-emerald-400">
              {completedQuests}
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Overall Progress</div>
            <div className="text-4xl font-bold text-purple-400">
              {overallProgress}%
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Overall Task Progress</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">
              {completedTasks} of {totalTasks} tasks completed
            </span>
            <span className="text-emerald-400 font-semibold text-lg">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-4">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Quest Breakdown */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Quest Breakdown</h2>
          <div className="space-y-4">
            {quests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No quests yet. Start creating quests to see statistics!
              </div>
            ) : (
              quests.map((quest) => {
                const questCompletedTasks = quest.tasks.filter(
                  (t) => t.completed
                ).length;
                const questTotalTasks = quest.tasks.length;
                const questProgress =
                  questTotalTasks > 0
                    ? Math.round((questCompletedTasks / questTotalTasks) * 100)
                    : 0;

                return (
                  <div
                    key={quest.id}
                    className="border border-dark-border rounded-lg p-4 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {quest.title}
                        </h3>
                        {quest.starred && <span>⭐</span>}
                        {quest.completed && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-900/30 text-emerald-300 border border-emerald-700/50">
                            Completed
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">
                        {questCompletedTasks}/{questTotalTasks} tasks
                      </span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${questProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
