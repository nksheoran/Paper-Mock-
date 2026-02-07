import React, { useState } from 'react';
import { X, CheckCircle, BrainCircuit, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RevisionTask } from '../types';
import { WashiButton } from './ui/WashiButton';

interface RevisionModalProps {
  task: RevisionTask;
  onClose: () => void;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({ task, onClose }) => {
  const { completeRevision, currentTheme } = useApp();
  const [duration, setDuration] = useState(15);
  const [questions, setQuestions] = useState('');
  const [incorrect, setIncorrect] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeRevision(task.id, {
        durationMinutes: duration,
        questionsAttempted: parseInt(questions) || 0,
        questionsIncorrect: parseInt(incorrect) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div 
        className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: currentTheme.colors.card }}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
                 <h2 className="font-caveat text-3xl font-bold" style={{ color: currentTheme.colors.text }}>
                    Level 3: Revision
                </h2>
                <p className="text-sm text-gray-400 font-medium">Revisiting: {task.topic}</p>
            </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center gap-3">
                <BrainCircuit className="text-indigo-500" size={24} />
                <p className="text-indigo-800 text-sm font-medium">
                    Active Recall Session. Solve new problems or re-solve old ones.
                </p>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Clock size={14}/> Time Spent (Minutes)
                </label>
                <div className="flex items-center gap-4">
                     <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                        style={{ accentColor: currentTheme.colors.accent }}
                     />
                     <span className="font-hand text-2xl w-16 text-right text-gray-600">{duration}m</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Qs Attempted</label>
                    <input
                        type="number"
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                        placeholder="0"
                        className="w-full mt-2 bg-gray-50 rounded-lg border-none p-3 font-sans text-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{ '--tw-ring-color': currentTheme.colors.accent } as React.CSSProperties}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-red-400 uppercase tracking-wider">Incorrect</label>
                    <input
                        type="number"
                        value={incorrect}
                        onChange={(e) => setIncorrect(e.target.value)}
                        placeholder="0"
                        className="w-full mt-2 bg-red-50 rounded-lg border-none p-3 font-sans text-xl font-bold text-red-700 outline-none focus:ring-2 focus:ring-red-200"
                        required
                    />
                </div>
            </div>

          <div className="pt-4">
            <WashiButton 
                type="submit" 
                fullWidth 
                className="flex items-center justify-center gap-2"
            >
              Complete Revision (+50 Ink) <CheckCircle size={18} />
            </WashiButton>
          </div>
        </form>
      </div>
    </div>
  );
};