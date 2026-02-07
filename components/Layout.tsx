import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Flame, Stethoscope, Syringe, Pill, Brain, Skull, Microscope, Compass, Rocket, PenTool, Scale, Landmark, Columns, Pi, Heart, Dna, Settings, Activity, Ambulance, PlusSquare, Wrench, Ruler, Sigma, Infinity, Lightbulb, Laptop, Atom, Calculator, Magnet, Siren, Glasses, Book, Gavel, Newspaper, Globe, Phone, Briefcase, Feather, Smile, X, Briefcase as CaseIcon, Star } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { RevisionCenter } from './RevisionCenter';
import { WeeklyReport } from './WeeklyReport';
import { StationeryShop } from './StationeryShop';
import { STICKERS, PERSONAS } from '../constants';
import { Navbar } from './Navbar';
import { Onboarding } from './Onboarding';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to render dynamic Lucide icons
const IconMap: Record<string, React.ReactNode> = {
  'Zap': <Zap size={40} strokeWidth={2.5}/>,
  'Flame': <Flame size={40} strokeWidth={2.5}/>,
  'Stethoscope': <Stethoscope size={40} strokeWidth={2.5}/>,
  'Heart': <Heart size={40} strokeWidth={2.5}/>,
  'Dna': <Dna size={40} strokeWidth={2.5}/>,
  'Pill': <Pill size={40} strokeWidth={2.5}/>,
  'Brain': <Brain size={40} strokeWidth={2.5}/>,
  'Syringe': <Syringe size={40} strokeWidth={2.5}/>,
  'Microscope': <Microscope size={40} strokeWidth={2.5}/>,
  'Skull': <Skull size={40} strokeWidth={2.5}/>,
  'Activity': <Activity size={40} strokeWidth={2.5}/>,
  'Ambulance': <Ambulance size={40} strokeWidth={2.5}/>,
  'PlusSquare': <PlusSquare size={40} strokeWidth={2.5}/>,
  'Smile': <Smile size={40} strokeWidth={2.5}/>,
  'Settings': <Settings size={40} strokeWidth={2.5}/>,
  'Rocket': <Rocket size={40} strokeWidth={2.5}/>,
  'Wrench': <Wrench size={40} strokeWidth={2.5}/>,
  'Ruler': <Ruler size={40} strokeWidth={2.5}/>,
  'Compass': <Compass size={40} strokeWidth={2.5}/>,
  'Pi': <Pi size={40} strokeWidth={2.5}/>,
  'Sigma': <Sigma size={40} strokeWidth={2.5}/>,
  'Infinity': <Infinity size={40} strokeWidth={2.5}/>,
  'Lightbulb': <Lightbulb size={40} strokeWidth={2.5}/>,
  'Laptop': <Laptop size={40} strokeWidth={2.5}/>,
  'Atom': <Atom size={40} strokeWidth={2.5}/>,
  'Calculator': <Calculator size={40} strokeWidth={2.5}/>,
  'Magnet': <Magnet size={40} strokeWidth={2.5}/>,
  'Columns': <Columns size={40} strokeWidth={2.5}/>,
  'Landmark': <Landmark size={40} strokeWidth={2.5}/>,
  'Siren': <Siren size={40} strokeWidth={2.5}/>,
  'PenTool': <PenTool size={40} strokeWidth={2.5}/>,
  'Glasses': <Glasses size={40} strokeWidth={2.5}/>,
  'Book': <Book size={40} strokeWidth={2.5}/>,
  'Scale': <Scale size={40} strokeWidth={2.5}/>,
  'Gavel': <Gavel size={40} strokeWidth={2.5}/>,
  'Newspaper': <Newspaper size={40} strokeWidth={2.5}/>,
  'Globe': <Globe size={40} strokeWidth={2.5}/>,
  'Phone': <Phone size={40} strokeWidth={2.5}/>,
  'Briefcase': <Briefcase size={40} strokeWidth={2.5}/>,
  'Feather': <Feather size={40} strokeWidth={2.5}/>,
};

