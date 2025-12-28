import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { CalculatorIcon } from '../components/Icons';

export const StatsPage: React.FC = () => {
  const { dailyStats, quests } = useQuests();

  // Get today's date string
  const getTodayString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calculate stats
  const today = getTodayString();
  const todayStats = dailyStats.find(s => s.date === today);
  const tasksToday = todayStats?.tasksCompleted || 0;

  // Best day record
  const bestDay = dailyStats.reduce((max, stat) =>
    stat.tasksCompleted > max ? stat.tasksCompleted : max, 0
  );

  // Calculate streak (consecutive days with at least 1 task)
  const calculateStreak = (): number => {
    if (dailyStats.length === 0) return 0;

    const sortedStats = [...dailyStats].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const todayDate = new Date(today);

    for (let i = 0; i < sortedStats.length; i++) {
      const expectedDate = new Date(todayDate);
      expectedDate.setDate(todayDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (sortedStats[i].date === expectedDateStr && sortedStats[i].tasksCompleted > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  // Average tasks per day
  const totalTasksAllTime = dailyStats.reduce((sum, stat) => sum + stat.tasksCompleted, 0);
  const avgTasksPerDay = dailyStats.length > 0
    ? (totalTasksAllTime / dailyStats.length).toFixed(1)
    : '0.0';

  // Lifetime quest stats
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.status === 'complete').length;
  const trackingQuests = quests.filter(q => q.status === 'tracking').length;
  const availableQuests = quests.filter(q => q.status === 'available').length;

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <CalculatorIcon className="w-10 h-10 text-gray-400" />
            Daily Statistics
          </h1>
          <p className="text-gray-400 mt-2">Track your daily task completion progress</p>
        </div>

        {/* Daily Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Tasks Today */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Tasks Today</div>
            <div className="text-4xl font-bold text-white">{tasksToday}</div>
          </div>

          {/* Best Day Record */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Best Day</div>
            <div className="text-4xl font-bold text-white">{bestDay}</div>
          </div>

          {/* Current Streak */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Current Streak</div>
            <div className="text-4xl font-bold text-white">{currentStreak}</div>
            <div className="text-xs text-gray-500 mt-1">days</div>
          </div>

          {/* Average Per Day */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Avg Per Day</div>
            <div className="text-4xl font-bold text-white">{avgTasksPerDay}</div>
          </div>

          {/* Total All-Time */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
            <div className="text-gray-400 text-sm mb-2">Total All-Time</div>
            <div className="text-4xl font-bold text-white">{totalTasksAllTime}</div>
          </div>
        </div>

        {/* Calendar/History View */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {dailyStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No activity yet. Complete tasks to see your statistics!
              </div>
            ) : (
              [...dailyStats]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((stat) => {
                  const date = new Date(stat.date);
                  const isToday = stat.date === today;
                  const displayDate = isToday
                    ? 'Today'
                    : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                  return (
                    <div
                      key={stat.date}
                      className="border border-dark-border rounded-lg p-4 hover:border-gray-600 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="font-semibold text-white">
                          {displayDate}
                        </div>
                        {isToday && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">{stat.tasksCompleted} tasks</span>
                        <div className="w-32 bg-dark-bg rounded-full h-2">
                          <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${bestDay > 0 ? (stat.tasksCompleted / bestDay) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Lifetime Stats */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Lifetime Quest Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{totalQuests}</div>
              <div className="text-sm text-gray-400">Total Quests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{availableQuests}</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{trackingQuests}</div>
              <div className="text-sm text-gray-400">Tracking</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{completedQuests}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
