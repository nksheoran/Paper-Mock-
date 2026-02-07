import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { UserState, StudySession, RevisionTask, Theme, Font } from '../types';
import { loadState, saveState } from '../services/storage';
import { THEMES, FONTS, REWARD_PER_MINUTE, REWARD_PER_CORRECT_Q, REWARD_REVISION_FIXED, COST_POSTPONE, PERSONAS } from '../constants';

interface AppContextType {
  state: UserState;
  
  // Onboarding
  completeOnboarding: (name: string, goal: 'NEET'|'JEE'|'UPSC'|'Custom', subjects: string[], title: string) => void;

  // Logic
  logLevel1: (subject: string, topic: string, minutes: number) => void;
  logLevel2: (subject: string, topic: string, totalQs: number, incorrectQs: number) => void;
  markRevisionDone: (taskId: string) => void;
  completeRevision: (taskId: string, stats: { durationMinutes: number; questionsAttempted: number; questionsIncorrect: number }) => void;
  postponeRevision: (taskId: string) => void;
  logManualRevision: (subject: string, topic: string, minutes: number, totalQs: number, incorrectQs: number) => void;
  setDailyMode: (mode: 'LEVEL_1' | 'LEVEL_2') => void;
  setTargetDate: (date: string) => void;
  
  // Shop
  buyTheme: (themeId: string, price: number) => void;
  setTheme: (themeId: string) => void;
  
  buyFont: (fontId: string, price: number) => void;
  setFont: (fontId: string) => void;
  
  buySticker: (stickerId: string, price: number) => void;
  placeSticker: (stickerId: string, x: number, y: number) => void;
  removeSticker: (instanceId: string) => void;
  
