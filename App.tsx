import React, { useState, useEffect } from 'react';
import { AppView, PetState, FocusSession, UserSettings, ThemeType, TimerMode, PetType } from './types';
import { loadAppData, saveAppData, defaultSettings, defaultPet, AppData } from './services/storage';
import { Timer } from './features/Timer';
import { Pet } from './features/Pet';
import { Stats } from './features/Stats';
import { SettingsPanel } from './features/Settings';
import { Navigation } from './components/Navigation';
import { BlocklistManager } from './components/BlocklistManager';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState<AppView>(AppView.FOCUS);
  
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [pet, setPet] = useState<PetState>(defaultPet);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.POMODORO);
  const [isActive, setIsActive] = useState(false);

  // Generate Sakura Petals
  const sakuraPetals = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${10 + Math.random() * 20}s`,
    delay: `${Math.random() * 10}s`,
    size: `${10 + Math.random() * 15}px`
  }));

  useEffect(() => {
    const data = loadAppData();
    setSettings(data.settings);
    setPet(data.pet);
    setSessions(data.sessions);
    setIsLoaded(true);
    
    if ('Notification' in window && Notification.permission === 'granted') {
       if (!data.settings.notificationsEnabled) {
          setSettings(prev => ({ ...prev, notificationsEnabled: true }));
       }
    }
  }, []);

  useEffect(() => {
    if (isLoaded) saveAppData({ settings, sessions, pet });
  }, [settings, sessions, pet, isLoaded]);

  const handleSessionComplete = (minutes: number) => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationMinutes: minutes,
      mode: timerMode,
      completed: true,
      distractions: 0
    };
    setSessions(prev => [...prev, newSession]);
    
    setPet(prev => ({
      ...prev,
      xp: prev.xp + (minutes * 10),
      happiness: Math.min(100, prev.happiness + 15),
      health: Math.min(100, prev.health + 5),
      level: Math.floor((prev.xp + minutes * 10) / 1000) + 1
    }));
  };

  const handleDistraction = () => {
    setPet(prev => ({
      ...prev,
      happiness: Math.max(0, prev.happiness - 10),
      health: Math.max(0, prev.health - (settings.strictMode ? 5 : 2))
    }));
  };

  const handleImport = (data: AppData) => {
    setSettings(data.settings);
    setPet(data.pet);
    setSessions(data.sessions);
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#0f0c15] flex items-center justify-center text-white font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#13111C] text-white flex flex-col md:flex-row overflow-hidden relative selection:bg-pink-500/30">
      
      {/* Anime Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px] animate-float-slow pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px] animate-float-medium pointer-events-none z-0"></div>
      <div className="fixed top-[30%] left-[40%] w-[400px] h-[400px] bg-cyan-500/05 rounded-full blur-[90px] pointer-events-none z-0"></div>

      {/* Falling Sakura */}
      {sakuraPetals.map((petal) => (
        <div 
          key={petal.id}
          className="sakura absolute bg-pink-300/40 rounded-full blur-[1px]"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animationDuration: petal.animationDuration,
            animationDelay: petal.delay
          }}
        />
      ))}

      {/* Sidebar Navigation */}
      <Navigation 
        currentView={view} 
        setView={setView} 
        pet={pet} 
        petType={settings.petType}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full h-screen overflow-y-auto z-10 
        px-4 pb-24 pt-6 
        md:px-8 md:pb-8 md:pt-8 md:ml-24">
        
        <AnimatePresence mode="wait">
          {view === AppView.FOCUS && (
            <motion.div 
              key="focus"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center h-full min-h-[500px] gap-8 lg:gap-12"
            >
              <div className="order-2 lg:order-1 flex-1 w-full max-w-md">
                 <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm text-center lg:text-left font-display">
                  Hi, {settings.username || 'Senpai'}!
                </h1>
                <p className="text-pink-200/60 mb-8 text-center lg:text-left font-medium">Let's do our best today! ✨</p>
                
                <Timer 
                  mode={timerMode}
                  setMode={setTimerMode}
                  isActive={isActive}
                  setIsActive={setIsActive}
                  onComplete={handleSessionComplete}
                  onDistraction={handleDistraction}
                  settings={settings}
                />
              </div>

              {/* Main Pet Display */}
              <div className="order-1 lg:order-2 flex-1 flex justify-center w-full">
                 <Pet 
                    pet={pet} 
                    type={settings.petType}
                    isActive={isActive}
                  />
              </div>
            </motion.div>
          )}

          {view === AppView.STATS && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto pt-4"
            >
              <Stats sessions={sessions} apiKey={settings.apiKey} />
            </motion.div>
          )}

          {view === AppView.SETTINGS && (
             <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto pt-4"
             >
                <SettingsPanel 
                  settings={settings}
                  updateSettings={(s) => setSettings({...settings, ...s})}
                  onImport={handleImport}
                  fullData={{ settings, sessions, pet }}
                  setView={setView}
                />
             </motion.div>
          )}

          {view === AppView.BLOCKLIST && (
            <motion.div
              key="blocklist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto pt-4"
            >
               <h2 className="text-3xl font-bold mb-6 drop-shadow-lg text-pink-300">Distraction Shield</h2>
               <div className="glass-card p-6 md:p-8">
                  <BlocklistManager 
                      blocklist={settings.blocklist.map(url => ({ id: url, url, category: 'other' }))} 
                      setBlocklist={(val) => {
                          const newBlocklist = typeof val === 'function' ? val(settings.blocklist.map(u => ({id: u, url: u, category: 'other'} as any))) : val;
                          setSettings({...settings, blocklist: newBlocklist.map(b => b.url)})
                      }} 
                  />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;