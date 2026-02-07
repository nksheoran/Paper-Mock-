import { UserState } from '../types';

const STORAGE_KEY = 'papermock_data_v9';

const DEFAULT_STATE: UserState = {
  userName: '',
  userTitle: '',
  examGoal: '',
  targetDate: '',
  subjects: [],
  
  inkPoints: 200, 
  dailyMode: 'LEVEL_1',
  sessions: [],
  revisions: [],
  
  unlockedThemes: ['default'],
  currentThemeId: 'default',
  
  unlockedFonts: ['patrick'],
  currentFontId: 'patrick',
  
  unlockedStickers: [],
  placedStickers: [],
};

export const saveState = (state: UserState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const loadState = (): UserState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { 
          ...DEFAULT_STATE, 
          ...parsed,
          // Migration safety
          subjects: parsed.subjects || [],
          unlockedFonts: parsed.unlockedFonts || ['patrick'],
          userTitle: parsed.userTitle || '',
          targetDate: parsed.targetDate || '',
      };
    }
  } catch (e) {
    console.error("Failed to load state", e);
  }
  return DEFAULT_STATE;
};