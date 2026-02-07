import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PenTool, LayoutDashboard, ShoppingBag, BrainCircuit, LineChart as ChartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  view: 'dashboard' | 'revision' | 'report' | 'shop';
  setView: (view: 'dashboard' | 'revision' | 'report' | 'shop') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView }) => {
  const { state, currentTheme, currentFont } = useApp();
  const [prevInk, setPrevInk] = useState(state.inkPoints);

  useEffect(() => {
    setPrevInk(state.inkPoints);
  }, [state.inkPoints]);

  return (
    <header 
      className={`sticky top-0 z-20 backdrop-blur-md bg-opacity-90 border-b px-6 py-4 flex justify-between items-center transition-colors duration-700 ${currentTheme.classes.border}`}
      style={{ backgroundColor: `${currentTheme.colors.bg}E6` }} // Using hex with opacity for backdrop
    >
        <div className="flex items-center gap-3">
            <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg shadow-sm transition-colors ${currentTheme.classes.accentBg} text-white`}
            >
                <PenTool size={20} />
            </motion.div>
            <h1 className={`text-3xl font-bold ${currentTheme.classes.text}`} style={{ fontFamily: currentFont.family }}>
              PaperMock
            </h1>
        </div>

        <div className="flex items-center gap-4">
            <motion.div 
                key={state.inkPoints}
                initial={state.inkPoints > prevInk ? { scale: 1.2, y: -5 } : { scale: 1 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm border ${currentTheme.classes.cardBg} ${currentTheme.classes.border}`}
            >
                <span className="text-xl">🖋️</span>
                <span className={`font-bold text-lg ${currentTheme.classes.text}`}>
                    {state.inkPoints} Ink
                </span>
            </motion.div>
            
             <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setView('dashboard')}
                className={`p-2 rounded-full transition-colors ${view === 'dashboard' ? `${currentTheme.classes.accentBg} text-white shadow-md` : `${currentTheme.classes.subText} hover:${currentTheme.classes.text}`}`}
                title="Levels 1 & 2"
            >
                <LayoutDashboard size={20} />
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setView('revision')}
                className={`p-2 rounded-full transition-colors ${view === 'revision' ? 'bg-emerald-600 text-white shadow-md' : `${currentTheme.classes.subText} hover:${currentTheme.classes.text}`}`}
                title="Level 3 Revision"
            >
                <BrainCircuit size={20} />
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setView('report')}
                className={`p-2 rounded-full transition-colors ${view === 'report' ? `${currentTheme.classes.accentBg} text-white shadow-md` : `${currentTheme.classes.subText} hover:${currentTheme.classes.text}`}`}
                title="Reports"
            >
                <ChartIcon size={20} />
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setView('shop')}
                className={`p-2 rounded-full transition-colors ${view === 'shop' ? `${currentTheme.classes.accentBg} text-white shadow-md` : `${currentTheme.classes.subText} hover:${currentTheme.classes.text}`}`}
                title="Stationery Shop"
            >
                <ShoppingBag size={20} />
            </motion.button>
        </div>
    </header>
  );
};