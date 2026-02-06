import { Theme, Sticker, Font } from './types';

// --- PERSONA ENGINE (The Complete Soul V11) ---
export const PERSONAS = {
  NEET: {
    title: 'Dr.',
    defaults: ['Physics', 'Chemistry', 'Biology'],
    quotes: [
      "The stethoscope is the only jewelry you need.",
      "Every chapter you finish saves a future life.",
      "Study like a patient's life depends on it.",
      "Medicines cure, doctors heal.",
      "White coat, heavy responsibility.",
      "Diagnosis: Hard work.",
      "Prescription: Success.",
      "Not just a student, a future healer.",
      "Biology is the study of you.",
      "Sleep is a luxury, Anatomy is a necessity.",
      "Trust me, I'm (almost) a Doctor.",
      "Emergency: Study Session in progress.",
      "From NCERT to MBBS.",
      "Pulse check: Still studying.",
      "Healing hands in the making."
    ],
    themeColor: '#568A97',
    stickerCategory: 'medical',
    defaultThemeId: 'surgical_green'
  },
  JEE: {
    title: 'Er.',
    defaults: ['Physics', 'Chemistry', 'Maths'],
    quotes: [
      "Engineers turn dreams into reality.",
      "Everything is a number.",
      "Focus on the solution.",
      "Genius is 99% perspiration.",
      "If it isn't broken, fix it anyway.",
      "Physics is the poetry of the universe.",
      "Math is the language of God.",
      "Design. Build. Test. Repeat.",
      "Failure is just data gathering.",
      "I don't need sleep, I need answers.",
      "Pressure makes diamonds.",
      "Think like a proton, stay positive.",
      "Logic gets you from A to B.",
      "Imagination takes you everywhere.",
      "Building the future, one equation at a time."
    ],
    themeColor: '#004C97',
    stickerCategory: 'engineering',
    defaultThemeId: 'blueprint_blue'
  },
  UPSC: {
    title: 'Officer',
    defaults: [], // Triggers Manual Entry
    quotes: [
      "Yogah Karmasu Kaushalam.",
      "Satyameva Jayate.",
      "Be the change you wish to see.",
      "Service before Self.",
      "The steel frame of India.",
      "Character is destiny.",
      "Read like a historian, think like a diplomat.",
      "Power is responsibility.",
      "Not for me, but for the country.",
      "The ink of the scholar is holy.",
      "Character is power.",
      "Excellence is not an act, but a habit.",
      "Jai Hind.",
      "Your signature will become an autograph.",
      "Policy is temporary, Nation is permanent."
    ],
    themeColor: '#A52A2A',
    stickerCategory: 'arts',
    defaultThemeId: 'lbsnaa_rust'
  },
  Custom: {
    title: 'Student',
    defaults: [],
    quotes: ["Study hard, dream big.", "Knowledge is power.", "Focus on the process.", "One day at a time."],
    themeColor: '#EAB308',
    stickerCategory: 'generic',
    defaultThemeId: 'default'
  }
};

