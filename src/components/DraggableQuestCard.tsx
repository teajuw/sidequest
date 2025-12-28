import React from 'react';
import type { Quest, QuestStatus } from '../types';
import { QuestCard } from './QuestCard';
import { useQuests } from '../contexts/QuestContext';

interface DraggableQuestCardProps {
  quest: Quest;
  showCompleteButton?: boolean;
}

export const DraggableQuestCard: React.FC<DraggableQuestCardProps> = ({
  quest,
  showCompleteButton = true
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    console.log('Drag started for quest:', quest.id, 'status:', quest.status);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', quest.id);

    // Create a semi-transparent ghost image
    if (e.currentTarget instanceof HTMLElement) {
      const ghostElement = e.currentTarget.cloneNode(true) as HTMLElement;
      ghostElement.style.opacity = '0.5';
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '-9999px';
      document.body.appendChild(ghostElement);
      e.dataTransfer.setDragImage(ghostElement, 0, 0);
      setTimeout(() => document.body.removeChild(ghostElement), 0);
    }
  };

  const handleDragEnd = () => {
    console.log('Drag ended');
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-quest-status={quest.status}
      className={`transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
        <QuestCard quest={quest} showCompleteButton={showCompleteButton} />
      </div>
    </div>
  );
};
