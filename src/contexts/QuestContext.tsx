import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import type { Quest, QuestLine, Task, QuestContextType, DailyStats, UserProgress, MilestoneNotification } from '../types';
import { playStartTrackingSound, playCompleteQuestSound, playCompleteTaskSound } from '../utils/sounds';
import { getGistConfig, syncToGist } from '../utils/gistSync';
import { SEED_QUESTS, SEED_QUEST_LINES, SEED_DAILY_STATS, SEED_USER_PROGRESS } from '../data/seedData';

const QuestContext = createContext<QuestContextType | undefined>(undefined);

const STORAGE_KEY = 'sidequest_data';

interface StorageData {
  quests: Quest[];
  questLines: QuestLine[];
  dailyStats: DailyStats[];
  userProgress?: UserProgress;
}

// Helper to get today's date in YYYY-MM-DD format
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Calculate XP required for a specific level
const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  if (level === 2) return 50;
  if (level === 3) return 75;
  if (level === 4) return 100;
  if (level === 5) return 150;

  let totalXP = 50 + 75 + 100 + 150; // XP for levels 2-5

  if (level <= 10) {
    // Levels 6-10: +50 XP per level
    for (let i = 6; i <= level; i++) {
      totalXP += 50;
    }
  } else if (level <= 20) {
    // First get XP for levels 6-10
    totalXP += 50 * 5; // 5 levels at +50 each
    // Then levels 11-20: +75 XP per level
    for (let i = 11; i <= level; i++) {
      totalXP += 75;
    }
  } else if (level <= 50) {
    // Get XP for levels 6-10 and 11-20
    totalXP += 50 * 5; // Levels 6-10
    totalXP += 75 * 10; // Levels 11-20
    // Then levels 21-50: +100 XP per level
    for (let i = 21; i <= level; i++) {
      totalXP += 100;
    }
  } else {
    // Get XP for levels 6-50
    totalXP += 50 * 5; // Levels 6-10
    totalXP += 75 * 10; // Levels 11-20
    totalXP += 100 * 30; // Levels 21-50
    // Then levels 51+: +150 XP per level
    for (let i = 51; i <= level; i++) {
      totalXP += 150;
    }
  }

  return totalXP;
};

// Calculate level from total XP
const getLevelFromXP = (xp: number): number => {
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
};

