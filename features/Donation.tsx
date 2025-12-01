
import React, { useState } from 'react';
import { HeartHandshake, MapPin, Droplets, Activity, ExternalLink, Phone, Mail, Check } from 'lucide-react';
import { UserSettings, Doctor } from '../types';
import { findDonationCenters } from '../services/ai';
import { motion } from 'framer-motion';

interface DonationProps {
  settings: UserSettings;
}

export const DonationHub: React.FC<DonationProps> = ({ settings }) => {
  const [activeTab, setActiveTab] = useState<'BLOOD' | 'ORGAN'>('BLOOD');
  const [location, setLocation] = useState('');
  const [centers, setCenters] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!location) return;
    setIsLoading(true);
    try {
      const results = await findDonationCenters(settings.apiKey, activeTab, location, settings.bloodGroup);
      setCenters(results);
    } catch(e) { console.error(e); }
    setIsLoading(false);
  };

  const copyToClipboard = (text: string | undefined, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
       <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-4">
          Save a Life
        </h1>
        <p className="text-gray-400">Find reputable donation centers for Blood and Organs.</p>
      </div>

      <div className="flex justify-center mb-8 gap-4">
        <button 
          onClick={() => { setActiveTab('BLOOD'); setCenters([]); }}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'BLOOD' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-gray-800 text-gray-400'}`}
        >
          <Droplets size={20} /> Blood Donation
        </button>
        <button 
          onClick={() => { setActiveTab('ORGAN'); setCenters([]); }}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'ORGAN' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40' : 'bg-gray-800 text-gray-400'}`}
        >
          <Activity size={20} /> Organ Donation
        </button>
      </div>

      <div className="glass-card p-6 mb-8 flex gap-4">
        <input 
          type="text" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your City/Location"
          className="flex-1 bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-red-500"
        />
        <button onClick={handleSearch} disabled={isLoading} className="bg-white/10 hover:bg-white/20 px-6 rounded-xl font-bold">
           {isLoading ? '...' : 'Find Centers'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {centers.map((c, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass-card p-5 border-l-4 border-red-500"
          >
            <h3 className="text-lg font-bold text-white">{c.name}</h3>
            <p className="text-red-400 text-sm">{c.specialty}</p>
            <a href={c.mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 text-xs mt-2 hover:text-red-400">
              <MapPin size={12}/> {c.location}
            </a>
            <p className="text-gray-300 text-sm mt-3">{c.bio}</p>

            {/* Contact Info */}
            <div className="mt-3 grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => copyToClipboard(c.phone, c.id)}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    {copiedPhone === c.id ? <Check size={12} className="text-emerald-400" /> : <Phone size={12} className="text-red-400" />}
                    <span className="truncate">{copiedPhone === c.id ? "Copied!" : (c.phone || "N/A")}</span>
                 </button>
                 <a 
                    href={`mailto:${c.email}`}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    <Mail size={12} className="text-red-400" />
                    <span className="truncate">{c.email || "N/A"}</span>
                 </a>
            </div>

            <button 
              onClick={() => window.open(c.website, '_blank')}
              className="w-full mt-4 py-3 bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-sm font-bold flex items-center justify-center gap-2"
            >
              Contact / Visit Website <ExternalLink size={14}/>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
