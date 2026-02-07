import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval, parseISO, subWeeks, eachDayOfInterval, isSameDay } from 'date-fns';
import { FileText, TrendingUp, Activity, Zap, BrainCircuit, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { getSubjectColor, REWARD_PER_CORRECT_Q, REWARD_PER_MINUTE, REWARD_REVISION_FIXED } from '../constants';
import { motion } from 'framer-motion';

export const WeeklyReport: React.FC = () => {
  const { state, currentTheme } = useApp();

  // --- ANALYTICS ENGINE V11 ---

  // 1. Efficiency Ratio Data (Accuracy & Speed)
  const efficiencyMetrics = React.useMemo(() => {
      let totalQuestions = 0;
      let totalCorrect = 0;
      let totalMinutes = 0; // Only counting sessions where questions were also logged (L3) or just pure speed? 
                            // Prompt says "Questions per Hour". Only L3 has both Time & Qs.
      let l3Questions = 0;
      let l3Minutes = 0;

      state.sessions.forEach(s => {
          if (s.level === 2 || s.level === 3) {
              totalQuestions += (s.questionsAttempted || 0);
              totalCorrect += (s.questionsCorrect || 0);
          }
          if (s.level === 3 && s.durationMinutes && s.questionsAttempted) {
              l3Minutes += s.durationMinutes;
              l3Questions += s.questionsAttempted;
          }
      });

      // Scheduled revisions also contribute to accuracy
      state.revisions.forEach((r: any) => {
          if (r.status === 'COMPLETED') {
              totalQuestions += (r.questionsAttempted || 0);
              totalCorrect += Math.max(0, (r.questionsAttempted || 0) - (r.questionsIncorrect || 0));
              // Revisions are L3 essentially
              if (r.durationMinutes) {
                  l3Minutes += r.durationMinutes;
                  l3Questions += (r.questionsAttempted || 0);
              }
          }
      });

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      const speed = l3Minutes > 0 ? Math.round(l3Questions / (l3Minutes / 60)) : 0;

      return { accuracy, speed };
  }, [state.sessions, state.revisions]);


  // 2. Growth Metric (This Week vs Last Week)
  const growthData = React.useMemo(() => {
      const now = new Date();
      const thisWeekStart = startOfWeek(now);
      const lastWeekStart = startOfWeek(subWeeks(now, 1));
      const lastWeekEnd = endOfWeek(subWeeks(now, 1));

      const thisWeekStats: Record<string, number> = {};
      const lastWeekStats: Record<string, number> = {};

      state.subjects.forEach(s => {
          thisWeekStats[s] = 0;
          lastWeekStats[s] = 0;
      });

      const processSession = (dateStr: string, subject: string, minutes: number) => {
          const date = parseISO(dateStr);
          if (isWithinInterval(date, { start: thisWeekStart, end: endOfWeek(now) })) {
              thisWeekStats[subject] = (thisWeekStats[subject] || 0) + minutes;
          } else if (isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd })) {
              lastWeekStats[subject] = (lastWeekStats[subject] || 0) + minutes;
          }
      };

      state.sessions.forEach(s => {
          if (s.durationMinutes) processSession(s.date, s.subject, s.durationMinutes);
      });
      state.revisions.forEach((r: any) => {
          if (r.status === 'COMPLETED' && r.completedDate) {
              processSession(r.completedDate, r.subject, r.durationMinutes || 15);
          }
      });

      return state.subjects.map(sub => {
          const current = thisWeekStats[sub] || 0;
          const previous = lastWeekStats[sub] || 0;
          const delta = current - previous;
          const percent = previous > 0 ? Math.round((delta / previous) * 100) : (current > 0 ? 100 : 0);
          return { subject: sub, current, previous, delta, percent };
      }).sort((a,b) => b.current - a.current);

  }, [state.sessions, state.revisions, state.subjects]);


  // 3. Cognitive Heatmap (Last 28 Days)
  const heatmapData = React.useMemo(() => {
      const today = new Date();
      const days = eachDayOfInterval({ start: subDays(today, 27), end: today });
      
      // Calculate Daily Ink
      const dailyInk: Record<string, number> = {};
      days.forEach(d => dailyInk[format(d, 'yyyy-MM-dd')] = 0);

      // Helper to add ink
      const addInk = (dateStr: string, amount: number) => {
          const key = dateStr.split('T')[0];
          if (dailyInk[key] !== undefined) dailyInk[key] += amount;
      };

      state.sessions.forEach(s => {
          let ink = 0;
          if (s.level === 1) ink = (s.durationMinutes || 0) * REWARD_PER_MINUTE;
          else if (s.level === 2) ink = (s.questionsCorrect || 0) * REWARD_PER_CORRECT_Q;
          else if (s.level === 3) ink = ((s.durationMinutes || 0) * REWARD_PER_MINUTE) + ((s.questionsCorrect || 0) * REWARD_PER_CORRECT_Q);
          addInk(s.date, Math.floor(ink));
      });

      state.revisions.forEach((r: any) => {
          if (r.status === 'COMPLETED' && r.completedDate) {
              addInk(r.completedDate, REWARD_REVISION_FIXED);
          }
      });

      return days.map(d => {
          const val = dailyInk[format(d, 'yyyy-MM-dd')] || 0;
          // Normalize intensity 0-4
          let intensity = 0;
          if (val > 0) intensity = 1;
          if (val > 50) intensity = 2;
          if (val > 100) intensity = 3;
          if (val > 200) intensity = 4;
          return { date: d, val, intensity };
      });
  }, [state.sessions, state.revisions]);


  // --- OLD CHARTS (Preserved but updated to use V11 logic) ---
  const lineData = React.useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Sessions (All Levels)
      const daySessions = state.sessions.filter(s => s.date.startsWith(dateStr));
      
      // Revisions (Scheduled)
      const dayRevisions = state.revisions.filter(r => 
          r.status === 'COMPLETED' && r.completedDate && r.completedDate.startsWith(dateStr)
      );

      // Aggregate Mins
      const sessionMinutes = daySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
      const revMinutes = dayRevisions.reduce((acc, curr: any) => acc + (curr.durationMinutes || 15), 0);
      
      // Aggregate Qs
      const sessionQs = daySessions.reduce((acc, curr) => acc + (curr.questionsAttempted || 0), 0);
      const revQs = dayRevisions.reduce((acc, curr: any) => acc + (curr.questionsAttempted || 0), 0);

      days.push({
        name: format(d, 'EEE'),
        questions: sessionQs + revQs,
        minutes: sessionMinutes + revMinutes,
      });
    }
    return days;
  }, [state.sessions, state.revisions]);

  const getSubjectColorHex = (subject: string) => {
    const idx = state.subjects.indexOf(subject);
    return getSubjectColor(idx >= 0 ? idx : 0).hex;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
        
        {/* Header */}
        <div className={`p-6 rounded-2xl shadow-soft flex items-center justify-between ${currentTheme.classes.cardBg} ${currentTheme.classes.border} border`}>
            <div>
                <h2 className={`font-caveat text-3xl font-bold ${currentTheme.classes.text}`}>Weekly Analytics</h2>
                <p className={`font-hand text-lg ${currentTheme.classes.subText}`}>Deep dive into your cognitive performance.</p>
            </div>
            <FileText size={32} className={currentTheme.classes.subText}/>
        </div>

        {/* 1. EFFICIENCY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border flex items-center gap-4 ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
             >
                 <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                     <BrainCircuit size={24} />
                 </div>
                 <div>
                     <p className={`text-xs uppercase font-bold tracking-wider ${currentTheme.classes.subText}`}>Average Accuracy</p>
                     <p className={`text-3xl font-bold ${currentTheme.classes.text}`}>{efficiencyMetrics.accuracy}%</p>
                 </div>
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl border flex items-center gap-4 ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
             >
                 <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                     <Zap size={24} />
                 </div>
                 <div>
                     <p className={`text-xs uppercase font-bold tracking-wider ${currentTheme.classes.subText}`}>Revision Speed</p>
                     <p className={`text-3xl font-bold ${currentTheme.classes.text}`}>{efficiencyMetrics.speed} <span className="text-sm font-normal text-gray-400">Qs/hr</span></p>
                 </div>
             </motion.div>
        </div>

        {/* 2. GROWTH METRIC (New) */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl border shadow-sm ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
        >
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className={currentTheme.classes.accentText} size={20}/>
                <h3 className={`font-bold font-hand text-xl ${currentTheme.classes.text}`}>Subject Growth (vs. Last Week)</h3>
            </div>
            <div className="space-y-3">
                {growthData.map((item, idx) => (
                    <div key={item.subject} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: getSubjectColorHex(item.subject) }}></div>
                            <div>
                                <h4 className={`font-bold text-sm ${currentTheme.classes.text}`}>{item.subject}</h4>
                                <p className={`text-xs ${currentTheme.classes.subText}`}>{item.current} mins this week</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-1 font-bold text-sm px-3 py-1 rounded-full 
                            ${item.delta > 0 ? 'bg-green-100 text-green-700' : item.delta < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}
                        >
                            {item.delta > 0 ? <ArrowUp size={14}/> : item.delta < 0 ? <ArrowDown size={14}/> : <Minus size={14}/>}
                            {Math.abs(item.percent)}%
                        </div>
                    </div>
                ))}
                {growthData.length === 0 && <p className="text-center text-gray-400 text-sm">No data to compare yet.</p>}
            </div>
        </motion.div>

        {/* 3. COGNITIVE HEATMAP (New) */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-2xl border shadow-sm ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
        >
             <div className="flex items-center gap-2 mb-6">
                <Activity className="text-orange-500" size={20}/>
                <h3 className={`font-bold font-hand text-xl ${currentTheme.classes.text}`}>28-Day Consistency</h3>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
                {heatmapData.map((day, i) => {
                    const colors = [
                        'bg-gray-100', // 0
                        'bg-green-200', // 1
                        'bg-green-300', // 2
                        'bg-green-400', // 3
                        'bg-green-600'  // 4
                    ];
                    return (
                        <div key={i} className="group relative">
                            <div 
                                className={`w-6 h-6 rounded-sm ${colors[day.intensity]} transition-all hover:scale-125 hover:z-10`}
                            ></div>
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                {format(day.date, 'MMM dd')}: {day.val} Ink
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-center items-center gap-2 mt-4 text-xs text-gray-400 font-sans">
                <span>Less</span>
                <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <span>More</span>
            </div>
        </motion.div>

        {/* 4. ACTIVITY CHART (Classic) */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-2xl shadow-soft border ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
        >
            <h3 className={`font-bold font-hand text-xl mb-4 ${currentTheme.classes.text}`}>Activity Trend (Last 7 Days)</h3>
            <div className="h-64 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                        <XAxis dataKey="name" tick={{fontFamily: 'Patrick Hand', fontSize: 14}} axisLine={false} tickLine={false}/>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                        <Line type="monotone" dataKey="questions" stroke="#EAB308" strokeWidth={3} dot={{r: 4}} />
                        <Line type="monotone" dataKey="minutes" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

    </div>
  );
};