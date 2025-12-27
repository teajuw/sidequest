export interface Task {
  id: string;
  description: string;
  completed: boolean;
  starred?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  tasks: Task[];
  questLine?: string;
  starred?: boolean;
  completed?: boolean;
  createdAt: number;
}

export interface QuestLine {
  id: string;
  name: string;
  color: string;
}

export interface QuestContextType {
  quests: Quest[];
  questLines: QuestLine[];
  addQuest: (title: string, questLine?: string) => void;
  deleteQuest: (questId: string) => void;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  addTask: (questId: string, description: string) => void;
  updateTask: (questId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (questId: string, taskId: string) => void;
  toggleTaskComplete: (questId: string, taskId: string) => void;
  addQuestLine: (name: string, color: string) => void;
}
