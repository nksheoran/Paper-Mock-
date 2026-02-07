import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THEMES, STICKERS, FONTS, PERSONAS } from '../constants';
import { Lock, Check, Zap, Flame, Stethoscope, Syringe, Pill, Brain, Skull, Microscope, Compass, Rocket, PenTool, Scale, Landmark, Columns, Pi, Heart, Dna, Settings, Activity, Ambulance, PlusSquare, Wrench, Ruler, Sigma, Infinity, Lightbulb, Laptop, Atom, Calculator, Magnet, Siren, Glasses, Book, Gavel, Newspaper, Globe, Phone, Briefcase, Feather, Smile, Palette, Type } from 'lucide-react';
import { WashiButton } from './ui/WashiButton';
import { motion, AnimatePresence } from 'framer-motion';

// Reusing Map for Previews
const IconMap: Record<string, React.ReactNode> = {
  'Zap': <Zap size={32} strokeWidth={2}/>,
  'Flame': <Flame size={32} strokeWidth={2}/>,
  
  // Medical
  'Stethoscope': <Stethoscope size={32} strokeWidth={2}/>,
  'Heart': <Heart size={32} strokeWidth={2}/>,
  'Dna': <Dna size={32} strokeWidth={2}/>,
  'Pill': <Pill size={32} strokeWidth={2}/>,
  'Brain': <Brain size={32} strokeWidth={2}/>,
  'Syringe': <Syringe size={32} strokeWidth={2}/>,
  'Microscope': <Microscope size={32} strokeWidth={2}/>,
  'Skull': <Skull size={32} strokeWidth={2}/>,
  'Activity': <Activity size={32} strokeWidth={2}/>,
  'Ambulance': <Ambulance size={32} strokeWidth={2}/>,
  'PlusSquare': <PlusSquare size={32} strokeWidth={2}/>,
  'Smile': <Smile size={32} strokeWidth={2}/>,

  // Engineering
  'Settings': <Settings size={32} strokeWidth={2}/>,
  'Rocket': <Rocket size={32} strokeWidth={2}/>,
  'Wrench': <Wrench size={32} strokeWidth={2}/>,
  'Ruler': <Ruler size={32} strokeWidth={2}/>,
  'Compass': <Compass size={32} strokeWidth={2}/>,
  'Pi': <Pi size={32} strokeWidth={2}/>,
  'Sigma': <Sigma size={32} strokeWidth={2}/>,
  'Infinity': <Infinity size={32} strokeWidth={2}/>,
  'Lightbulb': <Lightbulb size={32} strokeWidth={2}/>,
  'Laptop': <Laptop size={32} strokeWidth={2}/>,
  'Atom': <Atom size={32} strokeWidth={2}/>,
  'Calculator': <Calculator size={32} strokeWidth={2}/>,
  'Magnet': <Magnet size={32} strokeWidth={2}/>,

  // Arts / UPSC
  'Columns': <Columns size={32} strokeWidth={2}/>,
  'Landmark': <Landmark size={32} strokeWidth={2}/>,
  'Siren': <Siren size={32} strokeWidth={2}/>,
  'PenTool': <PenTool size={32} strokeWidth={2}/>,
  'Glasses': <Glasses size={32} strokeWidth={2}/>,
  'Book': <Book size={32} strokeWidth={2}/>,
  'Scale': <Scale size={32} strokeWidth={2}/>,
  'Gavel': <Gavel size={32} strokeWidth={2}/>,
  'Newspaper': <Newspaper size={32} strokeWidth={2}/>,
  'Globe': <Globe size={32} strokeWidth={2}/>,
  'Phone': <Phone size={32} strokeWidth={2}/>,
  'Briefcase': <Briefcase size={32} strokeWidth={2}/>,
  'Feather': <Feather size={32} strokeWidth={2}/>,
};

