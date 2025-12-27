import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Quest, QuestLine, Task, QuestContextType } from '../types';

const QuestContext = createContext<QuestContextType | undefined>(undefined);

const STORAGE_KEY = 'sidequest_data';

interface StorageData {
  quests: Quest[];
  questLines: QuestLine[];
}

export const QuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questLines, setQuestLines] = useState<QuestLine[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StorageData = JSON.parse(stored);
        setQuests(data.quests || []);
        setQuestLines(data.questLines || []);
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data: StorageData = { quests, questLines };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [quests, questLines]);

  const addQuest = (title: string, questLine?: string) => {
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title,
      tasks: [],
      questLine,
      starred: false,
      completed: false,
      createdAt: Date.now(),
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
      starred: false,
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
      prev.map((q) =>
        q.id === questId
          ? { ...q, tasks: q.tasks.filter((t) => t.id !== taskId) }
          : q
      )
    );
  };

  const toggleTaskComplete = (questId: string, taskId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const updatedTasks = q.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          // Auto-complete quest if all tasks are done
          const allComplete = updatedTasks.length > 0 && updatedTasks.every((t) => t.completed);
          return { ...q, tasks: updatedTasks, completed: allComplete };
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

  return (
    <QuestContext.Provider
      value={{
        quests,
        questLines,
        addQuest,
        deleteQuest,
        updateQuest,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addQuestLine,
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
