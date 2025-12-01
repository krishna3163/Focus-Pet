import React from 'react';
import { PetState, PetType } from '../types';
import { Heart, Zap, Sparkles, Smile } from 'lucide-react';

interface PetProps {
  pet: PetState;
  type: PetType;
  isActive: boolean;
}

export const Pet: React.FC<PetProps> = ({ pet, type, isActive }) => {
  
  const getImageUrl = () => {
    // Using simple seed logic to keep consistent pet appearance
    const seed = pet.name ? pet.name.replace(/\s/g, '') : 'mochi'; 
    
    // Switch to different sets for better "Anime" visuals
    // Set 4 in Robohash is Cats (Cute, illustrated)
    if (type === PetType.CAT) return `https://robohash.org/${seed}.png?set=set4&size=300x300`;
    
    // Set 1 in Robohash is Robots (Anime Mecha style)
    if (type === PetType.ROBOT) return `https://robohash.org/${seed}.png?set=set1&size=300x300`;
    
    // DiceBear Avatars for Dog/Blob but with "Anime" accessories if possible
    if (type === PetType.DOG) return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&top=hat&accessories=sunglasses`;
    if (type === PetType.BLOB) return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`;
    
    // Default fallback
    return `https://robohash.org/${seed}.png?set=set4&size=300x300`; 
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      
      {/* Decorative Glow - Anime Pink/Purple */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-pink-500/30 to-purple-600/30 rounded-full blur-[60px] transition-all duration-1000 ${isActive ? 'scale-125 opacity-60' : 'scale-100 opacity-30'}`}></div>

      {/* Pet Avatar Container */}
      <div className={`relative z-10 transition-all duration-700 ease-in-out ${isActive ? 'scale-110 translate-y-2' : 'scale-100 hover:scale-105'}`}>
        <div className="w-64 h-64 md:w-80 md:h-80 relative">
          <img 
            src={getImageUrl()} 
            alt="Pet" 
            className="w-full h-full drop-shadow-[0_10px_30px_rgba(236,72,153,0.3)] object-contain filter hover:brightness-110 transition-all"
          />
        </div>
        
        {/* Floating Particles if Active */}
        {isActive && (
          <>
            <Sparkles className="absolute -top-4 -right-4 text-pink-400 animate-bounce" size={28} />
            <Sparkles className="absolute bottom-8 -left-8 text-cyan-300 animate-pulse" size={24} />
            <div className="absolute top-0 left-0 text-2xl animate-pulse">✨</div>
          </>
        )}
      </div>

      {/* Stats - Anime Styled Pills */}
      <div className="mt-10 flex items-center gap-4">
        {/* Health */}
        <div className="flex flex-col items-center gap-1 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-[#2a2438]/80 border border-pink-500/30 flex items-center justify-center shadow-lg group-hover:border-pink-500/60 transition-colors backdrop-blur-md">
                <Heart size={22} className={`${pet.health < 50 ? 'text-rose-500 fill-rose-500' : 'text-pink-400 fill-pink-400/20'}`} />
            </div>
            <span className="text-[10px] font-bold text-pink-300/80 uppercase tracking-widest">HP {Math.round(pet.health)}%</span>
        </div>

        {/* Level */}
         <div className="flex flex-col items-center relative -top-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(251,146,60,0.4)] border-4 border-[#13111C]">
                <Zap size={32} className="text-white fill-white drop-shadow-md" />
            </div>
             <span className="mt-1 text-xs font-black text-yellow-400 uppercase tracking-widest drop-shadow-sm">LVL {pet.level}</span>
        </div>

        {/* Happiness */}
        <div className="flex flex-col items-center gap-1 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-[#2a2438]/80 border border-cyan-500/30 flex items-center justify-center shadow-lg group-hover:border-cyan-500/60 transition-colors backdrop-blur-md">
                <Smile size={22} className="text-cyan-400" />
            </div>
             <span className="text-[10px] font-bold text-cyan-300/80 uppercase tracking-widest">EXP {Math.round(pet.happiness)}%</span>
        </div>
      </div>
    </div>
  );
};