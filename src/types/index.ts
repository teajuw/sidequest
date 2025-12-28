export type QuestStatus = 'available' | 'tracking' | 'complete';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  tasks: Task[];
  status: QuestStatus;
  questLine?: string;
  createdAt: number;
  completedAt?: number;
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

export interface QuestContextType {
  quests: Quest[];
  questLines: QuestLine[];
  dailyStats: DailyStats[];
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
}
