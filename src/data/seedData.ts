import type { Quest, QuestLine, DailyStats, UserProgress } from '../types';

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

// Sample quest lines
export const SEED_QUEST_LINES: QuestLine[] = [
  { id: 'ql-1', name: 'Work Projects', color: '#3B82F6' },
  { id: 'ql-2', name: 'Personal Growth', color: '#10B981' },
  { id: 'ql-3', name: 'Health & Fitness', color: '#F59E0B' },
];

// Sample quests showing different states
export const SEED_QUESTS: Quest[] = [
  // Available quests (red)
  {
    id: 'quest-1',
    title: 'Plan Weekend Trip',
    tasks: [
      { id: 'task-1-1', description: 'Research destinations', completed: false, order: 1 },
      { id: 'task-1-2', description: 'Check flight prices', completed: false, order: 2 },
      { id: 'task-1-3', description: 'Book accommodation', completed: false, order: 3 },
    ],
    status: 'available',
    createdAt: now - oneDay * 2,
    lastModified: now - oneDay * 2,
    order: now - oneDay * 2,
    pinned: false,
  },
  {
    id: 'quest-2',
    title: 'Learn TypeScript Generics',
    tasks: [
      { id: 'task-2-1', description: 'Read documentation', completed: false, order: 1 },
      { id: 'task-2-2', description: 'Complete tutorial', completed: false, order: 2 },
      { id: 'task-2-3', description: 'Build practice project', completed: false, order: 3 },
    ],
    status: 'available',
    questLine: 'ql-2',
    createdAt: now - oneDay * 3,
    lastModified: now - oneDay * 3,
    order: now - oneDay * 3,
    pinned: false,
  },

  // Tracking quests (yellow) - partially complete
  {
    id: 'quest-3',
    title: 'Redesign Portfolio Website',
    tasks: [
      { id: 'task-3-1', description: 'Sketch wireframes', completed: true, order: 1 },
      { id: 'task-3-2', description: 'Choose color palette', completed: true, order: 2 },
      { id: 'task-3-3', description: 'Build landing page', completed: false, order: 3 },
      { id: 'task-3-4', description: 'Add projects section', completed: false, order: 4 },
      { id: 'task-3-5', description: 'Deploy to production', completed: false, order: 5 },
    ],
    status: 'tracking',
    questLine: 'ql-1',
    createdAt: now - oneDay * 5,
    lastModified: now - oneDay,
    order: now,
    pinned: true,
  },
  {
    id: 'quest-4',
    title: 'Morning Workout Routine',
    tasks: [
      { id: 'task-4-1', description: '10 min stretching', completed: true, order: 1 },
      { id: 'task-4-2', description: '20 push-ups', completed: false, order: 2 },
      { id: 'task-4-3', description: '30 squats', completed: false, order: 3 },
      { id: 'task-4-4', description: '1 min plank', completed: false, order: 4 },
    ],
    status: 'tracking',
    questLine: 'ql-3',
    createdAt: now - oneDay * 7,
    lastModified: now,
    order: now - 1000,
    pinned: false,
  },

  // Completed quests (green)
  {
    id: 'quest-5',
    title: 'Set Up Development Environment',
    tasks: [
      { id: 'task-5-1', description: 'Install VS Code extensions', completed: true, order: 1 },
      { id: 'task-5-2', description: 'Configure Git', completed: true, order: 2 },
      { id: 'task-5-3', description: 'Set up Node.js', completed: true, order: 3 },
    ],
    status: 'complete',
    questLine: 'ql-1',
    createdAt: now - oneDay * 10,
    lastModified: now - oneDay * 8,
    completedAt: now - oneDay * 8,
    order: now - oneDay * 8,
    pinned: false,
  },
  {
    id: 'quest-6',
    title: 'Read "Atomic Habits"',
    tasks: [
      { id: 'task-6-1', description: 'Chapters 1-5', completed: true, order: 1 },
      { id: 'task-6-2', description: 'Chapters 6-10', completed: true, order: 2 },
      { id: 'task-6-3', description: 'Chapters 11-15', completed: true, order: 3 },
      { id: 'task-6-4', description: 'Write key takeaways', completed: true, order: 4 },
    ],
    status: 'complete',
    questLine: 'ql-2',
    createdAt: now - oneDay * 14,
    lastModified: now - oneDay * 7,
    completedAt: now - oneDay * 7,
    order: now - oneDay * 7,
    pinned: false,
  },
];

// Sample daily stats for streak demonstration
export const SEED_DAILY_STATS: DailyStats[] = [
  { date: new Date(now - oneDay * 6).toISOString().split('T')[0], tasksCompleted: 3 },
  { date: new Date(now - oneDay * 5).toISOString().split('T')[0], tasksCompleted: 5 },
  { date: new Date(now - oneDay * 4).toISOString().split('T')[0], tasksCompleted: 2 },
  { date: new Date(now - oneDay * 3).toISOString().split('T')[0], tasksCompleted: 4 },
  { date: new Date(now - oneDay * 2).toISOString().split('T')[0], tasksCompleted: 6 },
  { date: new Date(now - oneDay).toISOString().split('T')[0], tasksCompleted: 3 },
  { date: new Date(now).toISOString().split('T')[0], tasksCompleted: 2 },
];

// Sample user progress
export const SEED_USER_PROGRESS: UserProgress = {
  level: 3,
  currentXP: 95,
  totalQuestsCompleted: 2,
  totalTasksCompleted: 7,
  dailyQuestsCompleted: 0,
  lastMilestones: {
    questMilestone: 0,
    taskMilestone: 0,
  },
};
