import React from 'react';
import type { QuestStatus } from '../types';

interface DropZoneProps {
  targetStatus: QuestStatus;
  onDrop: (questId: string, targetStatus: QuestStatus) => void;
  children: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({ targetStatus, onDrop, children }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [draggedStatus, setDraggedStatus] = React.useState<QuestStatus | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    // Check if we have quest data being dragged
    if (e.dataTransfer.types.includes('text/plain')) {
      setIsDragOver(true);

      // Determine if this is a valid drop based on status progression
      const isValidDrop =
        (draggedStatus === 'available' && targetStatus === 'tracking') ||
        (draggedStatus === 'tracking' && targetStatus === 'complete') ||
        (draggedStatus === 'complete' && targetStatus === 'tracking');

      e.dataTransfer.dropEffect = isValidDrop ? 'move' : 'none';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('Drop detected! Quest ID:', e.dataTransfer.getData('text/plain'), 'Dragged status:', draggedStatus, 'Target status:', targetStatus);
    setIsDragOver(false);

    const questId = e.dataTransfer.getData('text/plain');
    const currentStatus = draggedStatus;

    // Validate drop
    const isValidDrop =
      (currentStatus === 'available' && targetStatus === 'tracking') ||
      (currentStatus === 'tracking' && targetStatus === 'complete') ||
      (currentStatus === 'complete' && targetStatus === 'tracking');

    console.log('Is valid drop?', isValidDrop);

    if (isValidDrop && questId) {
      onDrop(questId, targetStatus);
    }

    setDraggedStatus(null);
  };

  // Listen for drag events to track the dragged quest status
  React.useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      const status = target?.getAttribute('data-quest-status') as QuestStatus;
      console.log('DropZone detected drag start, status:', status, 'target:', target);
      if (status) {
        setDraggedStatus(status);
      }
    };

    const handleDragEnd = () => {
      console.log('DropZone detected drag end');
      setDraggedStatus(null);
      setIsDragOver(false);
    };

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative"
    >
      {children}

      {/* Drop Zone Indicator Overlay */}
      {isDragOver && draggedStatus && (
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none transition-all ${
            ((draggedStatus === 'available' && targetStatus === 'tracking') ||
             (draggedStatus === 'tracking' && targetStatus === 'complete') ||
             (draggedStatus === 'complete' && targetStatus === 'tracking'))
              ? 'bg-white/10 border-4 border-dashed border-white/50 backdrop-blur-sm'
              : 'bg-red-500/10 border-4 border-dashed border-red-500/50'
          }`}
          style={{ zIndex: 50 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-2xl font-bold ${
              ((draggedStatus === 'available' && targetStatus === 'tracking') ||
               (draggedStatus === 'tracking' && targetStatus === 'complete') ||
               (draggedStatus === 'complete' && targetStatus === 'tracking'))
                ? 'text-white'
                : 'text-red-500'
            }`}>
              {((draggedStatus === 'available' && targetStatus === 'tracking') ||
                (draggedStatus === 'tracking' && targetStatus === 'complete') ||
                (draggedStatus === 'complete' && targetStatus === 'tracking'))
                ? 'Drop Here'
                : 'Cannot Drop'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
