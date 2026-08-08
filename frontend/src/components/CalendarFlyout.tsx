import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarFlyoutProps {
  onClose: () => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CalendarFlyout: React.FC<CalendarFlyoutProps> = ({ onClose }) => {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [clock, setClock] = useState(() => new Date());

  // Update the clock every second
  React.useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrev = () => setViewMonth(new Date(year, month - 1, 1));
  const goNext = () => setViewMonth(new Date(year, month + 1, 1));

  const monthLabel = viewMonth.toLocaleDateString([], { month: 'long', year: 'numeric' });

  return (
    <div
      className="w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 text-slate-100"
      style={{ background: 'rgba(223, 219, 219, 0)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
    >
      {/* Clock header */}
      <div className="px-6 pt-5 pb-2 text-center border-b border-white/8">
        <p className="text-4xl font-light tracking-tight text-black/70 tabular-nums">
          {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <p className="text-xs text-black/70 mt-1">
          {clock.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Calendar */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-black/70">{monthLabel}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              className="p-1 rounded hover:bg-white/10 text-black/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1))}
              className="px-2 py-0.5 rounded text-[10px] text-black/70 hover:bg-white/10 transition-colors"
            >
              Today
            </button>
            <button
              onClick={goNext}
              className="p-1 rounded hover:bg-white/10 text-black/70 hover:text-white transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="text-[9px] font-bold uppercase text-black/70 py-1">
              {d}
            </span>
          ))}
          {cells.map((day, idx) => {
            const isToday =
              day !== null &&
              day === now.getDate() &&
              month === now.getMonth() &&
              year === now.getFullYear();
            return (
              <button
                key={idx}
                onClick={onClose}
                className={`h-8 text-[11px] rounded-lg transition-colors ${isToday
                  ? 'bg-blue-600 text-white font-bold'
                  : day !== null
                    ? 'text-black/70 hover:bg-white/10'
                    : 'text-transparent pointer-events-none'
                  }`}
              >
                {day ?? '.'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
