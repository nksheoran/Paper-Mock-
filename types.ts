export type SessionLevel = 1 | 2 | 3; // 1=Lecture, 2=Practice, 3=Revision

export interface StudySession {
  id: string;
  level: SessionLevel;
  subject: string;
  topic: string;
  // Level 1 Data
  durationMinutes?: number;
  // Level 2/3 Data
  questionsAttempted?: number;
  questionsIncorrect?: number;
  questionsCorrect?: number;
  date: string; // ISO String
}

export interface RevisionTask {
  id: string;
  originalSessionId: string;
  subject: string;
  topic: string;
  scheduledDate: string; // YYYY-MM-DD
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  completedDate?: string;
  // Analytics Data
  durationMinutes?: number;
  questionsAttempted?: number;
  questionsIncorrect?: number;
  questionsCorrect?: number;
}

export interface Theme {
  id: string;
  name: string;
  price: number;
  classes: {
    bg: string;
    cardBg: string;
    text: string;
    subText: string;
    border: string;
    accentText: string;
    accentBg: string;
  };
  colors: {
    accent: string;
    bg: string;
    card: string;
    text: string;
  };
}

export interface Font {
  id: string;
  name: string;
  family: string;
  price: number;
}

export type StickerCategory = 'generic' | 'medical' | 'engineering' | 'arts';

export interface Sticker {
  id: string;
  name: string;
  type: 'emoji' | 'lucide';
  content: string;
  price: number;
  category: StickerCategory;
}

export interface UserState {
  // Identity
  userName: string;
  userTitle: string;
  examGoal: 'NEET' | 'JEE' | 'UPSC' | 'Custom' | '';
  targetDate: string; // ISO Date String for Countdown
  subjects: string[];

  // Economy & Progress
  inkPoints: number;
  dailyMode: 'LEVEL_1' | 'LEVEL_2'; 
  sessions: StudySession[];
  revisions: RevisionTask[];
  
  // Unlocks & Inventory
  unlockedThemes: string[];
  currentThemeId: string;
  
  unlockedFonts: string[];
  currentFontId: string;
  
  unlockedStickers: string[];
  placedStickers: { id: string; stickerId: string; x: number; y: number }[];
}