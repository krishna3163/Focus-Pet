import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, AlertTriangle } from 'lucide-react';
import { TimerMode, UserSettings } from '../types';

interface TimerProps {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  onComplete: (minutes: number) => void;
  onDistraction: () => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  settings: UserSettings;
}

export const Timer: React.FC<TimerProps> = ({
  mode,
  setMode,
  onComplete,
  onDistraction,
  isActive,
  setIsActive,
  settings
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [stopwatchTime, setStopwatchTime] = useState(0);

  // Focus Lock / Distraction Detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isActive) {
         onDistraction();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isActive, settings.strictMode, onDistraction]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (mode === TimerMode.STOPWATCH) {
          setStopwatchTime(t => t + 1);
        } else {
          setTimeLeft(t => {
            if (t <= 1) {
              setIsActive(false);
              onComplete(Math.floor(initialTime / 60));
              return 0;
            }
            return t - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, mode, initialTime, onComplete, setIsActive]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const stopTimer = () => {
    setIsActive(false);
    if(mode !== TimerMode.STOPWATCH) setTimeLeft(initialTime);
  };

  const setDuration = (minutes: number) => {
    setIsActive(false);
    setInitialTime(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (mode === TimerMode.STOPWATCH) return 100;
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

  return (
    <div className="glass-card p-6 md:p-8 w-full max-w-md mx-auto relative overflow-hidden group">
      {/* Glossy Reflection & Hover Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-400/5 to-transparent pointer-events-none group-hover:from-pink-400/10 transition-all"></div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-6 relative z-10">
        <div className="inline-flex bg-black/30 p-1 rounded-xl backdrop-blur-md border border-white/5">
            {[
            { id: TimerMode.POMODORO, label: 'Focus' },
            { id: TimerMode.COUNTDOWN, label: 'Short' },
            { id: TimerMode.STOPWATCH, label: 'Long' }
            ].map((m) => (
            <button
                key={m.id}
                onClick={() => {
                if (!isActive) {
                    setMode(m.id);
                    if (m.id === TimerMode.POMODORO) setDuration(25);
                    if (m.id === TimerMode.COUNTDOWN) setDuration(5);
                    if (m.id === TimerMode.STOPWATCH) setDuration(15);
                }
                }}
                className={`px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                mode === m.id
                    ? 'bg-pink-500/20 text-pink-200 shadow-inner border border-pink-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                {m.label}
            </button>
            ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center relative z-10">
        {/* Timer Circle */}
        <div className="relative mb-6 md:mb-8 w-[240px] md:w-[280px] aspect-square">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
            <circle
                cx="140"
                cy="140"
                r={radius}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
                fill="transparent"
            />
            <circle
                cx="140"
                cy="140"
                r={radius}
                stroke="url(#animeGradient)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                style={{ filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.6))' }}
            />
             <defs>
                <linearGradient id="animeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff00cc" />
                <stop offset="100%" stopColor="#3333ff" />
                </linearGradient>
            </defs>
            </svg>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center w-full">
                <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-2 font-display drop-shadow-[0_4px_10px_rgba(255,105,180,0.5)]">
                    {mode === TimerMode.STOPWATCH ? formatTime(stopwatchTime) : formatTime(timeLeft)}
                </span>
                {!isActive && (
                  <button className="text-pink-300/70 text-xs hover:text-pink-200 transition-colors mt-1 border-b border-dashed border-pink-500/30 pb-0.5">
                      Edit
                  </button>
                )}
            </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center gap-6">
          <button
              onClick={toggleTimer}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-md ${
                  isActive 
                  ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-pink-600/40' 
                  : 'bg-gradient-to-tr from-[#2d1b32] to-[#1a1725] text-white shadow-lg border-pink-500/20 hover:border-pink-500/50'
              }`}
          >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          
          {isActive && (
            <button
              onClick={stopTimer}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm hover:border-red-500/50 hover:text-red-400"
            >
              <Square size={20} fill="currentColor" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};