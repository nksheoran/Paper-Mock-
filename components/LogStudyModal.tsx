import React, { useState, useEffect } from 'react';
import { X, Timer, BookOpen, CheckCircle, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WashiButton } from './ui/WashiButton';
import { getSubjectColor } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface LogStudyModalProps {
  onClose: () => void;
}

export const LogStudyModal: React.FC<LogStudyModalProps> = ({ onClose }) => {
  const { state, logManualRevision, currentTheme } = useApp();
  const [level, setLevel] = useState<1 | 2>(1);
  const [subject, setSubject] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30); // minutes
  const [questions, setQuestions] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1); // Simple incrementing minute counter for demo
      }, 60000); 
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (level === 1) {
      if (!subject || !topic) return;
      setLevel(2);
    } else {
      if (subject) {
        logManualRevision(
          subject,
          topic,
          duration,
          parseInt(questions) || 0,
          parseInt(incorrect) || 0
        );
      }
      onClose();
    }
  };

  const getSubjectStyle = (sub: string, idx: number) => {
      const color = getSubjectColor(idx);
      if (subject === sub) {
          return {
              className: `py-3 px-4 rounded-lg font-hand font-bold text-lg transition-all border-2 scale-105 shadow-md ${color.bg} text-white border-transparent`,
          };
      }
      return {
          className: `py-3 px-4 rounded-lg font-hand font-bold text-lg transition-all border-2 border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100`,
      };
  };

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: currentTheme.colors.card }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                     <h2 className="font-caveat text-3xl font-bold" style={{ color: currentTheme.colors.text }}>
                        Log Study Session
                    </h2>
                    <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
                        Level {level} / 2
                    </p>
                </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {level === 1 ? (
                /* LEVEL 1: INPUT PHASE */
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {state.subjects.map((sub, idx) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setSubject(sub)}
                          {...getSubjectStyle(sub, idx)}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Topic</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Rotational Motion"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-800 outline-none py-2 font-hand text-2xl text-gray-700 placeholder-gray-300 transition-colors"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Duration (Minutes)</span>
                        <button 
                            type="button" 
                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                            className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${isTimerRunning ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <Timer size={12} /> {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
                        </button>
                    </label>
                    <div className="flex items-center gap-4">
                         <input
                            type="range"
                            min="5"
                            max="180"
                            step="5"
                            value={duration}
                            onChange={(e) => {
                                setDuration(parseInt(e.target.value));
                                setIsTimerRunning(false);
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                            style={{ accentColor: currentTheme.colors.accent }}
                         />
                         <span className="font-hand text-2xl w-16 text-right text-gray-600">{duration}m</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* LEVEL 2: OUTPUT PHASE */
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                   <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-center gap-3">
                       <Flame className="text-orange-400" size={24} />
                       <div>
                           <h4 className="font-bold text-orange-900 text-sm">Reviewing: {topic}</h4>
                           <p className="text-orange-700 text-xs">{subject} • {duration} mins</p>
                       </div>
                   </div>

                  <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Questions Attempted</label>
                        <input
                        type="number"
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                        placeholder="0"
                        className="w-full bg-gray-50 rounded-lg border-none p-4 font-sans text-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-opacity-50"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-bold text-red-400 uppercase tracking-wider">Total Incorrect</label>
                        <input
                        type="number"
                        value={incorrect}
                        onChange={(e) => setIncorrect(e.target.value)}
                        placeholder="0"
                        className="w-full bg-red-50 rounded-lg border-none p-4 font-sans text-2xl font-bold text-red-700 outline-none focus:ring-2 focus:ring-red-200"
                        />
                        <p className="text-xs text-gray-400 mt-2">This metric drives your growth algorithm.</p>
                      </div>
                  </div>
                </motion.div>
              )}

              <div className="pt-4">
                <WashiButton 
                    type="submit" 
                    fullWidth 
                    className="flex items-center justify-center gap-2"
                >
                  {level === 1 ? (
                      <>Next Step <BookOpen size={18} /></>
                  ) : (
                      <>Complete & Collect Ink <CheckCircle size={18} /></>
                  )}
                </WashiButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};