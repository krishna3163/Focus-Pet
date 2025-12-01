import React from 'react';
import { PetState, PetMood } from '../types';
import { Heart, Zap } from 'lucide-react';

interface PetDisplayProps {
  pet: PetState;
  message: string;
}

export const PetDisplay: React.FC<PetDisplayProps> = ({ pet, message }) => {
  
  // Simple visual representation using emojis/styles based on mood
  const getPetImage = () => {
    switch (pet.mood) {
      case PetMood.HAPPY: return "https://picsum.photos/id/1025/300/300"; // Pug
      case PetMood.SAD: return "https://picsum.photos/id/1025/300/300?grayscale"; // Sad Pug
      case PetMood.FOCUSING: return "https://picsum.photos/id/237/300/300"; // Black Dog
      case PetMood.SLEEPING: return "https://picsum.photos/id/169/300/300"; // Sleeping dog
      default: return "https://picsum.photos/id/1062/300/300"; // Dog wrapped in blanket
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto mb-8">
      {/* Speech Bubble */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-64 text-center z-10 animate-fade-in-up">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-indigo-50 relative">
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              "{message}"
            </p>
            <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-indigo-50 rotate-45"></div>
        </div>
      </div>

      {/* Pet Image Container */}
      <div className="relative group">
        <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
        <img 
          src={getPetImage()} 
          alt="Your Pet" 
          className="w-48 h-48 mx-auto rounded-full object-cover border-4 border-white shadow-2xl transition-transform duration-500 transform hover:scale-105"
        />
        
        {/* Status Indicators */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow-md border border-red-100">
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span className="text-xs font-bold text-gray-700">{Math.round(pet.health)}%</span>
          </div>
          <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow-md border border-yellow-100">
            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-700">Lvl {pet.level}</span>
          </div>
        </div>
      </div>
    </div>
  );
};