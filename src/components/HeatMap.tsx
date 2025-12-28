import React from 'react';
import type { DailyStats } from '../types';

interface HeatMapProps {
  dailyStats: DailyStats[];
}

export const HeatMap: React.FC<HeatMapProps> = ({ dailyStats }) => {
  // Generate last 12 weeks of dates
  const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();

    // Go back 12 weeks (84 days)
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();

  // Create a map of date string to tasks completed
  const statsMap = new Map<string, number>();
  dailyStats.forEach(stat => {
    statsMap.set(stat.date, stat.tasksCompleted);
  });

  // Use fixed scale based on task count (not relative to max)
  // Makes it harder to reach max green - need 10+ tasks for full color
  const getColor = (tasksCompleted: number) => {
    if (tasksCompleted === 0) return 'bg-dark-surface border-dark-border';
    if (tasksCompleted === 1) return 'bg-success/20 border-success/20';
    if (tasksCompleted <= 3) return 'bg-success/40 border-success/40';
    if (tasksCompleted <= 6) return 'bg-success/60 border-success/60';
    if (tasksCompleted <= 9) return 'bg-success/80 border-success/80';
    return 'bg-success border-success';
  };

  // Group dates by week
  const weeks: Date[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div>
      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-2 text-sm text-gray-500 pr-3 justify-around">
          {dayLabels.map((day, i) => (
            <div key={i} className="h-6" style={{ visibility: i % 2 === 0 ? 'visible' : 'hidden' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Heat map grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-2">
                {week.map((date, dayIndex) => {
                  const dateString = date.toISOString().split('T')[0];
                  const tasksCompleted = statsMap.get(dateString) || 0;

                  return (
                    <div
                      key={dayIndex}
                      className={`w-6 h-6 rounded border ${getColor(tasksCompleted)} transition-all hover:scale-110 hover:ring-2 hover:ring-success cursor-pointer`}
                      title={`${dateString}: ${tasksCompleted} task${tasksCompleted !== 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-end gap-2 text-sm text-gray-500">
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-4 rounded bg-dark-surface border border-dark-border" />
          <div className="w-4 h-4 rounded bg-success/20 border border-success/20" />
          <div className="w-4 h-4 rounded bg-success/40 border border-success/40" />
          <div className="w-4 h-4 rounded bg-success/60 border border-success/60" />
          <div className="w-4 h-4 rounded bg-success/80 border border-success/80" />
          <div className="w-4 h-4 rounded bg-success border border-success" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
