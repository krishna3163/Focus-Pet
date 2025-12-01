
import React, { useState } from 'react';
import { Search, MapPin, Building2, Star, Phone, Mail, Check } from 'lucide-react';
import { Doctor, UserSettings } from '../types';
import { findHospitals } from '../services/ai';
import { motion, AnimatePresence } from 'framer-motion';

interface HospitalSearchProps {
  settings: UserSettings;
  onBook: (doc: Doctor, slot: string, symptoms: string) => void;
}

export const HospitalSearch: React.FC<HospitalSearchProps> = ({ settings, onBook }) => {
  const [need, setNeed] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Doctor[]>([]);
  const [error, setError] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!settings.apiKey) return setError("API Key missing.");
    if (!need || !location) return setError("Please details.");

    setIsLoading(true);
    setHospitals([]);
    setError("");

    try {
      const results = await findHospitals(settings.apiKey, need, location);
      setHospitals(results);
      if (results.length === 0) setError("No hospitals found.");
    } catch (e) {
      setError("Search failed.");
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent mb-4">
          Find Best Hospitals
        </h1>
        <p className="text-gray-400">Locate top-rated emergency centers and hospitals.</p>
      </div>

      <div className="glass-card p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-red-400 uppercase mb-2 block">What do you need?</label>
            <input 
              type="text" value={need} onChange={e => setNeed(e.target.value)}
              placeholder="e.g. Emergency, Trauma, General Ward"
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-red-400 uppercase mb-2 block">Location</label>
            <input 
              type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder="e.g. London, UK"
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? <span className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></span> : <><Search size={20}/> Find Hospitals</>}
        </button>
        {error && <p className="text-red-400 text-center mt-2 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {hospitals.map((hosp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-5 border-red-500/20 hover:border-red-500/50"
            >
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{hosp.name}</h3>
                    <p className="text-red-400 text-sm">{hosp.specialty}</p>
                    <a href={hosp.mapUrl} target="_blank" rel="noreferrer" className="text-gray-400 text-xs mt-1 flex items-center gap-1 hover:text-red-400"><MapPin size={12}/> {hosp.location}</a>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs bg-yellow-400/10 px-2 py-1 rounded">
                     <Star size={12} fill="currentColor"/> {hosp.rating}
                  </div>
               </div>
               
               <p className="text-gray-400 text-sm mt-3">{hosp.bio}</p>

                {/* Contact Info */}
               <div className="mt-3 grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => copyToClipboard(hosp.phone, hosp.id)}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    {copiedPhone === hosp.id ? <Check size={12} className="text-emerald-400" /> : <Phone size={12} className="text-red-400" />}
                    <span className="truncate">{copiedPhone === hosp.id ? "Copied!" : (hosp.phone || "N/A")}</span>
                 </button>
                 <a 
                    href={`mailto:${hosp.email}`}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    <Mail size={12} className="text-red-400" />
                    <span className="truncate">{hosp.email || "N/A"}</span>
                 </a>
               </div>
               
               <div className="mt-4 pt-4 border-t border-white/5">
                 {selectedHospital === hosp.id ? (
                   <div className="grid grid-cols-2 gap-2">
                     {hosp.availableSlots.map(slot => (
                       <button key={slot} onClick={() => onBook(hosp, slot, need)} className="px-2 py-1 bg-red-900/40 text-red-200 text-xs rounded hover:bg-red-600 border border-red-500/20">{slot}</button>
                     ))}
                   </div>
                 ) : (
                   <button onClick={() => setSelectedHospital(hosp.id)} className="w-full py-2 bg-white/5 hover:bg-red-600 text-white text-sm rounded-lg transition-colors">Book Visit</button>
                 )}
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
