import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WashiButton } from './ui/WashiButton';
import { ArrowRight, BookOpen, Brain, Clock, HelpCircle, Plus } from 'lucide-react';
import { getSubjectColor, PERSONAS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { LogStudyModal } from './LogStudyModal'; // Ensure we can open a modal if needed, or keeping inline.
// Note: Previous Dashboard didn't import LogStudyModal because it had inline logic, but the prompt mentioned animating "The Log Modal".
// I will check LogStudyModal usage. Ah, Dashboard calls `logLevel1` directly. I'll stick to the existing structure but add the modal trigger if needed or just animate the existing inline form which acts as the 'log interface'.
// Wait, LogStudyModal.tsx IS a separate file. The prompt says "The Log Modal: When it opens...". 
// But Dashboard.tsx in the provided files has an INLINE form in the "Action Card". 
// LogStudyModal is likely used elsewhere or intended to be used.
// For now, I will animate the DASHBOARD components as requested.

export const Dashboard: React.FC = () => {
  const { state, setDailyMode, logLevel1, logLevel2, currentTheme } = useApp();
  
  // Form States
  const [subject, setSubject] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [quote, setQuote] = useState('');
  
  // L1 Specific
  const [minutes, setMinutes] = useState(60);

  // L2 Specific
  const [totalQs, setTotalQs] = useState('');
  const [incorrectQs, setIncorrectQs] = useState('');

  const isLevel1 = state.dailyMode === 'LEVEL_1';

  // LOAD RANDOM QUOTE ON MOUNT
  useEffect(() => {
    let career = PERSONAS[state.examGoal as keyof typeof PERSONAS];
    if (!career) career = PERSONAS.Custom;
    
    const randomQuote = career.quotes[Math.floor(Math.random() * career.quotes.length)];
    setQuote(randomQuote);
  }, [state.examGoal]);

  const handleL1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if(subject && topic && minutes > 0) {
      logLevel1(subject, topic, minutes);
      setTopic('');
    }
  };

  const handleL2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseInt(totalQs);
    const i = parseInt(incorrectQs);
    if(subject && topic && !isNaN(t) && !isNaN(i)) {
      logLevel2(subject, topic, t, i);
      setTopic('');
      setTotalQs('');
      setIncorrectQs('');
    }
  };

  // Dynamic Subject Coloring Helper using centralized palette
  const getSubjectColorClasses = (index: number, isSelected: boolean) => {
      const color = getSubjectColor(index);
      if (isSelected) {
          return `${color.bg} text-white border-transparent shadow-md`;
      }
      return `${color.border} ${color.text} ${color.light} ${color.hover}`;
  };

  // Animation Variants for Staggered Text
  const quoteContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const quoteLetter = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      {/* HEADER & MODE SWITCHER */}
      <div className="text-center space-y-2">
         <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`font-caveat text-4xl transition-colors ${currentTheme.classes.text}`}
         >
            Hello, {state.userTitle} {state.userName}.
         </motion.h2>
         
         {/* Staggered Quote */}
         <motion.div 
            className={`font-hand text-xl italic ${currentTheme.classes.subText} min-h-[32px]`}
            variants={quoteContainer}
            initial="hidden"
            animate="visible"
         >
            {quote.split("").map((char, index) => (
                <motion.span key={index} variants={quoteLetter}>
                    {char}
                </motion.span>
            ))}
         </motion.div>

         <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.5 }}
             className={`text-sm mt-2 p-2 inline-block rounded-lg ${currentTheme.classes.bg} ${currentTheme.classes.border} border`}
         >
             Target: <span className="font-bold">{state.targetDate}</span>
         </motion.div>
      </div>

      {/* ACTION CARD */}
      <motion.div 
           layout
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", stiffness: 300, damping: 30 }}
           className={`p-8 rounded-2xl shadow-xl transition-colors duration-500 border-t-4 ${currentTheme.classes.cardBg} ${currentTheme.classes.border} border`}
           style={{ borderTopColor: currentTheme.colors.accent }}
      >
         
         <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
                 {isLevel1 ? <BookOpen className={currentTheme.classes.accentText}/> : <Brain className={currentTheme.classes.accentText}/>}
                 <span className={`font-bold uppercase tracking-widest text-sm ${currentTheme.classes.subText}`}>
                     {isLevel1 ? 'Log Lecture' : 'Log Practice'}
                 </span>
             </div>
             {isLevel1 && (
                 <button 
                    onClick={() => setDailyMode('LEVEL_2')}
                    className={`text-xs flex items-center gap-1 transition-colors ${currentTheme.classes.subText} hover:${currentTheme.classes.text}`}
                 >
                     Proceed to Level 2 <ArrowRight size={12}/>
                 </button>
             )}
             {!isLevel1 && (
                 <button 
                    onClick={() => setDailyMode('LEVEL_1')}
                    className={`text-xs transition-colors ${currentTheme.classes.subText} hover:${currentTheme.classes.text}`}
                 >
                     Back to Lectures
                 </button>
             )}
         </div>

         <form onSubmit={isLevel1 ? handleL1Submit : handleL2Submit} className="space-y-6">
             
             {/* DYNAMIC SUBJECT SELECTOR - Flex Wrap for N items */}
             <div className="flex flex-wrap gap-2 justify-center">
                  {state.subjects.map((sub, idx) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={sub}
                      type="button"
                      onClick={() => setSubject(sub)}
                      className={`
                        py-2 px-4 rounded-lg font-hand font-bold text-lg transition-colors border-2
                        ${getSubjectColorClasses(idx, subject === sub)}
                      `}
                    >
                      {sub.slice(0, 15)}
                    </motion.button>
                  ))}
             </div>

             {/* TOPIC INPUT */}
             <div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Topic Name..."
                  className={`w-full bg-transparent border-b-2 outline-none py-2 font-hand text-2xl transition-colors
                      ${currentTheme.classes.text} 
                      ${currentTheme.classes.border} 
                      focus:${currentTheme.classes.border}
                      placeholder-gray-400
                  `}
                  required
                />
             </div>

             {/* MODE SPECIFIC INPUTS */}
             <AnimatePresence mode="wait">
                 {isLevel1 ? (
                     <motion.div 
                        key="L1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-2"
                     >
                         <label className={`text-xs font-bold uppercase flex items-center gap-1 ${currentTheme.classes.subText}`}>
                             <Clock size={12}/> Duration (Minutes)
                         </label>
                         <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="10"
                                max="240"
                                step="10"
                                value={minutes}
                                onChange={(e) => setMinutes(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: currentTheme.colors.accent }}
                            />
                            <span className={`font-hand text-2xl w-16 text-right ${currentTheme.classes.text}`}>{minutes}m</span>
                        </div>
                        <p className={`text-xs font-medium text-right ${currentTheme.classes.accentText}`}>+ {Math.floor(minutes * 0.5)} Ink Reward</p>
                     </motion.div>
                 ) : (
                     <motion.div 
                        key="L2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-2 gap-4"
                     >
                         <div>
                            <label className={`text-xs font-bold uppercase flex items-center gap-1 mb-2 ${currentTheme.classes.subText}`}>
                                <HelpCircle size={12}/> Total Questions
                            </label>
                            <input 
                                type="number"
                                value={totalQs}
                                onChange={e => setTotalQs(e.target.value)}
                                className={`w-full rounded-lg p-3 font-bold outline-none focus:ring-2 ${currentTheme.classes.bg} ${currentTheme.classes.text}`}
                                placeholder="0"
                            />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-red-400 uppercase flex items-center gap-1 mb-2">
                                <Plus size={12} className="rotate-45"/> Incorrect
                            </label>
                            <input 
                                type="number"
                                value={incorrectQs}
                                onChange={e => setIncorrectQs(e.target.value)}
                                className="w-full bg-red-50 text-red-800 rounded-lg p-3 font-bold outline-none focus:ring-2 focus:ring-red-200"
                                placeholder="0"
                            />
                         </div>
                     </motion.div>
                 )}
             </AnimatePresence>

             <WashiButton 
                type="submit" 
                fullWidth 
                variant={isLevel1 ? 'primary' : 'secondary'}
                className="mt-4"
             >
                 {isLevel1 ? 'Log Session' : 'Complete Practice'}
             </WashiButton>

         </form>
      </motion.div>
      
      {/* RECENT LOGS */}
      <div className="opacity-80">
          <h3 className={`text-center font-caveat text-2xl mb-4 ${currentTheme.classes.subText}`}>Today's Logs</h3>
          <div className="space-y-2">
              <AnimatePresence>
                  {state.sessions
                      .filter(s => s.date.startsWith(new Date().toISOString().split('T')[0]))
                      .map((s, index) => (
                      <motion.div 
                          key={s.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border flex justify-between items-center text-sm ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
                      >
                          <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${s.level === 1 ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
                              <span className={`font-bold ${currentTheme.classes.text}`}>{s.topic}</span>
                          </div>
                          <span className={`font-mono ${currentTheme.classes.subText}`}>
                              {s.level === 1 ? `${s.durationMinutes}m` : `${s.questionsCorrect}/${s.questionsAttempted} Correct`}
                          </span>
                      </motion.div>
                  ))}
              </AnimatePresence>
              {state.sessions.filter(s => s.date.startsWith(new Date().toISOString().split('T')[0])).length === 0 && (
                  <p className={`text-center font-hand ${currentTheme.classes.subText}`}>Empty paper...</p>
              )}
          </div>
      </div>

    </div>
  );
};