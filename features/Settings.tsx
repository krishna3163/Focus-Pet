
import React from 'react';
import { UserSettings, AppView } from '../types';
import { Bell, User, Key, Save, ExternalLink, Info, Heart, Mail, Github, Linkedin } from 'lucide-react';
import { exportData, AppData } from '../services/storage';

interface SettingsProps {
  settings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;
  fullData: AppData;
}

export const SettingsPanel: React.FC<SettingsProps> = ({ settings, updateSettings, fullData }) => {
  return (
    <div className="w-full max-w-2xl mx-auto pb-24 space-y-8">
      <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>

      {/* API Key */}
      <section className="glass-card p-6 border-cyan-500/20">
         <div className="flex items-center gap-2 mb-4">
            <Key className="text-cyan-400" size={20} />
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Google API Key</h3>
         </div>
         <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-gray-400">Required to search for doctors using AI.</p>
            <a 
              href="https://aistudio.google.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
            >
              Get API Key <ExternalLink size={10} />
            </a>
         </div>
         <input 
            type="password"
            value={settings.apiKey}
            onChange={(e) => updateSettings({ apiKey: e.target.value })}
            className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-sm font-medium outline-none text-white focus:border-cyan-500 transition-all placeholder-gray-600"
            placeholder="sk-..."
        />
      </section>

      {/* Profile Section */}
      <section className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
            <User className="text-cyan-400" size={20} />
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Patient Profile</h3>
        </div>
        
        <div className="space-y-4">
             <div>
                <label className="text-sm font-semibold text-gray-300 ml-1 block mb-2">Full Name</label>
                <input 
                    type="text"
                    value={settings.username}
                    onChange={(e) => updateSettings({ username: e.target.value })}
                    className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-sm font-medium outline-none text-white focus:border-cyan-500 transition-all"
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-semibold text-gray-300 ml-1 block mb-2">Age</label>
                    <input 
                        type="number"
                        value={settings.age}
                        onChange={(e) => updateSettings({ age: e.target.value })}
                        className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-sm font-medium outline-none text-white focus:border-cyan-500 transition-all"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-300 ml-1 block mb-2">Gender</label>
                    <select 
                        value={settings.gender}
                        onChange={(e) => updateSettings({ gender: e.target.value })}
                        className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-sm font-medium outline-none text-white focus:border-cyan-500 transition-all"
                    >
                        <option value="Not Specified">Not Specified</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
             </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="glass-card p-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Bell size={18}/>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">Appointment Reminders</h4>
                    <p className="text-xs text-gray-500">Get notified before visits</p>
                </div>
            </div>
            <button 
                onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings.notificationsEnabled ? 'bg-cyan-600' : 'bg-gray-700'}`}
             >
                 <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
             </button>
        </div>
      </section>
      
      <button 
        onClick={() => exportData(fullData)}
        className="w-full p-4 rounded-xl bg-[#0B1120] text-gray-300 font-bold border border-gray-700 flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-all"
      >
        <Save size={18} /> Backup Data
      </button>

      {/* About Section */}
      <section className="glass-card p-6 border-l-4 border-indigo-500 mt-8">
        <div className="flex items-center gap-2 mb-4">
            <Info className="text-indigo-400" size={20} />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">About AI Medical Assistant</h3>
        </div>
        <div className="text-gray-300 space-y-2 text-sm leading-relaxed">
            <p>
              DocBook is an advanced AI-powered medical assistant designed to simplify healthcare access. 
              Find doctors, book tests, locate donors, and analyze reports securely.
            </p>
            
            <div className="flex gap-4 mt-4 py-4 border-t border-white/10 flex-wrap">
              <a href="mailto:kk3163019@gmail.com" className="flex items-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors bg-white/5 px-3 py-2 rounded-lg">
                <Mail size={14} /> kk3163019@gmail.com
              </a>
              <a href="https://github.com/krishna3163" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors bg-white/5 px-3 py-2 rounded-lg">
                <Github size={14} /> GitHub
              </a>
              <a href="https://linkedin.com/in/krishna0858" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors bg-white/5 px-3 py-2 rounded-lg">
                <Linkedin size={14} /> LinkedIn
              </a>
            </div>

            <div className="mt-2 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Version 2.1.0</span>
                    <span>•</span>
                    <span>Build 2025</span>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-900/30 to-indigo-900/30 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Created by</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-1">
                      Krishna <Heart size={10} className="text-red-500 fill-red-500" />
                    </span>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};