// --- THEMES ---
export const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Classic Paper',
    price: 100,
    classes: {
      bg: 'bg-[#FDFBF7]',
      cardBg: 'bg-white',
      text: 'text-gray-800',
      subText: 'text-gray-400',
      border: 'border-stone-200',
      accentText: 'text-yellow-600',
      accentBg: 'bg-yellow-500',
    },
    colors: { bg: '#FDFBF7', card: '#FFFFFF', accent: '#EAB308', text: '#2D2D2D' },
  },
  {
    id: 'matcha',
    name: 'Matcha',
    price: 150,
    classes: {
      bg: 'bg-green-50',
      cardBg: 'bg-white',
      text: 'text-green-900',
      subText: 'text-green-600/60',
      border: 'border-green-200',
      accentText: 'text-green-700',
      accentBg: 'bg-green-600',
    },
    colors: { bg: '#F1F8E9', card: '#FFFFFF', accent: '#558B2F', text: '#1B5E20' },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    price: 150,
    classes: {
      bg: 'bg-pink-50',
      cardBg: 'bg-white',
      text: 'text-pink-900',
      subText: 'text-pink-400',
      border: 'border-pink-200',
      accentText: 'text-pink-500',
      accentBg: 'bg-pink-500',
    },
    colors: { bg: '#FFF0F5', card: '#FFD1DC', accent: '#DB7093', text: '#880E4F' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    price: 200,
    classes: {
      bg: 'bg-slate-900',
      cardBg: 'bg-slate-800',
      text: 'text-white',
      subText: 'text-slate-400',
      border: 'border-slate-700',
      accentText: 'text-blue-400',
      accentBg: 'bg-blue-600',
    },
    colors: { bg: '#0f172a', card: '#1e293b', accent: '#60A5FA', text: '#F8FAFC' },
  },
  {
    id: 'vampire',
    name: 'Vampire',
    price: 300,
    classes: {
      bg: 'bg-red-950',
      cardBg: 'bg-black',
      text: 'text-red-50',
      subText: 'text-red-400/60',
      border: 'border-red-900',
      accentText: 'text-red-500',
      accentBg: 'bg-red-800',
    },
    colors: { bg: '#210505', card: '#000000', accent: '#B71C1C', text: '#FFCDD2' },
  },
  {
    id: 'lbsnaa_rust',
    name: 'LBSNAA Rust',
    price: 250,
    classes: {
      bg: 'bg-[#FDFBF7]',
      cardBg: 'bg-[#F9F5EB]',
      text: 'text-[#3d1a1a]',
      subText: 'text-[#A52A2A]',
      border: 'border-[#A52A2A]/30',
      accentText: 'text-[#A52A2A]',
      accentBg: 'bg-[#A52A2A]',
    },
    colors: { bg: '#FDFBF7', card: '#F9F5EB', accent: '#A52A2A', text: '#3d1a1a' },
  },
  {
    id: 'surgical_green',
    name: 'Surgical Green',
    price: 250,
    classes: {
      bg: 'bg-[#F0E9D8]',
      cardBg: 'bg-white',
      text: 'text-[#1a2e35]',
      subText: 'text-[#568A97]',
      border: 'border-[#568A97]/30',
      accentText: 'text-[#568A97]',
      accentBg: 'bg-[#568A97]',
    },
    colors: { bg: '#F0E9D8', card: '#FFFFFF', accent: '#568A97', text: '#1a2e35' },
  },
  {
    id: 'blueprint_blue',
    name: 'Blueprint',
    price: 250,
    classes: {
      bg: 'bg-[#F8F9FA]',
      cardBg: 'bg-white',
      text: 'text-[#002147]',
      subText: 'text-[#004C97]',
      border: 'border-[#004C97]/30',
      accentText: 'text-[#004C97]',
      accentBg: 'bg-[#004C97]',
    },
    colors: { bg: '#F8F9FA', card: '#FFFFFF', accent: '#004C97', text: '#002147' },
  },
];

// --- FONTS ---
export const FONTS: Font[] = [
  { id: 'patrick', name: 'Patrick Hand', family: '"Patrick Hand", cursive', price: 50 },
  { id: 'dancing', name: 'Dancing Script', family: '"Dancing Script", cursive', price: 50 },
  { id: 'caveat', name: 'Caveat', family: '"Caveat", cursive', price: 60 },
  { id: 'indie', name: 'Indie Flower', family: '"Indie Flower", cursive', price: 70 },
  { id: 'shadows', name: 'Shadows Light', family: '"Shadows Into Light", cursive', price: 80 },
  { id: 'courier', name: 'Typewriter', family: '"Courier Prime", monospace', price: 120 },
];

