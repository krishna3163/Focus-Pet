import React from 'react';
import { UserSettings, ThemeType, PetType, AppView } from '../types';
import { Bell, Lock, Download, Shield, Clock, Smile } from 'lucide-react';
import { exportData, importData, AppData } from '../services/storage';

interface SettingsProps {
  settings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;
  onImport: (data: AppData) => void;
  fullData: AppData;
  setView: (view: AppView) => void;
}

export const SettingsPanel: React.FC<SettingsProps> = ({ settings, updateSettings, onImport, fullData, setView }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updateSettings({ notificationsEnabled: true });
    } else {
        alert("Permission denied.");
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const data = await importData(e.target.files[0]);
        if (data) onImport(data);
      } catch (err) {
        alert('Invalid backup file.');
      }
    }
  };

  return (
    <div className="w-full space-y-6 pb-24">
      <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>

      {/* Profile / Appearance */}
      <section className="glass-card p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Appearance & Vibe</h3>
        
        <div className="space-y-4">
             <div>
                <label className="text-sm font-semibold text-gray-300 ml-1">My Name</label>
                <input 
                    type="text"
                    value={settings.username}
                    onChange={(e) => updateSettings({ username: e.target.value })}
                    className="w-full mt-2 bg-[#0B0A10] border border-[#2D2B3B] rounded-xl p-3 text-sm font-medium outline-none text-white focus:border-violet-500 transition-all"
                    placeholder="What should we call you?"
                />
             </div>
        </div>
      </section>

      {/* Pet Selection */}
      <section className="glass-card p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Pet Companion</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { t: PetType.CAT, l: 'Cat', e: '🐱' },
            { t: PetType.DOG, l: 'Dog', e: '🐶' },
            { t: PetType.ROBOT, l: 'Robot', e: '🤖' },
            { t: PetType.BLOB, l: 'Blob', e: '🟣' }
          ].map(p => (
            <button
              key={p.t}
              onClick={() => updateSettings({ petType: p.t })}
              className={`py-4 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-2 ${
                settings.petType === p.t 
                  ? 'border-violet-500 bg-violet-500/10 text-violet-300 shadow-md transform scale-105' 
                  : 'border-transparent bg-[#0B0A10] text-gray-400 hover:bg-[#2D2B3B]'
              }`}
            >
              <span className="text-3xl">{p.e}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{p.l}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Permissions & Notifications */}
      <section className="glass-card p-6 border-violet-500/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold flex items-center gap-2 text-white">
            <Bell size={20} className="text-violet-400"/>
            Notifications
          </h3>
          <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${settings.notificationsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {settings.notificationsEnabled ? 'ENABLED' : 'DISABLED'}
          </div>
        </div>
        {!settings.notificationsEnabled && (
          <button 
            onClick={requestNotificationPermission}
            className="w-full mt-4 py-3 rounded-xl bg-violet-600 text-white font-bold shadow-lg hover:bg-violet-500 transition-colors"
          >
            Allow Notifications
          </button>
        )}
      </section>
      
      {/* API Key */}
      <section className="glass-card p-6">
         <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Google API Key (for AI chats)</h3>
         <input 
            type="password"
            value={settings.apiKey}
            onChange={(e) => updateSettings({ apiKey: e.target.value })}
            className="w-full bg-[#0B0A10] border border-[#2D2B3B] rounded-xl p-3 text-sm font-medium outline-none text-white focus:border-violet-500 transition-all placeholder-gray-600"
            placeholder="sk-..."
        />
      </section>

      {/* Focus Schedule */}
      <section className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Clock size={16} />
          Focus Schedule
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="text-xs font-bold text-gray-400 ml-1">Start Hour</label>
              <input 
                type="time" 
                value={settings.focusStartHour}
                onChange={(e) => updateSettings({ focusStartHour: e.target.value })}
                className="w-full mt-1 bg-[#0B0A10] border border-[#2D2B3B] rounded-xl p-3 text-sm text-white font-semibold outline-none focus:border-violet-500 transition-all"
              />
           </div>
           <div>
              <label className="text-xs font-bold text-gray-400 ml-1">End Hour</label>
              <input 
                type="time" 
                value={settings.focusEndHour}
                onChange={(e) => updateSettings({ focusEndHour: e.target.value })}
                className="w-full mt-1 bg-[#0B0A10] border border-[#2D2B3B] rounded-xl p-3 text-sm text-white font-semibold outline-none focus:border-violet-500 transition-all"
              />
           </div>
        </div>
      </section>

      {/* Backup */}
      <div className="grid grid-cols-2 gap-4">
         <button 
            onClick={() => exportData(fullData)}
            className="p-5 rounded-3xl bg-[#0B0A10] text-gray-300 font-bold border border-[#2D2B3B] flex flex-col items-center justify-center hover:bg-[#1E1B2E] transition-all"
        >
            <Download className="mb-2 text-violet-500" size={24} />
            <span className="text-sm">Backup Data</span>
        </button>
        <div className="flex flex-col items-center justify-center text-center">
            <p onClick={() => fileInputRef.current?.click()} className="text-xs font-semibold text-gray-500 hover:text-white cursor-pointer transition-colors mt-2">
                Import from file
            </p>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileImport} />
        </div>
      </div>
    </div>
  );
};