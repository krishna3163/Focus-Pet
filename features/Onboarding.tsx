
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { ArrowRight, User, Key, Check, ExternalLink } from 'lucide-react';

interface OnboardingProps {
  onComplete: (settings: Partial<UserSettings>) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Not Specified');
  const [apiKey, setApiKey] = useState('');
  const [step, setStep] = useState(1);

  const handleFinish = () => {
    onComplete({
      username: name,
      gender: gender,
      apiKey: apiKey,
      onboardingComplete: true
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20"></div>
      
      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-cyan-500/20">
            <span className="text-2xl font-bold text-white">Db</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to DocBook</h1>
          <p className="text-gray-400 text-sm mt-2">AI-Powered Healthcare Assistant</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-cyan-400 mb-2 block">What should we call you?</label>
              <div className="bg-[#0B1120] border border-gray-700 rounded-xl p-3 flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="bg-transparent outline-none text-white w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-cyan-400 mb-2 block">Gender</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white outline-none"
              >
                <option value="Not Specified">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button 
              onClick={() => name && setStep(2)}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold transition-colors flex items-center justify-center gap-2"
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
               <h3 className="text-yellow-400 text-sm font-bold flex items-center gap-2 mb-1">
                 <Key size={16} /> API Key Required
               </h3>
               <p className="text-xs text-yellow-200/70 mb-2">
                 We use Google Gemini AI to find doctors, analyze reports, and chat.
               </p>
               <a 
                 href="https://aistudio.google.com/api-keys" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-xs flex items-center gap-1 text-cyan-400 hover:text-white underline transition-colors"
               >
                 Get your free API Key here <ExternalLink size={10} />
               </a>
             </div>
             <div>
              <label className="text-sm font-semibold text-cyan-400 mb-2 block">Google Gemini API Key</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white outline-none"
              />
            </div>
            <button 
              onClick={handleFinish}
              disabled={!apiKey}
              className={`w-full py-3 rounded-xl text-white font-bold transition-colors flex items-center justify-center gap-2 ${apiKey ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-700 cursor-not-allowed'}`}
            >
              Get Started <Check size={18} />
            </button>
            <button onClick={() => setStep(1)} className="text-xs text-gray-500 w-full text-center hover:text-white">Back</button>
          </div>
        )}
      </div>
    </div>
  );
};
