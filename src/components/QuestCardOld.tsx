import React from 'react';
import type { Quest } from '../types';
import { TaskCard } from './TaskCard';
import { useQuests } from '../contexts/QuestContext';
import { TrashIcon, CheckIcon } from './Icons';

interface QuestCardProps {
  quest: Quest;
  showCompleteButton?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, showCompleteButton = true }) => {
  const {
    deleteQuest,
    updateQuest,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    startTracking,
    completeQuest,
    resumeTracking,
  } = useQuests();

  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [newTaskText, setNewTaskText] = React.useState('');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(quest.title);

  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const totalTasks = quest.tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const allTasksComplete = totalTasks > 0 && completedTasks === totalTasks;

  // Theme colors based on status
  const themeColor = quest.status === 'available' ? 'danger' : quest.status === 'tracking' ? 'warning' : 'success';
  const themeTextClass = quest.status === 'available' ? 'text-danger' : quest.status === 'tracking' ? 'text-warning' : 'text-success';
  const themeBgClass = quest.status === 'available' ? 'bg-danger' : quest.status === 'tracking' ? 'bg-warning' : 'bg-success';
  const themeBorderClass = quest.status === 'available' ? 'border-danger' : quest.status === 'tracking' ? 'border-warning' : 'border-success';
  const themeHoverBgClass = quest.status === 'available' ? 'hover:bg-danger-hover' : quest.status === 'tracking' ? 'hover:bg-warning-hover' : 'hover:bg-success-hover';

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
    }
    setIsEditingTitle(false);
  };


  const handleCompleteQuest = () => {
    if (allTasksComplete) {
      completeQuest(quest.id);
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-5 shadow-lg hover:border-gray-600 transition-all w-full">
      {/* Quest Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <div className="w-full relative" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setEditTitle(quest.title);
                    setIsEditingTitle(false);
                  }
                }}
                onBlur={handleSaveTitle}
                autoFocus
                className="w-full bg-dark-bg border border-gray-600 rounded px-2 py-1 text-xl font-bold focus:outline-none focus:border-gray-400"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete quest "${quest.title}"?`)) {
                    deleteQuest(quest.id);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-danger transition-colors"
              >
                <TrashIcon className="w-full h-full" />
              </button>
            </div>
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className={`text-xl font-bold text-white cursor-pointer hover:${themeTextClass} transition-colors truncate`}
            >
              {quest.title}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Start Tracking button (Available status) */}
          {quest.status === 'available' && (
            <button
              onClick={() => startTracking(quest.id)}
              className="px-3 py-1 text-sm rounded-lg font-medium transition-all border-2 border-warning text-warning hover:bg-warning hover:text-black"
            >
              Start
            </button>
          )}

          {/* Complete Quest button (Tracking status) */}
          {quest.status === 'tracking' && showCompleteButton && (
            <button
              onClick={handleCompleteQuest}
              disabled={!allTasksComplete}
              className={`px-3 py-1 text-sm rounded-lg font-medium transition-all ${
                allTasksComplete
                  ? 'bg-success hover:bg-success-hover text-white cursor-pointer'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed border-2 border-gray-700'
              }`}
            >
              Complete
            </button>
          )}

          {/* Resume Tracking button (Complete status) */}
          {quest.status === 'complete' && (
            <button
              onClick={() => resumeTracking(quest.id)}
              className="px-3 py-1 text-sm rounded-lg font-medium transition-all border-2 border-warning text-warning hover:bg-warning hover:text-black"
            >
              Resume
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar and Fraction */}
      {totalTasks > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400">
              {completedTasks}/{totalTasks} tasks
            </span>
            <span className={`text-sm font-semibold ${themeTextClass}`}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${themeBgClass}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Quest Line Badge */}
      {quest.questLine && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-600">
            {quest.questLine}
          </span>
        </div>
      )}

      {/* Completed Date */}
      {quest.status === 'complete' && quest.completedAt && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">
            Completed on {new Date(quest.completedAt).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
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
            className="w-full bg-dark-bg border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
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
          className="w-full py-2 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg text-gray-400 hover:text-white transition-all text-sm font-medium mb-3"
        >
          + Add Task
        </button>
      )}

    </div>
  );
};