export const StationeryShop: React.FC = () => {
  const { state, buyTheme, buySticker, buyFont, setTheme, setFont, currentTheme } = useApp();
  const [activeTab, setActiveTab] = useState<'themes' | 'fonts' | 'stickers'>('themes');

  // FILTER LOGIC: Show Generic OR Goal-Specific
  const getFilteredStickers = () => {
      let userCategory = 'generic';
      if (state.examGoal) {
          const persona = PERSONAS[state.examGoal as keyof typeof PERSONAS];
          if (persona) {
              userCategory = persona.stickerCategory;
          }
      }
      return STICKERS.filter(s => s.category === 'generic' || s.category === userCategory);
  };

  const visibleStickers = getFilteredStickers();

  return (
    <div>
      {/* TABS */}
      <div className="flex justify-center gap-2 mb-8">
        {(['themes', 'fonts', 'stickers'] as const).map(tab => (
            <motion.button 
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-bold text-lg transition-all flex items-center gap-2 border capitalize
                    ${activeTab === tab ? `${currentTheme.classes.accentBg} text-white shadow-lg border-transparent` : `${currentTheme.classes.cardBg} ${currentTheme.classes.subText} ${currentTheme.classes.border}`}`}
                onClick={() => setActiveTab(tab)}
            >
                {tab === 'themes' && <Palette size={18}/>}
                {tab === 'fonts' && <Type size={18}/>}
                {tab === 'stickers' && <Smile size={18}/>}
                {tab}
            </motion.button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence mode='popLayout'>
        {/* --- THEMES TAB --- */}
        {activeTab === 'themes' && THEMES.map((theme, i) => {
            const isUnlocked = state.unlockedThemes.includes(theme.id);
            const isCurrent = state.currentThemeId === theme.id;
            
            return (
              <motion.div 
                key={theme.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className={`rounded-xl p-4 shadow-sm border flex flex-col gap-3 group transition-shadow ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
              >
                <div 
                    className={`h-32 rounded-lg w-full relative overflow-hidden border shadow-inner group-hover:scale-[1.02] transition-transform ${theme.classes.bg} ${theme.classes.border}`}
                >
                    <div className={`absolute top-3 left-3 w-8 h-8 rounded-full shadow-sm ${theme.classes.accentBg}`}></div>
                    <div className="absolute top-3 right-3 w-16 h-4 rounded-sm bg-black/10"></div>
                    <div className={`absolute bottom-3 right-3 w-20 h-16 rounded-lg shadow-sm ${theme.classes.cardBg}`}>
                        <div className="w-full h-2 bg-gray-100/20 mt-2"></div>
                        <div className="w-2/3 h-2 bg-gray-100/20 mt-2 ml-2"></div>
                    </div>
                </div>
                
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className={`font-bold ${currentTheme.classes.text}`}>{theme.name}</h4>
                        {!isUnlocked && <span className="text-xs text-orange-500 font-bold">{theme.price} Ink</span>}
                    </div>
                </div>
                
                {isCurrent ? (
                    <div className="mt-auto text-center py-2 text-green-600 font-bold flex items-center justify-center gap-1 bg-green-50 rounded-lg">
                        <Check size={16}/> Equipped
                    </div>
                ) : isUnlocked ? (
                    <WashiButton onClick={() => setTheme(theme.id)} variant="neutral" className="mt-auto text-sm">
                        Equip
                    </WashiButton>
                ) : (
                    <WashiButton 
                        onClick={() => buyTheme(theme.id, theme.price)} 
                        disabled={state.inkPoints < theme.price}
                        variant="primary" 
                        className={`mt-auto text-sm ${state.inkPoints < theme.price ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {state.inkPoints < theme.price ? <Lock size={14} className="inline mr-1"/> : null} Buy
                    </WashiButton>
                )}
              </motion.div>
            );
        })}

        {/* --- FONTS TAB --- */}
        {activeTab === 'fonts' && FONTS.map((font, i) => {
            const isUnlocked = state.unlockedFonts.includes(font.id);
            const isCurrent = state.currentFontId === font.id;

            return (
                <motion.div 
                    key={font.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -5 }}
                    className={`rounded-xl p-4 shadow-sm border flex flex-col gap-3 ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
                >
                    <div className={`h-32 rounded-lg flex items-center justify-center p-4 text-center overflow-hidden ${currentTheme.classes.bg} ${currentTheme.classes.border} border`}>
                        <p className={`text-3xl leading-tight ${currentTheme.classes.text}`} style={{ fontFamily: font.family }}>
                            The quick brown fox
                        </p>
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className={`font-bold text-sm ${currentTheme.classes.text}`}>{font.name}</h4>
                            {!isUnlocked && <span className="text-xs text-orange-500 font-bold">{font.price} Ink</span>}
                        </div>
                    </div>

                    {isCurrent ? (
                        <div className="mt-auto text-center py-2 text-green-600 font-bold flex items-center justify-center gap-1 bg-green-50 rounded-lg">
                            <Check size={16}/> Equipped
                        </div>
                    ) : isUnlocked ? (
                        <WashiButton onClick={() => setFont(font.id)} variant="neutral" className="mt-auto text-sm">
                            Equip
                        </WashiButton>
                    ) : (
                        <WashiButton 
                            onClick={() => buyFont(font.id, font.price)} 
                            disabled={state.inkPoints < font.price}
                            variant="primary" 
                            className={`mt-auto text-sm ${state.inkPoints < font.price ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Buy
                        </WashiButton>
                    )}
                </motion.div>
            );
        })}

        {/* --- STICKERS TAB (FILTERED) --- */}
        {activeTab === 'stickers' && visibleStickers.map((sticker, i) => {
            const isUnlocked = state.unlockedStickers.includes(sticker.id);
            
            return (
              <motion.div 
                key={sticker.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-xl p-4 shadow-sm border flex flex-col items-center gap-4 group ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
              >
                <div className="h-24 flex items-center justify-center text-gray-700 group-hover:scale-110 transition-transform duration-300">
                     {sticker.type === 'lucide' ? (
                         <div className={currentTheme.classes.accentText}>{IconMap[sticker.content]}</div>
                     ) : (
                         <div className="text-6xl drop-shadow-md">{sticker.content}</div>
                     )}
                </div>
                <div className="text-center w-full">
                    <h4 className={`font-bold text-sm ${currentTheme.classes.text}`}>{sticker.name}</h4>
                    {!isUnlocked && <span className="text-xs text-orange-500 font-bold block">{sticker.price} Ink</span>}
                </div>
                
                {isUnlocked ? (
                     <div className={`mt-auto w-full text-center py-2 text-xs font-bold uppercase tracking-widest rounded-lg ${currentTheme.classes.bg} ${currentTheme.classes.subText}`}>
                        Owned
                    </div>
                ) : (
                    <WashiButton 
                        fullWidth
                        onClick={() => buySticker(sticker.id, sticker.price)} 
                        disabled={state.inkPoints < sticker.price}
                        variant="primary" 
                        className={`mt-auto text-sm ${state.inkPoints < sticker.price ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Buy
                    </WashiButton>
                )}
              </motion.div>
            );
        })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};