export const Layout: React.FC = () => {
  const { state, currentTheme, currentFont, placeSticker, removeSticker } = useApp();
  const [view, setView] = useState<'dashboard' | 'revision' | 'report' | 'shop'>('dashboard');
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null);
  const [isPouchOpen, setIsPouchOpen] = useState(false);
  const [pouchTab, setPouchTab] = useState<'career' | 'general'>('career');

  // ONBOARDING CHECK
  if (!state.userName || state.subjects.length === 0) {
      return <Onboarding />;
  }

  const bgClass = currentTheme.classes.bg;

  // Handle Sticker Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if(draggedSticker) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          placeSticker(draggedSticker, x, y);
          setDraggedSticker(null);
          setIsPouchOpen(false); // Close pouch after use
      }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Filter Stickers for Pouch
  const unlockedStickers = STICKERS.filter(s => state.unlockedStickers.includes(s.id));
  const careerCategory = PERSONAS[state.examGoal as keyof typeof PERSONAS]?.stickerCategory || 'generic';
  
  const careerStickers = unlockedStickers.filter(s => s.category === careerCategory);
  const generalStickers = unlockedStickers.filter(s => s.category === 'generic');
  
  const displayedStickers = pouchTab === 'career' ? careerStickers : generalStickers;

  return (
    <div 
        className={`min-h-screen transition-colors duration-700 ease-in-out ${bgClass} ${currentTheme.classes.text}`}
        style={{ fontFamily: currentFont.family }}
    >
      {/* Draggable Area Container */}
      <div 
        className="max-w-4xl mx-auto min-h-screen relative shadow-[0_0_50px_rgba(0,0,0,0.05)]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Render Placed Stickers */}
        <AnimatePresence>
            {state.placedStickers.map(sticker => {
                const stickerData = STICKERS.find(s => s.id === sticker.stickerId);
                if(!stickerData) return null;
                return (
                    <motion.div 
                        key={sticker.id}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute cursor-pointer hover:scale-110 transition-transform z-0 select-none opacity-90 drop-shadow-md"
                        style={{ left: sticker.x - 20, top: sticker.y - 20, color: currentTheme.colors.accent }}
                        onClick={() => removeSticker(sticker.id)}
                        title="Click to remove"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {/* Simulating a "Sticker" with white stroke if using Icon, or just text */}
                        <div className="relative">
                            {/* White Outline Simulation for Dark Themes */}
                            {stickerData.type === 'lucide' && (
                                <div className="absolute inset-0 text-white blur-[2px] scale-110 pointer-events-none">
                                    {IconMap[stickerData.content]}
                                </div>
                            )}
                            <div className="relative z-10">
                                {stickerData.type === 'lucide' ? IconMap[stickerData.content] : <span className="text-4xl">{stickerData.content}</span>}
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </AnimatePresence>

        <Navbar view={view} setView={setView} />

        {/* Content Area */}
        <main className="p-6 relative z-10 pb-32 min-h-[80vh]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {view === 'dashboard' && <Dashboard />}
                    {view === 'revision' && <RevisionCenter />}
                    {view === 'report' && <WeeklyReport />}
                    {view === 'shop' && (
                        <div className="max-w-4xl mx-auto">
                             <div 
                                className={`p-8 rounded-2xl shadow-soft mb-8 text-center ${currentTheme.classes.cardBg} ${currentTheme.classes.border} border`}
                            >
                                <h2 className={`text-4xl font-bold mb-2 ${currentTheme.classes.accentText}`}>The Stationery Shop</h2>
                                <p className={`text-xl ${currentTheme.classes.subText}`}>Spend your Ink Points on beautiful themes, fonts, and stickers.</p>
                                <div className={`inline-block mt-4 px-6 py-2 rounded-full ${currentTheme.classes.bg} border ${currentTheme.classes.border}`}>
                                    <span className={`font-bold ${currentTheme.classes.text}`}>Balance: {state.inkPoints} Ink</span>
                                </div>
                            </div>
                            <StationeryShop />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>

        {/* --- THE STATIONERY CASE (Bottom Sheet) --- */}
        <AnimatePresence>
            {isPouchOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setIsPouchOpen(false)}
                        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                    />
                    
                    {/* Case */}
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 h-[40vh] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden max-w-4xl mx-auto"
                        style={{ 
                            backgroundColor: '#3f3f46', // Zinc-700 (Felt dark grey)
                            backgroundImage: `url("https://www.transparenttextures.com/patterns/felt.png")` 
                        }} 
                    >
                        {/* Tab Handle */}
                        <div className="w-full flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing" onClick={() => setIsPouchOpen(false)}>
                            <div className="w-16 h-1.5 bg-white/20 rounded-full"></div>
                        </div>

                        {/* Tabs */}
                        <div className="flex px-6 gap-4 pt-2">
                             <button 
                                onClick={() => setPouchTab('career')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-bold tracking-widest uppercase transition-colors ${pouchTab === 'career' ? 'bg-zinc-800 text-white shadow-lg' : 'bg-zinc-600/50 text-zinc-400 hover:bg-zinc-600'}`}
                             >
                                 <CaseIcon size={16}/> {state.examGoal || 'Career'}
                             </button>
                             <button 
                                onClick={() => setPouchTab('general')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-bold tracking-widest uppercase transition-colors ${pouchTab === 'general' ? 'bg-zinc-800 text-white shadow-lg' : 'bg-zinc-600/50 text-zinc-400 hover:bg-zinc-600'}`}
                             >
                                 <Star size={16}/> Vibes
                             </button>
                             <div className="ml-auto text-white/50 text-xs flex items-center gap-1 font-mono mt-2">
                                 Drag to place
                             </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 bg-zinc-800 p-6 overflow-y-auto custom-scrollbar shadow-inner relative">
                            {displayedStickers.length > 0 ? (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-6 place-items-center">
                                    {displayedStickers.map(s => (
                                        <motion.div 
                                            key={s.id}
                                            layoutId={s.id}
                                            draggable
                                            onDragStart={() => setDraggedSticker(s.id)}
                                            whileHover={{ scale: 1.15, rotate: 3 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="cursor-grab active:cursor-grabbing relative group"
                                        >
                                            {/* Sticker "Peel" Effect (White Stroke) */}
                                            <div className="absolute -inset-1 bg-white rounded-full opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-300"></div>
                                            <div className="relative text-zinc-100 drop-shadow-xl text-4xl">
                                                {s.type === 'lucide' ? IconMap[s.content] : s.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
                                    <p className="font-hand text-xl">Empty pocket...</p>
                                    <button onClick={() => { setIsPouchOpen(false); setView('shop'); }} className="text-sm underline text-zinc-400 hover:text-white">Visit Shop</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>

        {/* Floating Trigger Button (Only when closed and not in shop) */}
        <AnimatePresence>
            {!isPouchOpen && view !== 'shop' && (
                <motion.button
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPouchOpen(true)}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg border-2 border-dashed flex items-center gap-2 z-30 ${currentTheme.classes.cardBg} ${currentTheme.classes.border} ${currentTheme.classes.text}`}
                >
                    <CaseIcon size={18} className={currentTheme.classes.subText}/>
                    <span className="font-bold text-sm tracking-widest uppercase">Open Case</span>
                </motion.button>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};