
import React, { useState, useRef } from 'react';
import { FileScan, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserSettings } from '../types';
import { analyzeCertificate } from '../services/ai';

interface ScannerProps {
  settings: UserSettings;
}

export const CertificateScanner: React.FC<ScannerProps> = ({ settings }) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        // Strip prefix for API
        const base64Data = base64.split(',')[1]; 
        setImage(base64Data);
        analyze(base64Data);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const analyze = async (base64: string) => {
    setIsAnalyzing(true);
    setResult('');
    try {
      const text = await analyzeCertificate(settings.apiKey, base64);
      setResult(text);
    } catch (e) {
      setResult("Error scanning document.");
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Smart Scanner
        </h1>
        <p className="text-gray-400">Verify medical certificates and reports using AI.</p>
      </div>

      <div className="glass-card p-8 text-center border-dashed border-2 border-indigo-500/30">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        
        {!image ? (
          <div className="py-12 flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-400">
              <Upload size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">Upload Certificate</h3>
            <p className="text-gray-500 mt-2">Click to select an image</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-full h-48 bg-gray-900 rounded-xl overflow-hidden relative">
               <img src={`data:image/png;base64,${image}`} className="w-full h-full object-contain opacity-50" alt="Preview"/>
               <div className="absolute inset-0 flex items-center justify-center">
                 {isAnalyzing && (
                   <div className="flex flex-col items-center animate-pulse">
                     <FileScan size={48} className="text-indigo-400 mb-2" />
                     <span className="text-indigo-300 font-bold">Analyzing...</span>
                   </div>
                 )}
               </div>
            </div>
            
            {!isAnalyzing && result && (
              <div className="text-left bg-indigo-950/30 p-6 rounded-xl border border-indigo-500/30">
                <h3 className="text-lg font-bold text-indigo-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Analysis Result
                </h3>
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{result}</p>
                <button 
                  onClick={() => { setImage(null); setResult(''); }}
                  className="mt-4 text-sm text-indigo-400 hover:text-white underline"
                >
                  Scan Another
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
