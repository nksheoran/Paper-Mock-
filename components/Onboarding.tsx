import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Stethoscope, Compass, PenTool, CheckCircle, Plus, Trash2, Landmark } from 'lucide-react';
import { PERSONAS } from '../constants';

export const Onboarding: React.FC = () => {
  const { completeOnboarding, currentTheme, currentFont } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'NEET' | 'JEE' | 'UPSC' | 'Custom' | ''>('');
  const [customSubjects, setCustomSubjects] = useState<string[]>(['']);

  const handleGoalSelect = (selectedGoal: 'NEET' | 'JEE' | 'UPSC') => {
    setGoal(selectedGoal);
    
    // BRANCH LOGIC: NEET/JEE have defaults -> Skip to Finish
    // UPSC -> Goes to Step 3 (Subject Selection)
    if (selectedGoal === 'NEET' || selectedGoal === 'JEE') {
        const persona = PERSONAS[selectedGoal];
        // Complete immediately with default subjects
        completeOnboarding(name, selectedGoal, persona.defaults, persona.title);
        setStep(4);
    } else {
        // UPSC / Custom MUST show Add Subject Screen
        setStep(3); 
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const validSubjects = customSubjects.filter(s => s.trim().length > 0);
      if(validSubjects.length > 0) {
          const persona = PERSONAS['UPSC'];
          completeOnboarding(name, 'UPSC', validSubjects, persona.title);
          setStep(4);
      }
  };

  const updateCustomSubject = (index: number, value: string) => {
      const newSubs = [...customSubjects];
      newSubs[index] = value;
      setCustomSubjects(newSubs);
  };

  const addSubjectField = () => {
      if (customSubjects.length < 10) {
        setCustomSubjects([...customSubjects, '']);
      }
  };

  const removeSubjectField = (index: number) => {
      const newSubs = customSubjects.filter((_, i) => i !== index);
      setCustomSubjects(newSubs);
  };

  // Step 4 is just an animation/transition state
  if (step === 4) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-gray-800" style={{fontFamily: currentFont.family}}>
              <div className="text-center animate-pulse">
                  <CheckCircle size={64} className="mx-auto text-emerald-500 mb-4"/>
                  <h2 className="text-3xl font-bold">Sanctuary Created.</h2>
                  <p className="text-xl text-gray-400 mt-2">Welcome home, {name}.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFBF7] transition-colors"
         style={{ fontFamily: currentFont.family, backgroundColor: currentTheme.colors.bg }}
    >
        <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
                <div className="space-y-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 font-caveat">Hi, I'm PaperMock.</h1>
                    <p className="text-xl text-gray-500">I'm here to help you study. What should I call you?</p>
                    
                    {/* VISIBILITY FIX: Forced white background and dark text, ignoring theme */}
                    <div className="relative group">
                      <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name..."
                          className="w-full text-center text-3xl border-2 border-gray-200 focus:border-gray-800 outline-none py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all"
                          autoFocus
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div className="pt-4 h-16">
                        {name.trim().length > 0 && (
                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                            >
                                Continue <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: GOAL */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 font-caveat">Nice to meet you, {name}.</h2>
                        <p className="text-gray-500">What is your main target?</p>
                    </div>
                    
                    <div className="grid gap-4">
                        <button 
                            onClick={() => handleGoalSelect('NEET')}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group bg-white text-gray-900"
                        >
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                                <Stethoscope size={24}/>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">NEET</h3>
                                <p className="text-sm text-gray-500">Dr. {name}</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleGoalSelect('JEE')}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group bg-white text-gray-900"
                        >
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                                <Compass size={24}/>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">JEE</h3>
                                <p className="text-sm text-gray-500">Er. {name}</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleGoalSelect('UPSC')}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-left group bg-white text-gray-900"
                        >
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-full group-hover:scale-110 transition-transform">
                                <Landmark size={24}/>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">UPSC / Custom</h3>
                                <p className="text-sm text-gray-500">Officer {name}</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: CUSTOM SUBJECTS (Dynamic List) */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 font-caveat">Design your curriculum.</h2>
                        <p className="text-gray-500">Add up to 10 subjects.</p>
                    </div>

                    <form onSubmit={handleCustomSubmit} className="space-y-4">
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {customSubjects.map((sub, idx) => (
                                <div key={idx} className="flex gap-2 items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">#{idx+1}</span>
                                        <input 
                                            type="text" 
                                            value={sub}
                                            onChange={(e) => updateCustomSubject(idx, e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pl-10 font-bold outline-none focus:border-gray-800 transition-colors text-gray-900"
                                            placeholder={`Subject Name`}
                                            autoFocus={idx === customSubjects.length - 1}
                                            required
                                        />
                                    </div>
                                    {customSubjects.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeSubjectField(idx)}
                                            className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                            title="Remove Subject"
                                        >
                                            <Trash2 size={20}/>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {customSubjects.length < 10 && (
                            <button 
                                type="button" 
                                onClick={addSubjectField}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 font-bold hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20}/> Add Another Subject
                            </button>
                        )}

                        <div className="pt-2">
                             <button
                                type="submit"
                                disabled={customSubjects.filter(s => s.trim()).length === 0}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95
                                    ${customSubjects.filter(s => s.trim()).length > 0
                                        ? 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg cursor-pointer' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                                `}
                            >
                                Finish Setup
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    </div>
  );
};