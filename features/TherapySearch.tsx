
import React, { useState } from 'react';
import { Search, MapPin, BrainCircuit, Star, Flower, Phone, Mail, Check } from 'lucide-react';
import { Doctor, UserSettings } from '../types';
import { findTherapists } from '../services/ai';
import { motion, AnimatePresence } from 'framer-motion';

interface TherapySearchProps {
  settings: UserSettings;
  onBook: (doc: Doctor, slot: string, symptoms: string) => void;
}

export const TherapySearch: React.FC<TherapySearchProps> = ({ settings, onBook }) => {
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [therapists, setTherapists] = useState<Doctor[]>([]);
  const [error, setError] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!settings.apiKey) return setError("API Key missing.");
    if (!issue || !location) return setError("Please enter details.");

    setIsLoading(true);
    setTherapists([]);
    setError("");

    try {
      const results = await findTherapists(settings.apiKey, issue, location);
      setTherapists(results);
      if (results.length === 0) setError("No therapists found.");
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
          <Flower size={36} className="text-pink-400" /> Therapy & Counseling
        </h1>
        <p className="text-gray-400">Mental health support and professional counseling from top experts.</p>
      </div>

      <div className="glass-card p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-purple-400 uppercase mb-2 block">What's on your mind?</label>
            <input 
              type="text" value={issue} onChange={e => setIssue(e.target.value)}
              placeholder="e.g. Anxiety, Depression, Relationship issues"
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-purple-400 uppercase mb-2 block">Location</label>
            <input 
              type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Remote, San Francisco"
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
            />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? <span className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></span> : <><Search size={20}/> Find Best Therapists</>}
        </button>
        {error && <p className="text-red-400 text-center mt-2 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {therapists.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-5 border-purple-500/20 hover:border-purple-500/50"
            >
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{doc.name}</h3>
                    <p className="text-purple-400 text-sm">{doc.specialty}</p>
                    <a href={doc.mapUrl} target="_blank" rel="noreferrer" className="text-gray-400 text-xs mt-1 flex items-center gap-1 hover:text-purple-400"><MapPin size={12}/> {doc.location}</a>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs bg-yellow-400/10 px-2 py-1 rounded">
                     <Star size={12} fill="currentColor"/> {doc.rating}
                  </div>
               </div>
               <p className="text-gray-400 text-sm mt-3">{doc.bio}</p>

                {/* Contact Info */}
               <div className="mt-3 grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => copyToClipboard(doc.phone, doc.id)}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    {copiedPhone === doc.id ? <Check size={12} className="text-emerald-400" /> : <Phone size={12} className="text-purple-400" />}
                    <span className="truncate">{copiedPhone === doc.id ? "Copied!" : (doc.phone || "N/A")}</span>
                 </button>
                 <a 
                    href={`mailto:${doc.email}`}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    <Mail size={12} className="text-purple-400" />
                    <span className="truncate">{doc.email || "N/A"}</span>
                 </a>
               </div>
               
               <div className="mt-4 pt-4 border-t border-white/5">
                 {selectedTherapist === doc.id ? (
                   <div className="grid grid-cols-2 gap-2">
                     {doc.availableSlots.map(slot => (
                       <button key={slot} onClick={() => onBook(doc, slot, issue)} className="px-2 py-1 bg-purple-900/40 text-purple-200 text-xs rounded hover:bg-purple-600 border border-purple-500/20">{slot}</button>
                     ))}
                   </div>
                 ) : (
                   <button onClick={() => setSelectedTherapist(doc.id)} className="w-full py-2 bg-white/5 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors">Book Session</button>
                 )}
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
