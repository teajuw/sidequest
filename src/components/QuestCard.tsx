import React from 'react';
import type { Quest } from '../types';
import { TaskCard } from './TaskCard';
import { useQuests } from '../contexts/QuestContext';
import { TrashIcon, ArrowLeftIcon, PencilIcon, StarIcon } from './Icons';

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
    startTracking,
    completeQuest,
    resumeTracking,
    togglePinQuest,
    reorderQuest,
    reorderTask,
  } = useQuests();

  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [newTaskText, setNewTaskText] = React.useState('');
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDraggedOver, setIsDraggedOver] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const totalTasks = quest.tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const allTasksComplete = totalTasks > 0 && completedTasks === totalTasks;

  // Theme colors based on status
  const themeTextClass = quest.status === 'available' ? 'text-danger' : quest.status === 'tracking' ? 'text-warning' : 'text-success';
  const themeBgClass = quest.status === 'available' ? 'bg-danger' : quest.status === 'tracking' ? 'bg-warning' : 'bg-success';

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(quest.id, newTaskText.trim());
      setNewTaskText('');
      setIsAddingTask(false);
    }
  };

  const handleMoveBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (quest.status === 'tracking') {
        updateQuest(quest.id, { status: 'available' });
      } else if (quest.status === 'complete') {
        resumeTracking(quest.id);
      }
      setIsExiting(false);
    }, 300);
  };

  const handleMoveForward = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (quest.status === 'available') {
        startTracking(quest.id);
      } else if (quest.status === 'tracking' && allTasksComplete) {
        completeQuest(quest.id);
      }
      setIsExiting(false);
    }, 300);
  };

  const getForwardButtonText = () => {
    if (quest.status === 'available') return totalTasks === 0 ? 'Add tasks first' : 'Start Tracking';
    if (quest.status === 'tracking') {
      if (totalTasks === 0) return 'Add tasks to complete';
      if (allTasksComplete) return 'Complete Quest';
      return `${completedTasks}/${totalTasks} Complete`;
    }
    return 'Complete Quest';
  };

  const canMoveForward = (quest.status === 'available' && totalTasks > 0) || (quest.status === 'tracking' && allTasksComplete);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      questId: quest.id,
      questStatus: quest.status
    }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear if we're actually leaving the card, not entering a child
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDraggedOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { questId: draggedQuestId, questStatus: draggedQuestStatus } = data;

      // Only allow reordering within the same status
      if (draggedQuestId !== quest.id && draggedQuestStatus === quest.status) {
        // Reorder: place dragged quest before this quest
        reorderQuest(draggedQuestId, quest.id);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const handlePinClick = () => {
    togglePinQuest(quest.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-dark-surface border rounded-xl p-5 shadow-lg w-full cursor-move ${
        isDragging ? 'opacity-50 scale-95 transition-all' : ''
      } ${
        isDraggedOver ? 'border-white scale-105 shadow-2xl transition-all' : 'border-dark-border hover:border-gray-600 transition-all'
      } ${
        isExiting ? 'animate-exit' : ''
      }`}
    >
      {/* Quest Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className={`text-xl font-bold text-white flex-1 truncate`}>
          {quest.title}
        </h2>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Back button */}
          <button
            onClick={handleMoveBack}
            disabled={quest.status === 'available'}
            className={`w-5 h-5 transition-colors ${
              quest.status === 'available'
                ? 'text-gray-700 cursor-not-allowed'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <ArrowLeftIcon className="w-full h-full" />
          </button>

          {/* Edit button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-5 h-5 text-gray-500 hover:text-white transition-colors"
          >
            <PencilIcon className="w-full h-full" />
          </button>

          {/* Pin button */}
          <button
            onClick={handlePinClick}
            className={`w-5 h-5 transition-colors ${
              quest.pinned
                ? 'text-white'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <StarIcon filled={quest.pinned} className="w-full h-full" />
          </button>
        </div>
      </div>

      {/* Quest Line Badge */}
      {quest.questLine && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-600">
            {quest.questLine}
          </span>
        </div>
      )}

      {/* Tasks */}
      <div
        className="space-y-2 mb-3"
        onDragStart={(e) => {
          // Check if the drag started from a task card - if so, prevent quest card drag
          const target = e.target as HTMLElement;
          if (target.closest('[data-task-card]')) {
            e.stopPropagation();
          }
        }}
      >
        {[...quest.tasks]
          .sort((a, b) => b.order - a.order)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              questId={quest.id}
              onToggleComplete={toggleTaskComplete}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onReorder={reorderTask}
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
              onClick={() => {
                setNewTaskText('');
                setIsAddingTask(false);
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Add
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

      {/* Progress/Forward Button */}
      <button
        onClick={quest.status === 'complete' ? () => resumeTracking(quest.id) : handleMoveForward}
        disabled={quest.status !== 'complete' && !canMoveForward}
        className={`
          w-full py-4 rounded-lg font-bold text-lg relative overflow-hidden
          ${quest.status === 'complete' || canMoveForward ? 'cursor-pointer' : 'cursor-not-allowed'}
        `}
        style={{
          background: quest.status === 'available'
            ? (totalTasks > 0 ? '#eab308' : '#374151')
            : quest.status === 'complete'
              ? '#10b981'
              : '#374151',
          color: quest.status === 'available'
            ? (totalTasks > 0 ? '#1f2937' : '#9ca3af')
            : quest.status === 'complete'
              ? '#6b7280'
              : (quest.status === 'tracking' && allTasksComplete ? 'white' : '#9ca3af'),
          opacity: quest.status === 'complete' ? 0.5 : 1
        }}
      >
        {/* Progress bar for tracking status - yellow until complete, then smooth transition to green */}
        {quest.status === 'tracking' && totalTasks > 0 && (
          <div
            className={`absolute inset-0 ${
              allTasksComplete
                ? 'bg-success'
                : 'bg-warning'
            }`}
            style={{
              width: `${progressPercent}%`,
              transition: allTasksComplete
                ? 'width 0.5s ease-out, background-color 0.8s ease-in-out'
                : 'width 0.5s ease-out'
            }}
          />
        )}
        <span className="relative z-10">{getForwardButtonText()}</span>
      </button>

      {/* Date at bottom */}
      {quest.status === 'complete' && quest.completedAt && (
        <div className="mt-3 text-center">
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
      {quest.status === 'available' && quest.createdAt && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Created on {new Date(quest.createdAt).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
      {quest.status === 'tracking' && quest.lastModified && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Last modified {new Date(quest.lastModified).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-dark-surface border border-dark-border rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Edit Quest</h3>
            <input
              type="text"
              defaultValue={quest.title}
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  updateQuest(quest.id, { title: e.target.value.trim() });
                }
              }}
              className="w-full bg-dark-bg border border-gray-600 rounded px-4 py-3 text-lg font-bold focus:outline-none focus:border-gray-400 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (confirm(`Delete quest "${quest.title}"?`)) {
                    deleteQuest(quest.id);
                    setIsEditModalOpen(false);
                  }
                }}
                className="flex-1 px-4 py-2 bg-danger hover:bg-danger-hover rounded-lg font-medium transition-colors"
              >
                Delete Quest
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