// --- STICKERS ---
export const STICKERS: Sticker[] = [
  // --- NEET (15) ---
  { id: 'stethoscope', name: 'Stethoscope', type: 'lucide', content: 'Stethoscope', price: 50, category: 'medical' },
  { id: 'heart', name: 'Heart', type: 'lucide', content: 'Heart', price: 50, category: 'medical' },
  { id: 'dna', name: 'DNA', type: 'lucide', content: 'Dna', price: 50, category: 'medical' },
  { id: 'pill', name: 'Pill', type: 'lucide', content: 'Pill', price: 50, category: 'medical' },
  { id: 'lungs', name: 'Lungs', type: 'emoji', content: '🫁', price: 50, category: 'medical' },
  { id: 'brain', name: 'Brain', type: 'lucide', content: 'Brain', price: 50, category: 'medical' },
  { id: 'syringe', name: 'Syringe', type: 'lucide', content: 'Syringe', price: 50, category: 'medical' },
  { id: 'labcoat', name: 'Lab Coat', type: 'emoji', content: '🥼', price: 50, category: 'medical' },
  { id: 'microscope', name: 'Microscope', type: 'lucide', content: 'Microscope', price: 50, category: 'medical' },
  { id: 'skeleton', name: 'Skeleton', type: 'lucide', content: 'Skull', price: 50, category: 'medical' },
  { id: 'bandage', name: 'Bandage', type: 'emoji', content: '🩹', price: 50, category: 'medical' },
  { id: 'ecg', name: 'ECG', type: 'lucide', content: 'Activity', price: 50, category: 'medical' },
  { id: 'ambulance', name: 'Ambulance', type: 'lucide', content: 'Ambulance', price: 50, category: 'medical' },
  { id: 'firstaid', name: 'First Aid', type: 'lucide', content: 'PlusSquare', price: 50, category: 'medical' },
  { id: 'tooth', name: 'Tooth', type: 'emoji', content: '🦷', price: 50, category: 'medical' },

  // --- JEE (15) ---
  { id: 'gear', name: 'Gear', type: 'lucide', content: 'Settings', price: 50, category: 'engineering' },
  { id: 'rocket', name: 'Rocket', type: 'lucide', content: 'Rocket', price: 50, category: 'engineering' },
  { id: 'wrench', name: 'Wrench', type: 'lucide', content: 'Wrench', price: 50, category: 'engineering' },
  { id: 'ruler', name: 'Ruler', type: 'lucide', content: 'Ruler', price: 50, category: 'engineering' },
  { id: 'compass', name: 'Compass', type: 'lucide', content: 'Compass', price: 50, category: 'engineering' },
  { id: 'pi', name: 'Pi', type: 'lucide', content: 'Pi', price: 50, category: 'engineering' },
  { id: 'sigma', name: 'Sigma', type: 'lucide', content: 'Sigma', price: 50, category: 'engineering' },
  { id: 'infinity', name: 'Infinity', type: 'lucide', content: 'Infinity', price: 50, category: 'engineering' },
  { id: 'bulb', name: 'Bulb', type: 'lucide', content: 'Lightbulb', price: 50, category: 'engineering' },
  { id: 'laptop', name: 'Laptop', type: 'lucide', content: 'Laptop', price: 50, category: 'engineering' },
  { id: 'satellite', name: 'Satellite', type: 'emoji', content: '🛰️', price: 50, category: 'engineering' },
  { id: 'bridge', name: 'Bridge', type: 'emoji', content: '🌉', price: 50, category: 'engineering' },
  { id: 'atom', name: 'Atom', type: 'lucide', content: 'Atom', price: 50, category: 'engineering' },
  { id: 'calculator', name: 'Calculator', type: 'lucide', content: 'Calculator', price: 50, category: 'engineering' },
  { id: 'magnet', name: 'Magnet', type: 'lucide', content: 'Magnet', price: 50, category: 'engineering' },

  // --- UPSC / ARTS (15) ---
  { id: 'pillar', name: 'Ashoka Pillar', type: 'lucide', content: 'Columns', price: 50, category: 'arts' },
  { id: 'indiagate', name: 'India Gate', type: 'lucide', content: 'Landmark', price: 50, category: 'arts' },
  { id: 'lalbatti', name: 'Lal Batti', type: 'lucide', content: 'Siren', price: 50, category: 'arts' },
  { id: 'pen', name: 'Fountain Pen', type: 'lucide', content: 'PenTool', price: 50, category: 'arts' },
  { id: 'specs', name: 'Specs', type: 'lucide', content: 'Glasses', price: 50, category: 'arts' },
  { id: 'const_book', name: 'Constitution', type: 'lucide', content: 'Book', price: 50, category: 'arts' },
  { id: 'scale', name: 'Justice', type: 'lucide', content: 'Scale', price: 50, category: 'arts' },
  { id: 'gavel', name: 'Gavel', type: 'lucide', content: 'Gavel', price: 50, category: 'arts' },
  { id: 'newspaper', name: 'Newspaper', type: 'lucide', content: 'Newspaper', price: 50, category: 'arts' },
  { id: 'globe', name: 'Globe', type: 'lucide', content: 'Globe', price: 50, category: 'arts' },
  { id: 'lotus', name: 'Lotus', type: 'emoji', content: '🪷', price: 50, category: 'arts' },
  { id: 'tiger', name: 'Tiger', type: 'emoji', content: '🐅', price: 50, category: 'arts' },
  { id: 'phone', name: 'Old Phone', type: 'lucide', content: 'Phone', price: 50, category: 'arts' },
  { id: 'briefcase', name: 'Briefcase', type: 'lucide', content: 'Briefcase', price: 50, category: 'arts' },
  { id: 'signature', name: 'Signature', type: 'lucide', content: 'Feather', price: 50, category: 'arts' },

  // --- GENERIC ---
  { id: 'star', name: 'Gold Star', type: 'emoji', content: '⭐', price: 50, category: 'generic' },
  { id: 'coffee', name: 'Coffee', type: 'emoji', content: '☕', price: 50, category: 'generic' },
  { id: 'sparkles', name: 'Sparkles', type: 'emoji', content: '✨', price: 50, category: 'generic' },
  { id: 'bolt', name: 'Energy', type: 'lucide', content: 'Zap', price: 50, category: 'generic' },
  { id: 'flame', name: 'Streak', type: 'lucide', content: 'Flame', price: 50, category: 'generic' },
];

