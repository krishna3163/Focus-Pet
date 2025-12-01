import React from 'react';
import { Timer, BarChart2, Settings, Zap, Shield } from 'lucide-react';
import { AppView, PetState, PetType } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  pet: PetState;
  petType: PetType;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, pet, petType }) => {
  const navItems = [
    { id: AppView.FOCUS, icon: Timer, label: 'Focus' },
    { id: AppView.STATS, icon: BarChart2, label: 'Stats' },
    { id: AppView.BLOCKLIST, icon: Shield, label: 'Block' },
    { id: AppView.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  const getPetEmoji = () => {
    switch(petType) {
      case PetType.CAT: return '🐱';
      case PetType.DOG: return '🐶';
      case PetType.ROBOT: return '🤖';
      case PetType.BLOB: return '🟣';
      default: return '🐣';
    }
  };

  // Shared Nav Item Logic
  const NavItem = ({ item, isMobile }: { item: typeof navItems[0], isMobile?: boolean }) => {
    const isActive = currentView === item.id;
    return (
      <button
        onClick={() => setView(item.id)}
        className={`group relative flex items-center justify-center transition-all duration-300 ${
          isMobile 
            ? 'flex-col gap-1 w-full p-2' 
            : 'w-full aspect-square rounded-2xl hover:bg-white/5'
        } ${isActive ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <div className={`relative ${isActive && isMobile ? '-translate-y-1' : ''} transition-transform`}>
           <item.icon size={isMobile ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} />
           {isActive && !isMobile && (
             <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-500 rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
           )}
        </div>
        
        {isMobile && (
          <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            {item.label}
          </span>
        )}

        {/* Desktop Tooltip */}
        {!isMobile && (
          <div className="absolute left-16 px-3 py-1 bg-[#1E1B2E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-xl z-50 backdrop-blur-md">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-24 bg-[#0f0c15]/80 backdrop-blur-xl flex-col items-center py-8 z-50 border-r border-white/5">
        <div className="mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-900/30">
            <Zap className="text-white fill-white" size={24} />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 w-full px-4">
          {navItems.map((item) => <NavItem key={item.id} item={item} />)}
        </div>

        <div className="mt-auto mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center cursor-pointer hover:border-violet-500/50 transition-colors relative group">
             <span className="text-2xl filter drop-shadow-lg">{getPetEmoji()}</span>
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f0c15]"></div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM BAR (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-[#1a1725]/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-2 z-50 shadow-2xl">
        {navItems.map((item) => <NavItem key={item.id} item={item} isMobile={true} />)}
        
        {/* Mobile Profile Indicator */}
        <div className="absolute -top-3 right-4">
           <div className="w-8 h-8 rounded-full bg-[#1a1725] border border-white/10 flex items-center justify-center">
             <span className="text-sm">{getPetEmoji()}</span>
           </div>
        </div>
      </div>
    </>
  );
};