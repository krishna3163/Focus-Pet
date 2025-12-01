import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, AlertTriangle } from 'lucide-react';
import { PetState, PetMood } from '../types';

interface FocusTimerProps {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  onComplete: (duration: number) => void;
  onDistraction: () => void;
  pet: PetState;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ 
  isActive, 
  setIsActive, 
  onComplete, 
  onDistraction,
  pet 
}) => {
  const [duration, setDuration] = useState(25); // Minutes
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [distractionWarning, setDistractionWarning] = useState(false);

  // Tab visibility detection for "Blocking" simulation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        setDistractionWarning(true);
        // Play a sound or send notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(`Come back!`, {
            body: `${pet.name} gets sad when you leave!`,
            icon: '/favicon.ico'
          });
        }
        onDistraction();
      } else {
        setDistractionWarning(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive, onDistraction, pet.name]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      onComplete(duration);
      setSecondsLeft(duration * 60); // Reset
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onComplete, duration, setIsActive]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const stopTimer = () => {
    setIsActive(false);
    setSecondsLeft(duration * 60);
  };

  const setTime = (mins: number) => {
    setDuration(mins);
    setSecondsLeft(mins * 60);
    setIsActive(false);
  };

  // Calculate Progress
  const progress = ((duration * 60 - secondsLeft) / (duration * 60)) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (distractionWarning) {
    return (
      <div className="fixed inset-0 bg-red-500/90 z-50 flex items-center justify-center flex-col text-white p-8 animate-pulse">
        <AlertTriangle size={64} className="mb-4" />
        <h2 className="text-3xl font-bold text-center">DISTRACTION DETECTED!</h2>
        <p className="mt-2 text-xl text-center">Return to focus immediately to save {pet.name}!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Time Selector */}
      {!isActive && (
        <div className="flex space-x-2 mb-8 bg-gray-100 p-1 rounded-xl">
          {[15, 25, 45, 60].map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                duration === t ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}m
            </button>
          ))}
        </div>
      )}

      {/* SVG Circular Timer */}
      <div className="relative mb-8">
        <svg width="300" height="300" className="transform -rotate-90">
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="#6366f1"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-5xl font-bold text-gray-800 tracking-tighter block">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-gray-400 text-sm font-medium uppercase tracking-widest mt-2 block">
            {isActive ? 'Focusing' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6">
        <button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-transform transform hover:scale-105 active:scale-95 ${
            isActive ? 'bg-amber-400 text-white' : 'bg-indigo-600 text-white'
          }`}
        >
          {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        {isActive && (
          <button
            onClick={stopTimer}
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Square size={20} fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
};