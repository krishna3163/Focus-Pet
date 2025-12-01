
import React, { useState } from 'react';
import { Search, MapPin, Activity, User, Star, CalendarCheck, Phone, Mail, Check } from 'lucide-react';
import { Doctor, UserSettings } from '../types';
import { findDoctors } from '../services/ai';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchProps {
  settings: UserSettings;
  onBook: (doc: Doctor, slot: string, symptoms: string) => void;
}

export const DoctorSearch: React.FC<SearchProps> = ({ settings, onBook }) => {
  const [symptoms, setSymptoms] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("Any");
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!settings.apiKey) {
      setError("Please enter your Google API Key in Settings first.");
      return;
    }
    if (!symptoms || !location) {
      setError("Please describe your symptoms and location.");
      return;
    }

    setIsLoading(true);
    setError("");
    setDoctors([]);

    try {
      const results = await findDoctors(settings.apiKey, symptoms, location, gender);
      if (results.length === 0) setError("No doctors found. Try different keywords.");
      setDoctors(results);
    } catch (e) {
      setError("Failed to fetch doctors. Check API key.");
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
      {/* Search Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Find the Right Doctor
        </h1>
        <p className="text-gray-400">AI-powered matching to find the best specialists near you.</p>
      </div>

      {/* Search Form */}
      <div className="glass-card p-6 md:p-8 mb-10 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <Activity size={14} /> Symptoms / Disease
            </label>
            <input 
              type="text" 
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Migraine, Fever, Skin rash"
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={14} /> Location
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, NY"
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <User size={14} /> Doctor Gender
            </label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[#0B1120] border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all"
            >
              <option value="Any">Any Preference</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <Search size={20} /> Search Specialists
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {doctors.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-5 hover:border-cyan-500/50 group"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-800 overflow-hidden shrink-0 border border-gray-700">
                  <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${doc.name}&clothing=blazerAndShirt`} alt="Doc" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{doc.name}</h3>
                  <p className="text-cyan-400 text-sm font-medium">{doc.specialty}</p>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                    <Star size={12} fill="currentColor" /> {doc.rating}
                  </div>
                  <p className="text-gray-400 text-xs mt-2 line-clamp-2">{doc.bio}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => copyToClipboard(doc.phone, doc.id)}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors group/btn"
                 >
                    {copiedPhone === doc.id ? <Check size={12} className="text-emerald-400" /> : <Phone size={12} className="text-cyan-400" />}
                    <span className="truncate">{copiedPhone === doc.id ? "Copied!" : (doc.phone || "N/A")}</span>
                 </button>
                 <a 
                    href={`mailto:${doc.email}`}
                    className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 transition-colors"
                 >
                    <Mail size={12} className="text-cyan-400" />
                    <span className="truncate">{doc.email || "N/A"}</span>
                 </a>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5">
                <a 
                   href={doc.mapUrl} 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center gap-2 text-gray-400 text-xs mb-3 hover:text-cyan-400 transition-colors"
                >
                  <MapPin size={12} /> {doc.location} (Get Directions)
                </a>
                
                {selectedDoc === doc.id ? (
                  <div className="space-y-2 animate-fade-in-up">
                    <p className="text-xs text-white font-semibold mb-2">Select a time:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {doc.availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => {
                            onBook(doc, slot, symptoms);
                            setSelectedDoc(null);
                          }}
                          className="px-2 py-1.5 bg-cyan-900/30 text-cyan-200 text-xs rounded hover:bg-cyan-600 hover:text-white transition-colors border border-cyan-500/20"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSelectedDoc(null)}
                      className="text-xs text-gray-500 underline w-full text-center mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setSelectedDoc(doc.id)}
                    className="w-full py-2 bg-white/5 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors border border-white/10"
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
