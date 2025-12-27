import React from 'react';
import type { Quest } from '../types';
import { TaskCard } from './TaskCard';
import { useQuests } from '../contexts/QuestContext';
import { StarIcon, TrashIcon, CheckIcon } from './Icons';

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
  const allTasksComplete = totalTasks > 0 && completedTasks === totalTasks;

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

  const handleCompleteQuest = () => {
    if (allTasksComplete) {
      // TODO: Play sound here
      updateQuest(quest.id, { completed: true });
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-5 shadow-lg hover:border-gray-600 transition-all w-full max-w-md">
      {/* Quest Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
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
              className="w-full bg-dark-bg border border-gray-600 rounded px-2 py-1 text-xl font-bold focus:outline-none focus:border-success"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="text-xl font-bold text-white cursor-pointer hover:text-success transition-colors truncate"
            >
              {quest.title}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Star button */}
          <button
            onClick={() => updateQuest(quest.id, { starred: !quest.starred })}
            className={`w-5 h-5 transition-all ${
              quest.starred
                ? 'text-warning scale-110 hover:scale-125'
                : 'text-gray-500 hover:text-warning hover:scale-110'
            }`}
          >
            <StarIcon filled={quest.starred} className="w-full h-full" />
          </button>

          {/* Delete button */}
          <button
            onClick={() => {
              if (confirm(`Delete quest "${quest.title}"?`)) {
                deleteQuest(quest.id);
              }
            }}
            className="w-5 h-5 text-gray-500 hover:text-danger transition-colors"
          >
            <TrashIcon className="w-full h-full" />
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
            <span className={`text-sm font-semibold ${
              allTasksComplete ? 'text-success' : 'text-warning'
            }`}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                allTasksComplete ? 'bg-success' : 'bg-warning'
              }`}
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
        <div className="mb-3">
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
            className="w-full bg-dark-bg border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-success mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              className="flex-1 px-4 py-2 bg-success hover:bg-success-hover rounded text-sm font-medium transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setNewTaskText('');
                setIsAddingTask(false);
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full py-2 border-2 border-dashed border-gray-600 hover:border-success rounded-lg text-gray-400 hover:text-success transition-all text-sm font-medium mb-3"
        >
          + Add Task
        </button>
      )}

      {/* Complete Quest Button */}
      <button
        onClick={handleCompleteQuest}
        disabled={!allTasksComplete}
        className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          allTasksComplete
            ? 'bg-success hover:bg-success-hover text-white shadow-lg shadow-success/20 cursor-pointer'
            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
        }`}
      >
        <CheckIcon className="w-5 h-5" />
        {allTasksComplete ? 'Complete Quest' : 'Complete All Tasks First'}
      </button>
    </div>
  );
};
