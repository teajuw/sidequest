import React from 'react';
import type { Quest } from '../types';
import { TaskCard } from './TaskCard';
import { useQuests } from '../contexts/QuestContext';

interface QuestCardProps {
  quest: Quest;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const {
    deleteQuest,
    updateQuest,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useQuests();

  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [newTaskText, setNewTaskText] = React.useState('');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(quest.title);

  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const totalTasks = quest.tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(quest.id, newTaskText.trim());
      setNewTaskText('');
      setIsAddingTask(false);
    }
  };

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateQuest(quest.id, { title: editTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-5 shadow-lg hover:border-gray-600 transition-all">
      {/* Quest Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') {
                  setEditTitle(quest.title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="w-full bg-dark-bg border border-gray-600 rounded px-2 py-1 text-xl font-bold focus:outline-none focus:border-emerald-500"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="text-xl font-bold text-white cursor-pointer hover:text-emerald-400 transition-colors"
            >
              {quest.title}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Star button */}
          <button
            onClick={() => updateQuest(quest.id, { starred: !quest.starred })}
            className="text-gray-500 hover:text-yellow-400 transition-colors text-xl"
          >
            {quest.starred ? '⭐' : '☆'}
          </button>

          {/* Delete button */}
          <button
            onClick={() => {
              if (confirm(`Delete quest "${quest.title}"?`)) {
                deleteQuest(quest.id);
              }
            }}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar and Fraction */}
      {totalTasks > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400">
              {completedTasks}/{totalTasks} tasks
            </span>
            <span className="text-sm text-emerald-400 font-semibold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2.5">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Quest Line Badge */}
      {quest.questLine && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-900/30 text-purple-300 border border-purple-700/50">
            {quest.questLine}
          </span>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-2 mb-3">
        {quest.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            questId={quest.id}
            onToggleComplete={toggleTaskComplete}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        ))}
      </div>

      {/* Add Task */}
      {isAddingTask ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask();
              if (e.key === 'Escape') {
                setNewTaskText('');
                setIsAddingTask(false);
              }
            }}
            placeholder="Enter task description..."
            autoFocus
            className="flex-1 bg-dark-bg border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm font-medium transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => {
              setNewTaskText('');
              setIsAddingTask(false);
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full py-2 border-2 border-dashed border-gray-600 hover:border-emerald-500 rounded-lg text-gray-400 hover:text-emerald-400 transition-all text-sm font-medium"
        >
          + Add Task
        </button>
      )}
    </div>
  );
};
