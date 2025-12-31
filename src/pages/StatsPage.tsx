import React from 'react';
import { useQuests } from '../contexts/QuestContext';
import { CalculatorIcon, CheckIcon, StarIcon } from '../components/Icons';

// Helper to get XP required for next level
const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  if (level === 2) return 50;
  if (level === 3) return 75;
  if (level === 4) return 100;
  if (level === 5) return 150;

  let totalXP = 50 + 75 + 100 + 150;

  if (level <= 10) {
    totalXP += 50 * (level - 5);
  } else if (level <= 20) {
    totalXP += 50 * 5;
    totalXP += 75 * (level - 10);
  } else if (level <= 50) {
    totalXP += 50 * 5;
    totalXP += 75 * 10;
    totalXP += 100 * (level - 20);
  } else {
    totalXP += 50 * 5;
    totalXP += 75 * 10;
    totalXP += 100 * 30;
    totalXP += 150 * (level - 50);
  }

  return totalXP;
};

export const StatsPage: React.FC = () => {
  const { dailyStats, quests, userProgress } = useQuests();

  // Get today's date string
  const getTodayString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calculate streak (consecutive days with at least 1 task)
  const calculateStreak = (): number => {
    if (dailyStats.length === 0) return 0;

    const sortedStats = [...dailyStats].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = getTodayString();
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

  // Calculate total tasks completed
  const totalTasksCompleted = dailyStats.reduce((sum, stat) => sum + stat.tasksCompleted, 0);

  // Calculate total quests completed
  const completedQuests = quests.filter(q => q.status === 'complete').length;

  // Calculate next milestone for quests
  const questMilestones = [10, 25, 50, 100, 250, 500, 1000];
  const nextQuestMilestone = questMilestones.find(m => m > completedQuests) || completedQuests;
  const questProgressPercent = (completedQuests / nextQuestMilestone) * 100;

  // Calculate next milestone for tasks
  const taskMilestones = [50, 100, 250, 500, 1000, 2500, 5000];
  const nextTaskMilestone = taskMilestones.find(m => m > totalTasksCompleted) || totalTasksCompleted;
  const taskProgressPercent = (totalTasksCompleted / nextTaskMilestone) * 100;

  // Calculate XP progress to next level
  const currentLevel = userProgress.level;
  const currentXP = userProgress.currentXP;
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForLevel(currentLevel + 1);
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const xpProgressInCurrentLevel = currentXP - xpForCurrentLevel;
  const levelProgressPercent = (xpProgressInCurrentLevel / xpNeededForNextLevel) * 100;

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <CalculatorIcon className="w-10 h-10 text-gray-400" />
            Statistics
          </h1>
          <p className="text-gray-400 mt-2">Track your progress and achievements</p>
        </div>

        {/* Level Card - Dark Theme */}
        <div className="mb-6 bg-dark-surface border-2 border-purple-500/30 rounded-xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/10 rounded-full p-4 border-2 border-purple-500/30">
                <StarIcon filled className="w-12 h-12 text-purple-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Level {currentLevel}</h2>
                <p className="text-gray-400 text-sm">
                  {xpProgressInCurrentLevel} / {xpNeededForNextLevel} XP to Level {currentLevel + 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-purple-400">{currentXP}</div>
              <div className="text-gray-400 text-sm">Total XP</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-dark-bg rounded-full h-4 border border-dark-border">
              <div
                className="bg-purple-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.min(levelProgressPercent, 100)}%` }}
              >
                {levelProgressPercent > 10 && (
                  <span className="text-xs font-bold text-white">
                    {Math.floor(levelProgressPercent)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Daily Quest Progress */}
          {userProgress.lastQuestCompletionDate === getTodayString() && userProgress.dailyQuestsCompleted > 0 && (
            <div className="mt-4 p-3 bg-dark-bg rounded-lg border border-dark-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">Daily Quests</span>
                <span className="text-purple-400 font-bold">{userProgress.dailyQuestsCompleted}/4</span>
              </div>
              <div className="w-full bg-dark-surface rounded-full h-2 border border-dark-border">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(userProgress.dailyQuestsCompleted / 4) * 100}%` }}
                />
              </div>
              {userProgress.dailyQuestsCompleted >= 4 ? (
                <p className="text-xs text-purple-400 mt-2">Daily bonus unlocked! +25 XP per quest!</p>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  Complete {4 - userProgress.dailyQuestsCompleted} more {4 - userProgress.dailyQuestsCompleted === 1 ? 'quest' : 'quests'} today for +25 XP bonus!
                </p>
              )}
            </div>
          )}
        </div>

        {/* 3-Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Streak */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-white">Current Streak</h3>
                <p className="text-gray-400 text-xs">Days active</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-danger">{currentStreak}</div>
                <div className="text-gray-400 text-xs">
                  {currentStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
            {currentStreak > 0 && (
              <div className="mt-3 p-2 bg-dark-bg rounded-lg border border-dark-border">
                <p className="text-xs text-gray-300">
                  {currentStreak === 1
                    ? "Great start! Keep it going tomorrow to build your streak! 🔥"
                    : currentStreak < 7
                      ? `Nice work! ${7 - currentStreak} more ${7 - currentStreak === 1 ? 'day' : 'days'} to a week streak! 🔥`
                      : currentStreak < 30
                        ? `You're on fire! ${30 - currentStreak} more ${30 - currentStreak === 1 ? 'day' : 'days'} to a month! 🔥🔥`
                        : "Incredible streak! You're a productivity machine! 🔥🔥🔥"
                  }
                </p>
              </div>
            )}
          </div>

          {/* TODO: Re-enable heat map later */}
          {/* <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Activity</h2>
            <HeatMap dailyStats={dailyStats} />
          </div> */}

          {/* Card 2: Tasks Completed */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Tasks Completed</h3>
                <p className="text-gray-400 text-sm">All-time task completions</p>
              </div>
              <CheckIcon className="w-10 h-10 text-warning" />
            </div>
            <div className="text-4xl font-bold text-white mb-3">{totalTasksCompleted}</div>

            {/* Progress to next milestone */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Next milestone: {nextTaskMilestone}</span>
                <span className="text-gray-400">{nextTaskMilestone - totalTasksCompleted} to go</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full transition-all duration-500"
                  style={{ width: `${taskProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Quests Completed */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Quests Completed</h3>
                <p className="text-gray-400 text-sm">All-time quest completions</p>
              </div>
              <CheckIcon className="w-10 h-10 text-success" />
            </div>
            <div className="text-4xl font-bold text-white mb-3">{completedQuests}</div>

            {/* Progress to next milestone */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Next milestone: {nextQuestMilestone}</span>
                <span className="text-gray-400">{nextQuestMilestone - completedQuests} to go</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-500"
                  style={{ width: `${questProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