// --- SUBJECT COLOR PALETTE ---
export const SUBJECT_PALETTE = [
  { name: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50', hover: 'hover:bg-emerald-100', hex: '#10B981' },
  { name: 'Rose', bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-200', light: 'bg-rose-50', hover: 'hover:bg-rose-100', hex: '#F43F5E' },
  { name: 'Sky', bg: 'bg-sky-500', text: 'text-sky-700', border: 'border-sky-200', light: 'bg-sky-50', hover: 'hover:bg-sky-100', hex: '#0EA5E9' },
  { name: 'Amber', bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50', hover: 'hover:bg-amber-100', hex: '#F59E0B' },
  { name: 'Violet', bg: 'bg-violet-500', text: 'text-violet-700', border: 'border-violet-200', light: 'bg-violet-50', hover: 'hover:bg-violet-100', hex: '#8B5CF6' },
  { name: 'Teal', bg: 'bg-teal-500', text: 'text-teal-700', border: 'border-teal-200', light: 'bg-teal-50', hover: 'hover:bg-teal-100', hex: '#14B8A6' },
  { name: 'Fuchsia', bg: 'bg-fuchsia-500', text: 'text-fuchsia-700', border: 'border-fuchsia-200', light: 'bg-fuchsia-50', hover: 'hover:bg-fuchsia-100', hex: '#D946EF' },
];

export const getSubjectColor = (index: number) => SUBJECT_PALETTE[index % SUBJECT_PALETTE.length];

export const REWARD_PER_MINUTE = 0.5;
export const REWARD_PER_CORRECT_Q = 0.5;
export const REWARD_REVISION_FIXED = 10;
export const COST_POSTPONE = 10;