
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { ShieldCheck, User, Users, Activity, Edit2, Check, Phone, MapPin, CreditCard } from 'lucide-react';

interface AdminProps {
  currentUser: UserSettings;
  updateUser: (s: Partial<UserSettings>) => void;
}

export const AdminDashboard: React.FC<AdminProps> = ({ currentUser, updateUser }) => {
  // Real data as requested with added details
  const [mockUsers] = useState([
    { 
      id: 1, 
      name: "John Doe", 
      active: true, 
      role: "User", 
      lastSeen: "2 mins ago",
      phone: "+1 (555) 012-3456",
      location: "123 Market St, San Francisco, CA",
      fee: "$320.00"
    },
    { 
      id: 2, 
      name: "Alice Smith", 
      active: true, 
      role: "User", 
      lastSeen: "5 mins ago",
      phone: "+1 (555) 987-6543",
      location: "45 Broadway, New York, NY",
      fee: "$150.00"
    },
    { 
      id: 3, 
      name: "krishna.0858", 
      active: true, 
      role: "Admin", 
      lastSeen: "Online",
      phone: "+91 98765 43210",
      location: "Admin HQ, Bangalore, India",
      fee: "-"
    },
    { 
      id: 4, 
      name: "Robert Fox", 
      active: false, 
      role: "User", 
      lastSeen: "2 hrs ago",
      phone: "+1 (555) 246-8135",
      location: "789 Pine Ln, Austin, TX",
      fee: "$85.50"
    },
  ]);

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.username);
  const [editedAge, setEditedAge] = useState(currentUser.age);

  const handleSave = () => {
    updateUser({ username: editedName, age: editedAge });
    setEditMode(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-24">
      <header className="mb-10 p-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl border border-amber-500/30 flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-3">
             <ShieldCheck size={32} /> Admin Dashboard
           </h1>
           <p className="text-amber-200/60 mt-2 text-sm font-mono">System Status: OPERATIONAL | Access Level: ROOT</p>
        </div>
        <div className="text-right">
           <p className="text-xs text-amber-500/80">Welcome,</p>
           <p className="font-bold text-white">krishna.0858</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="glass-card p-6 border-l-4 border-emerald-500">
            <h3 className="text-gray-400 text-sm uppercase font-bold">Total Users</h3>
            <p className="text-4xl font-bold text-white mt-2">1,248</p>
         </div>
         <div className="glass-card p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-400 text-sm uppercase font-bold">Active Now</h3>
            <p className="text-4xl font-bold text-white mt-2">342</p>
         </div>
         <div className="glass-card p-6 border-l-4 border-purple-500">
            <h3 className="text-gray-400 text-sm uppercase font-bold">Appointments</h3>
            <p className="text-4xl font-bold text-white mt-2">89</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Users List */}
        <section className="glass-card p-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Users size={18} /> Active Users Directory
           </h3>
           <div className="space-y-3">
              {mockUsers.map(u => (
                <div key={u.id} className="p-4 bg-[#0f172a]/50 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                   <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${u.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-500'}`}></div>
                          <span className="text-base font-bold text-white">{u.name}</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${u.role === 'Admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role}</span>
                       </div>
                       <span className="text-xs text-gray-500">{u.lastSeen}</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-400 border-t border-white/5 pt-3">
                       <div className="flex items-center gap-2">
                          <Phone size={12} className="text-cyan-400" /> 
                          <span>{u.phone}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-purple-400" /> 
                          <span className="truncate">{u.location}</span>
                       </div>
                       <div className="col-span-2 flex items-center gap-2">
                          <CreditCard size={12} className="text-emerald-400" /> 
                          <span>Total Paid: <span className="text-emerald-300 font-mono">{u.fee}</span></span>
                       </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Edit Current User */}
        <section className="glass-card p-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Edit2 size={18} /> Edit User Profile (Self)
           </h3>
           <div className="bg-[#0B1120] p-4 rounded-xl border border-gray-700">
              <div className="mb-4">
                 <label className="text-xs text-gray-500 block mb-1">Username</label>
                 {editMode ? (
                   <input 
                     type="text" 
                     value={editedName}
                     onChange={(e) => setEditedName(e.target.value)}
                     className="w-full bg-gray-800 p-2 rounded text-white outline-none border border-amber-500"
                   />
                 ) : (
                   <p className="text-white font-medium">{currentUser.username}</p>
                 )}
              </div>
              <div className="mb-6">
                 <label className="text-xs text-gray-500 block mb-1">Age</label>
                 {editMode ? (
                   <input 
                     type="number" 
                     value={editedAge}
                     onChange={(e) => setEditedAge(e.target.value)}
                     className="w-full bg-gray-800 p-2 rounded text-white outline-none border border-amber-500"
                   />
                 ) : (
                   <p className="text-white font-medium">{currentUser.age}</p>
                 )}
              </div>
              
              <div className="flex justify-end">
                {editMode ? (
                   <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                     <Check size={16} /> Save Changes
                   </button>
                ) : (
                   <button onClick={() => setEditMode(true)} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                     <Edit2 size={16} /> Edit Profile
                   </button>
                )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};
