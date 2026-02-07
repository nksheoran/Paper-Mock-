import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';

export const WeeklyChart: React.FC = () => {
  const { state, currentTheme } = useApp();

  // Process data: Group sessions by last 7 days
  const data = React.useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const daySessions = state.sessions.filter(s => s.date.startsWith(dateStr));
      const totalMinutes = daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: totalMinutes,
        questions: daySessions.reduce((acc, curr) => acc + curr.questionsAttempted, 0),
        fullDate: dateStr
      });
    }
    return days;
  }, [state.sessions]);

  return (
    <div className="h-64 w-full mt-4 font-hand">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#9CA3AF', fontSize: 14, fontFamily: 'Patrick Hand' }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            hide
          />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: currentTheme.colors.card, 
                border: 'none', 
                boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                fontFamily: 'Inter'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="minutes" 
            stroke={currentTheme.colors.accent} 
            strokeWidth={3}
            dot={{ r: 4, fill: currentTheme.colors.bg, strokeWidth: 2, stroke: currentTheme.colors.accent }}
            activeDot={{ r: 6, fill: currentTheme.colors.accent }}
            animationDuration={1500}
            strokeDasharray="5 2" // Gives a bit of a "pen stroke" feel if combined with type
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};