
import React, { useState } from 'react';
import { Search, MapPin, FlaskConical, Star, CalendarCheck, Phone, Mail, Check } from 'lucide-react';
import { Doctor, UserSettings } from '../types';
import { findLabs } from '../services/ai';
import { motion, AnimatePresence } from 'framer-motion';

interface LabSearchProps {
  settings: UserSettings;
  onBook: (doc: Doctor, slot: string, symptoms: string) => void;
}

export const LabSearch: React.FC<LabSearchProps> = ({ settings, onBook }) => {
  const [testType, setTestType] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [labs, setLabs] = useState<Doctor[]>([]);
  const [error, setError] = useState("");
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!settings.apiKey) return setError("API Key missing.");
    if (!testType || !location) return setError("Please enter test type and location.");

    setIsLoading(true);
    setLabs([]);
    setError("");

    try {
      const results = await findLabs(settings.apiKey, testType, location);
      setLabs(results);
      if (results.length === 0) setError("No labs found.");
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent mb-4">
          Book Medical Tests
        </h1>
        <p className="text-gray-400">Find top-rated diagnostic centers and labs near you.</p>
      </div>

      <div className="glass-card p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-teal-400 uppercase mb-2 block">Test Type</label>
            <input 
              type="text" value={testType} onChange={e => setTestType(e.target.value)}
              placeholder="e.g. Full Body Checkup, X-Ray, Blood Test"
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-teal-400 uppercase mb-2 block">Location</label>
            <input 
              type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Chicago, IL"
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
            />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full mt-6 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? <span className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></span> : <><Search size={20}/> Find Labs</>}
        </button>
        {error && <p className="text-red-400 text-center mt-2 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {labs.map((lab, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-5 border-teal-500/20 hover:border-teal-500/50"
            >
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{lab.name}</h3>
                    <p className="text-teal-400 text-sm">{lab.specialty}</p>
                    <a href={lab.mapUrl} target="_blank" rel="noreferrer" className="text-gray-400 text-xs mt-1 flex items-center gap-1 hover:text-teal-400"><MapPin size={12}/> {lab.location}</a>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs bg-yellow-400/10 px-2 py-1 rounded">
                     <Star size={12} fill="currentColor"/> {lab.rating}
                  </div>
               </div>
               <p className="text-gray-400 text-sm mt-3">{lab.bio}</p>
               
               {/* Contact Info */}
               <div className="mt-3 grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => copyToClipboard(lab.phone, lab.id)}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    {copiedPhone === lab.id ? <Check size={12} className="text-emerald-400" /> : <Phone size={12} className="text-teal-400" />}
                    <span className="truncate">{copiedPhone === lab.id ? "Copied!" : (lab.phone || "N/A")}</span>
                 </button>
                 <a 
                    href={`mailto:${lab.email}`}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    <Mail size={12} className="text-teal-400" />
                    <span className="truncate">{lab.email || "N/A"}</span>
                 </a>
               </div>

               <div className="mt-4 pt-4 border-t border-white/5">
                 {selectedLab === lab.id ? (
                   <div className="grid grid-cols-2 gap-2">
                     {lab.availableSlots.map(slot => (
                       <button key={slot} onClick={() => onBook(lab, slot, testType)} className="px-2 py-1 bg-teal-900/40 text-teal-200 text-xs rounded hover:bg-teal-600 border border-teal-500/20">{slot}</button>
                     ))}
                   </div>
                 ) : (
                   <button onClick={() => setSelectedLab(lab.id)} className="w-full py-2 bg-white/5 hover:bg-teal-600 text-white text-sm rounded-lg transition-colors">Book Appointment</button>
                 )}
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
