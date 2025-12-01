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
            <Shield className="text-rose-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Distraction Blocker</h2>
        </div>
        <p className="text-gray-500 text-sm mt-1">
            If you leave the focus timer to visit these kinds of sites, your pet will lose health.
        </p>
      </header>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center mb-6">
        <input
            type="text"
            placeholder="e.g., instagram.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBlockItem()}
            className="flex-1 p-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />
        <button 
            onClick={addBlockItem}
            className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
            <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {blocklist.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p>No distractions added yet.</p>
                <p className="text-xs mt-1">You're safe... for now.</p>
            </div>
        )}
        {blocklist.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                    <span className="font-medium text-gray-700">{item.url}</span>
                </div>
                <button 
                    onClick={() => removeBlockItem(item.id)}
                    className="text-gray-400 hover:text-rose-500 transition-colors p-2"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};