import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, ArrowRight } from 'lucide-react';
import { RevisionModal } from './RevisionModal';
import { RevisionTask } from '../types';
import { getSubjectColor } from '../constants';

export const RevisionList: React.FC = () => {
  const { state, currentTheme } = useApp();
  const [selectedTask, setSelectedTask] = useState<RevisionTask | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const dueRevisions = state.revisions.filter(r => 
    r.scheduledDate <= todayStr && r.status === 'PENDING'
  ).sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const getSubjectStyles = (subject: string) => {
      const idx = state.subjects.indexOf(subject);
      const color = getSubjectColor(idx >= 0 ? idx : 0);
      return {
          tape: color.hex,
          textClass: color.text.replace('700', '500') // slightly lighter text
      };
  };

  if (dueRevisions.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
        <p className="font-hand text-xl text-gray-400">All caught up!</p>
        <p className="text-sm text-gray-300">Great job clearing your backlog.</p>
      </div>
    );
  }

  return (
    <>
        <div className="space-y-3">
        {dueRevisions.map(rev => {
            const styles = getSubjectStyles(rev.subject);
            return (
                <div 
                key={rev.id}
                onClick={() => setSelectedTask(rev)}
                className="group cursor-pointer relative flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                {/* Aesthetic "Tape" on the left */}
                <div 
                    className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-md transition-all group-hover:w-2"
                    style={{ backgroundColor: styles.tape }}
                ></div>

                <div className="pl-4">
                    <h4 className="font-hand text-xl font-bold text-gray-800 group-hover:text-black">{rev.topic}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-sans uppercase tracking-wider">
                    <span className={`font-bold ${styles.textClass}`}>
                        {rev.subject}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {rev.scheduledDate === todayStr ? 'Due Today' : 'Overdue'}</span>
                    </div>
                </div>

                <div
                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-gray-50 group-hover:text-gray-600 transition-all"
                >
                    <ArrowRight size={20} />
                </div>
                </div>
            );
        })}
        </div>

        {selectedTask && (
            <RevisionModal 
                task={selectedTask} 
                onClose={() => setSelectedTask(null)} 
            />
        )}
    </>
  );
};