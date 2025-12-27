import React from 'react';
import type { Task } from '../types';
import { StarIcon, XMarkIcon, CheckIcon } from './Icons';

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
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(questId, task.id)}
          className={`w-5 h-5 rounded border-2 flex-shrink-0 transition-all ${
            task.completed
              ? 'bg-success border-success'
              : 'border-gray-500 hover:border-success-hover'
          }`}
        >
          {task.completed && <CheckIcon className="w-full h-full text-white" />}
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
              className="w-full bg-dark-bg border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-success"
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
          className={`flex-shrink-0 w-5 h-5 transition-all ${
            task.starred
              ? 'text-warning scale-110 hover:scale-125'
              : 'text-gray-500 hover:text-warning hover:scale-110'
          }`}
        >
          <StarIcon filled={task.starred} className="w-full h-full" />
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(questId, task.id)}
          className="flex-shrink-0 w-4 h-4 text-gray-500 hover:text-danger transition-colors"
        >
          <XMarkIcon className="w-full h-full" />
        </button>
      </div>
    </div>
  );
};
