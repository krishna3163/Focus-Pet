
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { diagnosePatient, DiagnosisResult } from '../services/ai';
import { Stethoscope, Activity, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiagnosisProps {
  settings: UserSettings;
}

export const Diagnosis: React.FC<DiagnosisProps> = ({ settings }) => {
  const [description, setDescription] = useState('');
  const [results, setResults] = useState<DiagnosisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const quickStarts = [
    "Female, 42, severe headaches for 3 months, dizziness, family history of migraines.",
    "Male, 30, persistent dry cough, fatigue, night sweats for 2 weeks.",
    "Child, 8, high fever, rash on torso, sore throat, started yesterday."
  ];

  const handleAnalyze = async () => {
    if (!settings.apiKey) return setError("Please add your API Key in Settings.");
    if (!description.trim()) return setError("Please enter patient details.");

    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const diagnosis = await diagnosePatient(settings.apiKey, description);
      if (diagnosis.length === 0) {
        setError("Could not determine diagnosis. Please try more details.");
      } else {
        setResults(diagnosis);
      }
    } catch (e) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-2xl mb-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
           <span className="text-3xl font-black bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Kk</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          KkGPT
        </h1>
        <p className="text-gray-400">AI-Powered Diagnostic Assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Input Section */}
        <div className="space-y-6">
           <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
              <label className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 block flex items-center gap-2">
                 <Activity size={16} /> Patient Description
              </label>
              
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type patient details here (Age, Gender, Symptoms, Onset)..."
                className="w-full h-40 bg-[#0B1120] border border-gray-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
              />

              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2 font-semibold">Quick start:</p>
                <div className="flex flex-wrap gap-2">
                  {quickStarts.map((qs, i) => (
                    <button 
                      key={i}
                      onClick={() => setDescription(qs)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors text-left truncate max-w-full"
                    >
                      "{qs.substring(0, 40)}..."
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Analyze Symptoms <Sparkles size={18} className="group-hover:text-yellow-300 transition-colors" />
                  </>
                )}
              </button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center flex items-center justify-center gap-2">
                   <AlertTriangle size={16} /> {error}
                </div>
              )}
           </div>

           <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
              <p className="text-xs text-amber-200/70 leading-relaxed">
                <span className="font-bold text-amber-500">Disclaimer:</span> KkGPT is an AI tool for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always verify results with a qualified healthcare provider.
              </p>
           </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
           {!isLoading && results.length === 0 && !error && (
             <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] border-dashed border-2 border-gray-700">
                <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                   <Stethoscope size={40} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-300">Ready to Analyze</h3>
                <p className="text-gray-500 mt-2 max-w-xs">Enter patient details to generate a differential diagnosis.</p>
             </div>
           )}

           <AnimatePresence>
             {results.map((res, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="glass-card p-5 border-l-4 border-indigo-500"
               >
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-lg font-bold text-white">{res.condition}</h3>
                     <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                        res.likelihood === 'High' ? 'bg-red-500/20 text-red-400' :
                        res.likelihood === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-emerald-500/20 text-emerald-400'
                     }`}>
                        {res.likelihood} Probability
                     </span>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                     <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Reasoning</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{res.reasoning}</p>
                     </div>
                     <div className="bg-[#0B1120] p-3 rounded-lg border border-gray-700/50">
                        <p className="text-xs font-semibold text-cyan-400 uppercase mb-1 flex items-center gap-1">
                           <ArrowRight size={12} /> Recommended Action
                        </p>
                        <p className="text-gray-400 text-xs italic">{res.recommendation}</p>
                     </div>
                  </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