// Calculate current streak from daily stats
const getCurrentStreak = (dailyStats: DailyStats[]): number => {
  if (dailyStats.length === 0) return 0;

  const sortedStats = [...dailyStats].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let currentDate = new Date();

  for (const stat of sortedStats) {
    const statDate = new Date(stat.date);
    const daysDiff = Math.floor((currentDate.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === streak && stat.tasksCompleted > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Calculate streak multiplier
const getStreakMultiplier = (streak: number): number => {
  if (streak >= 15) return 2.5;
  if (streak >= 10) return 2.0;
  if (streak >= 5) return 1.5;
  return 1.0;
};

// Calculate daily quest bonus
const getDailyQuestBonus = (questsCompletedToday: number): number => {
  if (questsCompletedToday >= 4) return 25;
  if (questsCompletedToday === 3) return 10;
  if (questsCompletedToday === 2) return 5;
  return 0;
};

const DEFAULT_USER_PROGRESS: UserProgress = {
  level: 1,
  currentXP: 0,
  totalQuestsCompleted: 0,
  totalTasksCompleted: 0,
  dailyQuestsCompleted: 0,
  lastMilestones: {
    questMilestone: 0,
    taskMilestone: 0,
  },
};

export const QuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questLines, setQuestLines] = useState<QuestLine[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS);
  const [milestoneNotification, setMilestoneNotification] = useState<MilestoneNotification | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('Loading data from localStorage...');
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('Stored data:', stored);
    if (stored) {
      try {
        const data: StorageData = JSON.parse(stored);
        console.log('Parsed data:', data);
        // Migrate old data if needed
        const migratedQuests = (data.quests || []).map((quest, index) => ({
          ...quest,
          status: quest.status || (quest.completed ? 'complete' : 'available') as 'available' | 'tracking' | 'complete',
          order: quest.order ?? index,
          pinned: quest.pinned ?? false,
          lastModified: quest.lastModified ?? quest.createdAt ?? Date.now(),
          tasks: quest.tasks.map((task, taskIndex) => {
            const { starred, ...taskWithoutStarred } = task as Task & { starred?: boolean };
            return {
              ...taskWithoutStarred,
              order: task.order ?? taskIndex
            };
          })
        }));
        console.log('Migrated quests:', migratedQuests);
        setQuests(migratedQuests);
        setQuestLines(data.questLines || []);
        setDailyStats(data.dailyStats || []);
        setUserProgress(data.userProgress || DEFAULT_USER_PROGRESS);
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    } else {
      // No stored data - use seed data for first-time visitors
      console.log('No stored data found, loading seed data');
      setQuests(SEED_QUESTS);
      setQuestLines(SEED_QUEST_LINES);
      setDailyStats(SEED_DAILY_STATS);
      setUserProgress(SEED_USER_PROGRESS);
    }
  }, []);

  // Save data to localStorage whenever it changes
  // Skip the first render to avoid overwriting on initial load
  const isInitialMount = React.useRef(true);
  const gistSyncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const data: StorageData = { quests, questLines, dailyStats, userProgress };
    console.log('Saving to localStorage:', data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Saved successfully');
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    // Debounced sync to Gist (3 seconds after last change)
    if (gistSyncTimeout.current) {
      clearTimeout(gistSyncTimeout.current);
    }

    const config = getGistConfig();
    if (config) {
      gistSyncTimeout.current = setTimeout(async () => {
        console.log('Auto-syncing to Gist...');
        const result = await syncToGist(data);
        if (result.error) {
          console.error('Gist sync failed:', result.error);
        } else {
          console.log('Gist sync successful');
        }
      }, 3000);
    }
  }, [quests, questLines, dailyStats, userProgress]);

  // Reset daily quest counter at midnight
  useEffect(() => {
    const checkDailyReset = () => {
      const today = getTodayString();
      if (userProgress.lastQuestCompletionDate && userProgress.lastQuestCompletionDate !== today) {
        setUserProgress((prev) => ({
          ...prev,
          dailyQuestsCompleted: 0,
          lastQuestCompletionDate: undefined,
        }));
      }
    };

    // Check on mount
    checkDailyReset();

    // Check every minute
    const interval = setInterval(checkDailyReset, 60000);

    return () => clearInterval(interval);
  }, [userProgress.lastQuestCompletionDate]);

  const addQuest = (title: string, questLine?: string) => {
    const now = Date.now();
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title,
      tasks: [],
      status: 'available',
      questLine,
      createdAt: now,
      lastModified: now,
      order: now,
      pinned: false,
    };
    setQuests((prev) => [...prev, newQuest]);
  };

  const deleteQuest = (questId: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, ...updates } : q))
    );
  };

  const addTask = (questId: string, description: string) => {
    const now = Date.now();
    const newTask: Task = {
      id: crypto.randomUUID(),
      description,
      completed: false,
      order: now,
    };
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, tasks: [...q.tasks, newTask], lastModified: now } : q
      )
    );
  };

  const updateTask = (questId: string, taskId: string, updates: Partial<Task>) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              tasks: q.tasks.map((t) =>
                t.id === taskId ? { ...t, ...updates } : t
              ),
              lastModified: Date.now()
            }
          : q
      )
    );
  };

  const deleteTask = (questId: string, taskId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const updatedTasks = q.tasks.filter((t) => t.id !== taskId);

          // If all tasks are deleted from a tracking quest, send it back to available
          if (updatedTasks.length === 0 && q.status === 'tracking') {
            return { ...q, tasks: updatedTasks, status: 'available' as const, lastModified: Date.now() };
          }

          return { ...q, tasks: updatedTasks, lastModified: Date.now() };
        }
        return q;
      })
    );
  };

  const toggleTaskComplete = (questId: string, taskId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const task = q.tasks.find(t => t.id === taskId);
          const wasCompleted = task?.completed || false;

          const updatedTasks = q.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );

          // Update daily stats and play sound when task is completed (not uncompleted)
          if (!wasCompleted) {
            playCompleteTaskSound();
            const today = getTodayString();
            setDailyStats((prevStats) => {
              const todayStats = prevStats.find(s => s.date === today);
              if (todayStats) {
                return prevStats.map(s =>
                  s.date === today
                    ? { ...s, tasksCompleted: s.tasksCompleted + 1 }
                    : s
                );
              } else {
                return [...prevStats, { date: today, tasksCompleted: 1 }];
              }
            });
          }

          // If unchecking a task on a complete quest, move it back to tracking
          if (wasCompleted && q.status === 'complete') {
            return { ...q, tasks: updatedTasks, status: 'tracking' as const, completedAt: undefined, lastModified: Date.now() };
          }

          return { ...q, tasks: updatedTasks, lastModified: Date.now() };
        }
        return q;
      })
    );
  };

  const addQuestLine = (name: string, color: string) => {
    const newQuestLine: QuestLine = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setQuestLines((prev) => [...prev, newQuestLine]);
  };

  const startTracking = (questId: string) => {
    playStartTrackingSound();
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: 'tracking' } : q
      )
    );
  };

  const completeQuest = (questId: string) => {
    playCompleteQuestSound();

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const today = getTodayString();
    const taskCount = quest.tasks.length;

    // Update quest status
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: 'complete', completedAt: Date.now() }
          : q
      )
    );

    // Calculate XP gain
    const streak = getCurrentStreak(dailyStats);
    const streakMultiplier = getStreakMultiplier(streak);
    const baseXP = taskCount + 5; // 1 XP per task + 5 for quest
    const xpFromQuest = Math.floor(baseXP * streakMultiplier);

    // Update user progress
    setUserProgress((prev) => {
      const newDailyQuestsCompleted = prev.lastQuestCompletionDate === today
        ? prev.dailyQuestsCompleted + 1
        : 1;

      const dailyBonus = getDailyQuestBonus(newDailyQuestsCompleted);
      const totalXPGained = xpFromQuest + dailyBonus;

      const newTotalXP = prev.currentXP + totalXPGained;
      const newLevel = getLevelFromXP(newTotalXP);
      const oldLevel = prev.level;

      const newTotalQuests = prev.totalQuestsCompleted + 1;
      const newTotalTasks = prev.totalTasksCompleted + taskCount;

      // Check for milestones
      const questMilestone = Math.floor(newTotalQuests / 5) * 5;
      const taskMilestone = Math.floor(newTotalTasks / 25) * 25;

      // Determine which notification to show (priority: level-up > quest milestone > task milestone > xp gain)
      if (newLevel > oldLevel) {
        setMilestoneNotification({
          type: 'level-up',
          message: `Level Up! You reached Level ${newLevel}!`,
          value: newLevel,
        });
      } else if (questMilestone > prev.lastMilestones.questMilestone && questMilestone === newTotalQuests) {
        setMilestoneNotification({
          type: 'quest',
          message: `Milestone! ${newTotalQuests} Quests Completed!`,
          value: newTotalQuests,
        });
      } else if (taskMilestone > prev.lastMilestones.taskMilestone && taskMilestone <= newTotalTasks) {
        setMilestoneNotification({
          type: 'task',
          message: `Milestone! ${taskMilestone} Tasks Completed!`,
          value: taskMilestone,
        });
      } else {
        // Show XP gain notification
        setMilestoneNotification({
          type: 'xp-gain',
          message: `+${totalXPGained} XP!`,
          value: totalXPGained,
        });
      }

      return {
        ...prev,
        level: newLevel,
        currentXP: newTotalXP,
        totalQuestsCompleted: newTotalQuests,
        totalTasksCompleted: newTotalTasks,
        dailyQuestsCompleted: newDailyQuestsCompleted,
        lastQuestCompletionDate: today,
        lastMilestones: {
          questMilestone: Math.max(questMilestone, prev.lastMilestones.questMilestone),
          taskMilestone: Math.max(taskMilestone, prev.lastMilestones.taskMilestone),
        },
      };
    });
  };

  const resumeTracking = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status !== 'complete') return;

    // Revert XP gain from this quest
    const taskCount = quest.tasks.length;
    const today = getTodayString();
    const completionDate = quest.completedAt ? new Date(quest.completedAt).toISOString().split('T')[0] : null;

    // Calculate how much XP was gained when completing this quest
    const streak = getCurrentStreak(dailyStats);
    const streakMultiplier = getStreakMultiplier(streak);
    const baseXP = taskCount + 5;
    const xpFromQuest = Math.floor(baseXP * streakMultiplier);

    // Determine if this was part of daily bonus
    // Note: We can't perfectly reverse daily bonus logic, so we'll approximate
    // by checking if completion was today and adjusting dailyQuestsCompleted
    const wasCompletedToday = completionDate === today;

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: 'tracking', completedAt: undefined }
          : q
      )
    );

    // Revert user progress
    setUserProgress((prev) => {
      if (!wasCompletedToday) {
        // Quest was not completed today, so no daily bonus to worry about
        // Just revert the base XP
        const totalXPLost = xpFromQuest;
        const newTotalXP = Math.max(0, prev.currentXP - totalXPLost);
        const newLevel = getLevelFromXP(newTotalXP);
        const newTotalQuests = Math.max(0, prev.totalQuestsCompleted - 1);
        const newTotalTasks = Math.max(0, prev.totalTasksCompleted - taskCount);

        const questMilestone = Math.floor(newTotalQuests / 5) * 5;
        const taskMilestone = Math.floor(newTotalTasks / 25) * 25;

        return {
          ...prev,
          level: newLevel,
          currentXP: newTotalXP,
          totalQuestsCompleted: newTotalQuests,
          totalTasksCompleted: newTotalTasks,
          lastMilestones: {
            questMilestone: Math.min(questMilestone, prev.lastMilestones.questMilestone),
            taskMilestone: Math.min(taskMilestone, prev.lastMilestones.taskMilestone),
          },
        };
      }

      // Quest was completed today - need to handle daily bonus properly
      const oldDailyCount = prev.dailyQuestsCompleted;
      const newDailyCount = Math.max(0, oldDailyCount - 1);

      // Calculate bonus XP before and after to determine difference
      const oldBonus = getDailyQuestBonus(oldDailyCount);
      const newBonus = getDailyQuestBonus(newDailyCount);
      const bonusXPLost = oldBonus - newBonus;

      const totalXPLost = xpFromQuest + bonusXPLost;
      const newTotalXP = Math.max(0, prev.currentXP - totalXPLost);
      const newLevel = getLevelFromXP(newTotalXP);

      const newTotalQuests = Math.max(0, prev.totalQuestsCompleted - 1);
      const newTotalTasks = Math.max(0, prev.totalTasksCompleted - taskCount);

      const questMilestone = Math.floor(newTotalQuests / 5) * 5;
      const taskMilestone = Math.floor(newTotalTasks / 25) * 25;

      return {
        ...prev,
        level: newLevel,
        currentXP: newTotalXP,
        totalQuestsCompleted: newTotalQuests,
        totalTasksCompleted: newTotalTasks,
        dailyQuestsCompleted: newDailyCount,
        lastMilestones: {
          questMilestone: Math.min(questMilestone, prev.lastMilestones.questMilestone),
          taskMilestone: Math.min(taskMilestone, prev.lastMilestones.taskMilestone),
        },
      };
    });
  };

  const togglePinQuest = (questId: string) => {
    setQuests((prev) => {
      const quest = prev.find(q => q.id === questId);
      if (!quest) return prev;

      return prev.map((q) => {
        if (q.id === questId) {
          // If pinning, set order to current timestamp to put it at top
          // If unpinning, keep current order
          return {
            ...q,
            pinned: !q.pinned,
            order: !q.pinned ? Date.now() : q.order
          };
        }
        return q;
      });
    });
  };

  const reorderQuest = (draggedQuestId: string, targetQuestId: string) => {
    setQuests((prev) => {
      const draggedQuest = prev.find(q => q.id === draggedQuestId);
      const targetQuest = prev.find(q => q.id === targetQuestId);

      if (!draggedQuest || !targetQuest || draggedQuest.status !== targetQuest.status) {
        return prev;
      }

      // Get all quests with the same status, sorted by current order
      const sameStatusQuests = prev
        .filter(q => q.status === draggedQuest.status)
        .sort((a, b) => {
          // Pinned first
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.order - a.order;
        });

      // Remove dragged quest from array
      const withoutDragged = sameStatusQuests.filter(q => q.id !== draggedQuestId);

      // Find index of target quest in the filtered array
      const targetIndex = withoutDragged.findIndex(q => q.id === targetQuestId);

      // Insert dragged quest before target
      withoutDragged.splice(targetIndex, 0, draggedQuest);

      // Reassign order values based on new positions
      const now = Date.now();
      const reordered = withoutDragged.map((q, index) => ({
        ...q,
        order: now - (index * 1000) // Higher order = first in list, with large gaps
      }));

      // Merge back with quests of other statuses - create completely new array
      const newQuests = prev.map(q => {
        const reorderedQuest = reordered.find(rq => rq.id === q.id);
        return reorderedQuest ? { ...reorderedQuest } : q;
      });

      return newQuests;
    });
  };

  const reorderTask = (questId: string, draggedTaskId: string, targetTaskId: string) => {
    setQuests((prev) => {
      return prev.map((quest) => {
        if (quest.id !== questId) return quest;

        const draggedTask = quest.tasks.find(t => t.id === draggedTaskId);
        const targetTask = quest.tasks.find(t => t.id === targetTaskId);

        if (!draggedTask || !targetTask) return quest;

        // Sort tasks by current order
        const sortedTasks = [...quest.tasks].sort((a, b) => b.order - a.order);

        // Remove dragged task from array
        const withoutDragged = sortedTasks.filter(t => t.id !== draggedTaskId);

        // Find index of target task in the filtered array
        const targetIndex = withoutDragged.findIndex(t => t.id === targetTaskId);

        // Insert dragged task before target
        withoutDragged.splice(targetIndex, 0, draggedTask);

        // Reassign order values based on new positions
        const now = Date.now();
        const reorderedTasks = withoutDragged.map((t, index) => ({
          ...t,
          order: now - (index * 1000) // Higher order = first in list, with large gaps
        }));

        return {
          ...quest,
          tasks: reorderedTasks,
          lastModified: now
        };
      });
    });
  };

  const dismissMilestoneNotification = () => {
    setMilestoneNotification(null);
  };

  // Import data from external source (Gist or file)
  const importData = (data: object) => {
    const importedData = data as StorageData;
    if (importedData.quests) {
      // Migrate imported quests just like on initial load
      const migratedQuests = importedData.quests.map((quest, index) => ({
        ...quest,
        status: quest.status || 'available' as const,
        order: quest.order ?? index,
        pinned: quest.pinned ?? false,
        lastModified: quest.lastModified ?? quest.createdAt ?? Date.now(),
        tasks: quest.tasks.map((task, taskIndex) => ({
          ...task,
          order: task.order ?? taskIndex
        }))
      }));
      setQuests(migratedQuests);
    }
    if (importedData.questLines) {
      setQuestLines(importedData.questLines);
    }
    if (importedData.dailyStats) {
      setDailyStats(importedData.dailyStats);
    }
    if (importedData.userProgress) {
      setUserProgress(importedData.userProgress);
    }
  };

  return (
    <QuestContext.Provider
      value={{
        quests,
        questLines,
        dailyStats,
        userProgress,
        milestoneNotification,
        addQuest,
        deleteQuest,
        updateQuest,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addQuestLine,
        startTracking,
        completeQuest,
        resumeTracking,
        togglePinQuest,
        reorderQuest,
        reorderTask,
        dismissMilestoneNotification,
        importData,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};
