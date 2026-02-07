import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COST_POSTPONE, REWARD_REVISION_FIXED } from '../constants';
import { Calendar, Check, X, Plus, Pin } from 'lucide-react';
import { WashiButton } from './ui/WashiButton';

export const RevisionCenter: React.FC = () => {
  const { state, markRevisionDone, postponeRevision, logManualRevision, currentTheme } = useApp();
  const [isManualOpen, setIsManualOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const dueRevisions = state.revisions.filter(r => 
      r.scheduledDate <= todayStr && r.status === 'PENDING'
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
            <h2 className={`font-caveat text-4xl ${currentTheme.classes.text}`}>"Reinforce the foundation."</h2>
            <p className={`font-hand text-xl ${currentTheme.classes.subText}`}>Level 3: Revision Mode</p>
        </div>

        {/* SECTION A: RULE TASKS */}
        <div className={`p-6 rounded-2xl shadow-sm border ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}>
            <div className={`flex items-center gap-2 mb-6 border-b pb-4 ${currentTheme.classes.border}`}>
                <Calendar className={currentTheme.classes.accentText}/>
                <h3 className={`font-bold uppercase tracking-widest text-sm ${currentTheme.classes.text}`}>Scheduled (1-3-9-14 Rule)</h3>
            </div>

            <div className="space-y-4">
                {dueRevisions.length > 0 ? (
                    dueRevisions.map(rev => (
                        <div key={rev.id} className={`p-4 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-4 ${currentTheme.classes.bg} ${currentTheme.classes.border}`}>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className={`font-bold text-lg ${currentTheme.classes.text}`}>{rev.topic}</h4>
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${currentTheme.classes.subText} bg-black/5`}>
                                    {rev.subject}
                                </span>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => postponeRevision(rev.id)}
                                    disabled={state.inkPoints < COST_POSTPONE}
                                    className={`px-4 py-2 rounded-lg font-hand text-sm border flex items-center gap-1 transition-colors
                                        ${state.inkPoints < COST_POSTPONE 
                                            ? 'border-gray-100 text-gray-300 cursor-not-allowed' 
                                            : 'border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200'}
                                    `}
                                    title="Skip this interval"
                                >
                                    <X size={14}/> Postpone (-{COST_POSTPONE} Ink)
                                </button>
                                <button 
                                    onClick={() => markRevisionDone(rev.id)}
                                    className="px-4 py-2 rounded-lg font-hand text-sm bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-1"
                                >
                                    <Check size={14}/> Mark Done (+{REWARD_REVISION_FIXED} Ink)
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={`text-center py-8 font-hand text-lg ${currentTheme.classes.subText}`}>
                        All caught up on scheduled revisions!
                    </div>
                )}
            </div>
        </div>

        {/* SECTION B: MANUAL LOG */}
        <div className="text-center">
            <button 
                onClick={() => setIsManualOpen(true)}
                className={`font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 mx-auto hover:opacity-80 ${currentTheme.classes.accentText}`}
            >
                <Plus size={16}/> Log Extra Revision
            </button>
        </div>

        {/* MANUAL MODAL */}
        {isManualOpen && (
            <ManualRevisionModal onClose={() => setIsManualOpen(false)} onSave={logManualRevision}/>
        )}

    </div>
  );
};

const ManualRevisionModal = ({ onClose, onSave }: { onClose: () => void, onSave: any }) => {
    const { currentTheme, state } = useApp();
    const [subject, setSubject] = useState<string>(state.subjects[0] || 'Subject 1');
    const [topic, setTopic] = useState('');
    const [minutes, setMinutes] = useState(30);
    const [total, setTotal] = useState('');
    const [incorrect, setIncorrect] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(subject, topic, minutes, parseInt(total)||0, parseInt(incorrect)||0);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            {/* Dotted Index Card Look */}
            <div 
                className={`p-8 w-full max-w-md relative -rotate-1 shadow-[4px_6px_0px_rgba(0,0,0,0.1)] border-2 border-dashed ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
                style={{
                    backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            >
                {/* Decorative Pin */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-red-500 drop-shadow-md">
                    <Pin size={32} fill="currentColor" />
                </div>

                <div className="flex justify-between items-start mb-6 mt-2">
                    <h3 className={`font-caveat text-3xl ${currentTheme.classes.text}`}>Extra Note</h3>
                     <button onClick={onClose} className="p-1 hover:bg-red-50 rounded-full text-red-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        {state.subjects.map((s, idx) => (
                            <button key={s} type="button" onClick={() => setSubject(s)}
                                className={`text-xs font-bold py-2 rounded-sm border-2 font-hand text-lg transition-transform active:scale-95 
                                    ${subject === s ? `${currentTheme.classes.accentBg} text-white border-transparent` : `${currentTheme.classes.bg} ${currentTheme.classes.subText} ${currentTheme.classes.border}`}`}
                            >
                                {s.slice(0,3).toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <input type="text" placeholder="Topic Name" value={topic} onChange={e => setTopic(e.target.value)}
                            className={`w-full border-b-2 p-2 outline-none font-hand text-2xl placeholder-gray-400 ${currentTheme.classes.cardBg} ${currentTheme.classes.text} ${currentTheme.classes.border}`} required />
                    </div>
                    
                    <div className={`p-4 rounded border space-y-3 ${currentTheme.classes.bg} ${currentTheme.classes.border}`}>
                        <div className="flex items-center justify-between">
                             <label className={`text-xs uppercase font-bold ${currentTheme.classes.subText}`}>Duration (Mins)</label>
                             <input type="number" value={minutes} onChange={e => setMinutes(parseInt(e.target.value))} className={`w-20 border-b text-center font-hand text-xl bg-transparent ${currentTheme.classes.border} ${currentTheme.classes.text}`}/>
                        </div>
                        <div className="flex items-center justify-between">
                             <label className={`text-xs uppercase font-bold ${currentTheme.classes.subText}`}>Qs Solved</label>
                             <input type="number" value={total} onChange={e => setTotal(e.target.value)} className={`w-20 border-b text-center font-hand text-xl bg-transparent ${currentTheme.classes.border} ${currentTheme.classes.text}`} placeholder="0"/>
                        </div>
                        <div className="flex items-center justify-between">
                             <label className="text-xs text-red-400 uppercase font-bold">Incorrect</label>
                             <input type="number" value={incorrect} onChange={e => setIncorrect(e.target.value)} className="w-20 border-b border-red-200 text-center font-hand text-xl text-red-500 bg-transparent" placeholder="0"/>
                        </div>
                    </div>
                    
                    <WashiButton type="submit" fullWidth>
                        Pin to Board
                    </WashiButton>
                </form>
            </div>
        </div>
    );
}