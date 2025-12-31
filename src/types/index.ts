export type QuestStatus = 'available' | 'tracking' | 'complete';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface Quest {
  id: string;
  title: string;
  tasks: Task[];
  status: QuestStatus;
  questLine?: string;
  createdAt: number;
  completedAt?: number;
  lastModified: number;
  order: number;
  pinned: boolean;
}

export interface QuestLine {
  id: string;
  name: string;
  color: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  tasksCompleted: number;
}

export interface UserProgress {
  level: number;
  currentXP: number;
  totalQuestsCompleted: number;
  totalTasksCompleted: number;
  lastQuestCompletionDate?: string; // YYYY-MM-DD format
  dailyQuestsCompleted: number; // Resets daily at midnight
  lastMilestones: {
    questMilestone: number; // Last quest milestone achieved (e.g., 5, 10, 15...)
    taskMilestone: number; // Last task milestone achieved (e.g., 25, 50, 75...)
  };
}

export interface MilestoneNotification {
  type: 'quest' | 'task' | 'level-up' | 'xp-gain';
  message: string;
  value: number; // Quest/task count, new level, or XP gained
}

export interface QuestContextType {
  quests: Quest[];
  questLines: QuestLine[];
  dailyStats: DailyStats[];
  userProgress: UserProgress;
  milestoneNotification: MilestoneNotification | null;
  addQuest: (title: string, questLine?: string) => void;
  deleteQuest: (questId: string) => void;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  addTask: (questId: string, description: string) => void;
  updateTask: (questId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (questId: string, taskId: string) => void;
  toggleTaskComplete: (questId: string, taskId: string) => void;
  addQuestLine: (name: string, color: string) => void;
  startTracking: (questId: string) => void;
  completeQuest: (questId: string) => void;
  resumeTracking: (questId: string) => void;
  togglePinQuest: (questId: string) => void;
  reorderQuest: (draggedQuestId: string, targetQuestId: string) => void;
  reorderTask: (questId: string, draggedTaskId: string, targetTaskId: string) => void;
  dismissMilestoneNotification: () => void;
  importData: (data: object) => void;
}
