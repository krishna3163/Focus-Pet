
import React, { useState } from 'react';
import { BlockItem } from '../types';
import { Trash2, Plus, Shield } from 'lucide-react';

interface BlocklistManagerProps {
  blocklist: BlockItem[];
  setBlocklist: React.Dispatch<React.SetStateAction<BlockItem[]>>;
}

export const BlocklistManager: React.FC<BlocklistManagerProps> = ({ blocklist, setBlocklist }) => {
  const [newUrl, setNewUrl] = useState('');

  const addBlockItem = () => {
    if (!newUrl.trim()) return;
    const newItem: BlockItem = {
      id: Date.now().toString(),
      url: newUrl.trim().toLowerCase(),
      category: 'other'
    };
    setBlocklist([...blocklist, newItem]);
    setNewUrl('');
  };

  const removeBlockItem = (id: string) => {
    setBlocklist(blocklist.filter(item => item.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24">
      <header className="mb-6">
        <div className="flex items-center space-x-2">
            <Shield className="text-pink-500" size={24} />
            <h2 className="text-2xl font-bold text-white">Distraction Shield</h2>
        </div>
        <p className="text-pink-200/70 text-sm mt-1">
            Blocking these sites protects your character's HP. Don't let the dark forces win!
        </p>
      </header>

      <div className="bg-[#1a1725] p-2 rounded-2xl shadow-inner border border-white/10 flex items-center mb-6 focus-within:border-pink-500/50 transition-colors">
        <input
            type="text"
            placeholder="e.g., instagram.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBlockItem()}
            className="flex-1 p-3 outline-none text-white placeholder-gray-500 bg-transparent font-medium"
        />
        <button 
            onClick={addBlockItem}
            className="bg-pink-600 text-white p-3 rounded-xl hover:bg-pink-500 transition-colors shadow-lg"
        >
            <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {blocklist.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p>No distractions added yet.</p>
                <p className="text-xs mt-1">Your training grounds are clear.</p>
            </div>
        )}
        {blocklist.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-[#2D2B3B]/50 backdrop-blur-sm rounded-xl border border-white/5 hover:border-pink-500/30 transition-all">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                    <span className="font-medium text-gray-200">{item.url}</span>
                </div>
                <button 
                    onClick={() => removeBlockItem(item.id)}
                    className="text-gray-500 hover:text-rose-500 transition-colors p-2"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};
