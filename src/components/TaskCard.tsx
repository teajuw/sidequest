import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  questId: string;
  onToggleComplete: (questId: string, taskId: string) => void;
  onDelete: (questId: string, taskId: string) => void;
  onUpdate: (questId: string, taskId: string, updates: Partial<Task>) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  questId,
  onToggleComplete,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(task.description);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(questId, task.id, { description: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(task.description);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`bg-dark-surface border border-dark-border rounded-lg p-3 hover:border-gray-600 transition-all ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(questId, task.id)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 transition-all ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-gray-500 hover:border-emerald-400'
          }`}
        >
          {task.completed && (
            <svg
              className="w-full h-full text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-dark-bg border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-500"
            />
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className={`text-sm cursor-pointer ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-200'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Star button */}
        <button
          onClick={() => onUpdate(questId, task.id, { starred: !task.starred })}
          className="flex-shrink-0 text-gray-500 hover:text-yellow-400 transition-colors"
        >
          {task.starred ? '⭐' : '☆'}
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(questId, task.id)}
          className="flex-shrink-0 text-gray-500 hover:text-red-400 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