  // Accessors
  currentTheme: Theme;
  currentFont: Font;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [state, setState] = useState<UserState>(loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentTheme = THEMES.find(t => t.id === state.currentThemeId) || THEMES[0];
  const currentFont = FONTS.find(f => f.id === state.currentFontId) || FONTS[0];

  // --- ONBOARDING ---
  const completeOnboarding = (name: string, goal: 'NEET'|'JEE'|'UPSC'|'Custom', subjects: string[], title: string) => {
    // Set a default target date 6 months from now if not set
    const defaultTarget = new Date();
    defaultTarget.setMonth(defaultTarget.getMonth() + 6);

    // Get Persona Default Theme
    const persona = PERSONAS[goal as keyof typeof PERSONAS] || PERSONAS.Custom;
    const unlockedThemes = [...state.unlockedThemes];
    if (persona.defaultThemeId && !unlockedThemes.includes(persona.defaultThemeId)) {
        unlockedThemes.push(persona.defaultThemeId);
    }

    setState(prev => ({
        ...prev,
        userName: name,
        userTitle: title,
        examGoal: goal,
        subjects: subjects,
        targetDate: defaultTarget.toISOString().split('T')[0],
        currentThemeId: persona.defaultThemeId || 'default',
        unlockedThemes: unlockedThemes
    }));
  };

  const setTargetDate = (date: string) => {
    setState(prev => ({ ...prev, targetDate: date }));
  };

  // --- LOGIC IMPLEMENTATION ---
  const logLevel1 = (subject: string, topic: string, minutes: number) => {
    const earnedInk = Math.floor(minutes * REWARD_PER_MINUTE);
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      level: 1,
      subject,
      topic,
      durationMinutes: minutes,
      date: new Date().toISOString(),
    };
    const today = new Date();
    const intervals = [1, 3, 9, 14];
    const newRevisions: RevisionTask[] = intervals.map(days => {
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + days);
      return {
        id: crypto.randomUUID(),
        originalSessionId: newSession.id,
        subject,
        topic,
        scheduledDate: scheduledDate.toISOString().split('T')[0],
        status: 'PENDING',
      };
    });
    setState(prev => ({
      ...prev,
      inkPoints: prev.inkPoints + earnedInk,
      sessions: [newSession, ...prev.sessions],
      revisions: [...prev.revisions, ...newRevisions],
    }));
  };

  const logLevel2 = (subject: string, topic: string, totalQs: number, incorrectQs: number) => {
    const correct = Math.max(0, totalQs - incorrectQs);
    const earnedInk = Math.floor(correct * REWARD_PER_CORRECT_Q);
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      level: 2,
      subject,
      topic,
      questionsAttempted: totalQs,
      questionsIncorrect: incorrectQs,
      questionsCorrect: correct,
      date: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      inkPoints: prev.inkPoints + earnedInk,
      sessions: [newSession, ...prev.sessions],
    }));
  };

  const markRevisionDone = (taskId: string) => {
    setState(prev => ({
      ...prev,
      inkPoints: prev.inkPoints + REWARD_REVISION_FIXED,
      revisions: prev.revisions.map(rev => 
        rev.id === taskId ? { ...rev, status: 'COMPLETED', completedDate: new Date().toISOString() } : rev
      )
    }));
  };

  const completeRevision = (taskId: string, stats: { durationMinutes: number; questionsAttempted: number; questionsIncorrect: number }) => {
    const correct = Math.max(0, stats.questionsAttempted - stats.questionsIncorrect);
    const performanceInk = Math.floor((stats.durationMinutes * REWARD_PER_MINUTE) + (correct * REWARD_PER_CORRECT_Q));
    
    setState(prev => ({
      ...prev,
      inkPoints: prev.inkPoints + REWARD_REVISION_FIXED + performanceInk,
      revisions: prev.revisions.map(rev => 
        rev.id === taskId ? { 
            ...rev, 
            status: 'COMPLETED', 
            completedDate: new Date().toISOString(),
            durationMinutes: stats.durationMinutes,
            questionsAttempted: stats.questionsAttempted,
            questionsIncorrect: stats.questionsIncorrect,
            questionsCorrect: correct
        } : rev
      )
    }));
  };

  const postponeRevision = (taskId: string) => {
    if (state.inkPoints < COST_POSTPONE) return;
    setState(prev => ({
      ...prev,
      inkPoints: prev.inkPoints - COST_POSTPONE,
      revisions: prev.revisions.map(rev => 
        rev.id === taskId ? { ...rev, status: 'SKIPPED' } : rev
      )
    }));
  };

  const logManualRevision = (subject: string, topic: string, minutes: number, totalQs: number, incorrectQs: number) => {
    const correct = Math.max(0, totalQs - incorrectQs);
    const earnedInk = Math.floor((minutes * REWARD_PER_MINUTE) + (correct * REWARD_PER_CORRECT_Q));
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      level: 3,
      subject,
      topic,
      durationMinutes: minutes,
      questionsAttempted: totalQs,
      questionsIncorrect: incorrectQs,
      questionsCorrect: correct,
      date: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      inkPoints: prev.inkPoints + earnedInk,
      sessions: [newSession, ...prev.sessions],
    }));
  };

  const setDailyMode = (mode: 'LEVEL_1' | 'LEVEL_2') => {
    setState(prev => ({ ...prev, dailyMode: mode }));
  };

  // --- SHOP IMPLEMENTATION ---
  
  // Themes
  const buyTheme = (themeId: string, price: number) => {
    if (state.inkPoints >= price && !state.unlockedThemes.includes(themeId)) {
      setState(prev => ({
        ...prev,
        inkPoints: prev.inkPoints - price,
        unlockedThemes: [...prev.unlockedThemes, themeId],
      }));
    }
  };
  const setTheme = (themeId: string) => {
    if (state.unlockedThemes.includes(themeId)) {
      setState(prev => ({ ...prev, currentThemeId: themeId }));
    }
  };

  // Fonts
  const buyFont = (fontId: string, price: number) => {
    if (state.inkPoints >= price && !state.unlockedFonts.includes(fontId)) {
      setState(prev => ({
        ...prev,
        inkPoints: prev.inkPoints - price,
        unlockedFonts: [...prev.unlockedFonts, fontId],
      }));
    }
  };
  const setFont = (fontId: string) => {
    if (state.unlockedFonts.includes(fontId)) {
      setState(prev => ({ ...prev, currentFontId: fontId }));
    }
  };

  // Stickers
  const buySticker = (stickerId: string, price: number) => {
    if (state.inkPoints >= price && !state.unlockedStickers.includes(stickerId)) {
      setState(prev => ({
        ...prev,
        inkPoints: prev.inkPoints - price,
        unlockedStickers: [...prev.unlockedStickers, stickerId],
      }));
    }
  };
  const placeSticker = (stickerId: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      placedStickers: [...prev.placedStickers, { id: crypto.randomUUID(), stickerId, x, y }]
    }));
  };
  const removeSticker = (instanceId: string) => {
    setState(prev => ({
      ...prev,
      placedStickers: prev.placedStickers.filter(s => s.id !== instanceId)
    }));
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      completeOnboarding,
      logLevel1, logLevel2, markRevisionDone, completeRevision, postponeRevision, logManualRevision, setDailyMode, setTargetDate,
      buyTheme, setTheme, 
      buyFont, setFont,
      buySticker, placeSticker, removeSticker,
      currentTheme, currentFont
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};