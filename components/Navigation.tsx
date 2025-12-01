
import React from 'react';
import { Search, Calendar, Settings, LucideIcon, User, FlaskConical, HeartHandshake, FileScan, MessageCircle, Building2, BrainCircuit, ShieldCheck, Stethoscope } from 'lucide-react';
import { AppView, UserSettings } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: UserSettings;
  toggleChat: () => void;
  isAdmin: boolean;
}

interface NavItemProps {
  item: {
    id: AppView;
    icon: LucideIcon;
    label: string;
  };
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onClick, isMobile }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-center transition-all duration-300 ${
        isMobile 
          ? 'flex-col gap-1 w-full p-2' 
          : 'w-full aspect-square rounded-2xl hover:bg-white/5'
      } ${isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
    >
      <div className={`relative ${isActive && isMobile ? '-translate-y-1' : ''} transition-transform`}>
         <item.icon size={isMobile ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} />
         {isActive && !isMobile && (
           <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
         )}
      </div>
      
      {isMobile && (
        <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          {item.label}
        </span>
      )}

      {!isMobile && (
        <div className="absolute left-16 px-3 py-1 bg-[#1E293B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-cyan-500/20 shadow-xl z-50 backdrop-blur-md">
          {item.label}
        </div>
      )}
    </button>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, user, toggleChat, isAdmin }) => {
  const navItems = [
    { id: AppView.SEARCH, icon: Search, label: 'Doctors' },
    { id: AppView.DIAGNOSIS, icon: Stethoscope, label: 'KkGPT' },
    { id: AppView.HOSPITALS, icon: Building2, label: 'Hospitals' },
    { id: AppView.THERAPY, icon: BrainCircuit, label: 'Therapy' },
    { id: AppView.LABS, icon: FlaskConical, label: 'Tests' },
    { id: AppView.DONATE, icon: HeartHandshake, label: 'Donate' },
    { id: AppView.SCAN, icon: FileScan, label: 'Scan Cert' },
    { id: AppView.APPOINTMENTS, icon: Calendar, label: 'My Visits' },
    { id: AppView.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  if (isAdmin) {
    navItems.push({ id: AppView.ADMIN, icon: ShieldCheck, label: 'Admin' });
  }

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-24 bg-[#0f172a]/90 backdrop-blur-xl flex-col items-center py-8 z-50 border-r border-white/5">
        <div className="mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-xl font-bold text-white">Db</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 w-full px-4 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={currentView === item.id}
              onClick={() => setView(item.id)}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <button onClick={toggleChat} className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-colors shadow-lg shadow-indigo-500/30">
             <MessageCircle size={20} />
          </button>
          <div className="w-12 h-12 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center relative group cursor-help">
             <User size={20} className={isAdmin ? "text-amber-400" : "text-gray-400"} />
             {isAdmin && <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-[#0f172a]"></div>}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#1e293b]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-2 z-50 pb-2">
        {navItems.slice(0, 5).map((item) => (
          <NavItem 
            key={item.id} 
            item={item} 
            isActive={currentView === item.id}
            onClick={() => setView(item.id)}
            isMobile={true} 
          />
        ))}
      </div>
      
      {/* Mobile Chat Button */}
      <div className="md:hidden fixed bottom-24 right-4 z-50">
        <button onClick={toggleChat} className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-xl">
            <MessageCircle size={24} />
        </button>
      </div>
    </>
  );
};
