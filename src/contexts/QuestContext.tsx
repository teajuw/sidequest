import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Quest, QuestLine, Task, QuestContextType, DailyStats } from '../types';
import { playStartTrackingSound, playCompleteQuestSound, playCompleteTaskSound } from '../utils/sounds';

const QuestContext = createContext<QuestContextType | undefined>(undefined);

const STORAGE_KEY = 'sidequest_data';

interface StorageData {
  quests: Quest[];
  questLines: QuestLine[];
  dailyStats: DailyStats[];
}

// Helper to get today's date in YYYY-MM-DD format
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const QuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questLines, setQuestLines] = useState<QuestLine[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

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
          tasks: quest.tasks.map(task => {
            const { starred, ...taskWithoutStarred } = task as Task & { starred?: boolean };
            return taskWithoutStarred;
          })
        }));
        console.log('Migrated quests:', migratedQuests);
        setQuests(migratedQuests);
        setQuestLines(data.questLines || []);
        setDailyStats(data.dailyStats || []);
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    } else {
      console.log('No stored data found');
    }
  }, []);

  // Save data to localStorage whenever it changes
  // Skip the first render to avoid overwriting on initial load
  const isInitialMount = React.useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const data: StorageData = { quests, questLines, dailyStats };
    console.log('Saving to localStorage:', data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Saved successfully');
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [quests, questLines, dailyStats]);

  const addQuest = (title: string, questLine?: string) => {
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title,
      tasks: [],
      status: 'available',
      questLine,
      createdAt: Date.now(),
      order: Date.now(),
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
    const newTask: Task = {
      id: crypto.randomUUID(),
      description,
      completed: false,
    };
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, tasks: [...q.tasks, newTask] } : q
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
            return { ...q, tasks: updatedTasks, status: 'available' as const };
          }

          return { ...q, tasks: updatedTasks };
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
            return { ...q, tasks: updatedTasks, status: 'tracking' as const, completedAt: undefined };
          }

          return { ...q, tasks: updatedTasks };
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
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: 'complete', completedAt: Date.now() }
          : q
      )
    );
  };

  const resumeTracking = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: 'tracking', completedAt: undefined }
          : q
      )
    );
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

  return (
    <QuestContext.Provider
      value={{
        quests,
        questLines,
        dailyStats,
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
