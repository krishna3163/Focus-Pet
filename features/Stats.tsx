import React, { useEffect, useState } from 'react';
import { FocusSession } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis, CartesianGrid } from 'recharts';
import { getDailySummary } from '../services/ai';
import { Sparkles, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

interface StatsProps {
  sessions: FocusSession[];
  apiKey: string;
}

export const Stats: React.FC<StatsProps> = ({ sessions, apiKey }) => {
  const [summary, setSummary] = useState("Analyzing your day...");

  useEffect(() => {
    getDailySummary(apiKey, sessions).then(setSummary);
  }, [sessions, apiKey]);

  // Data prep
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const barData = last7Days.map(date => {
    const daySessions = sessions.filter(s => s.date.startsWith(date) && s.completed);
    return {
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0)
    };
  });

  const totalTimeMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalTimeMinutes / 60).toFixed(1);
  const totalSessions = sessions.length;
  // Calculate average distractions per session (mocking distraction count storage if not fully implemented)
  const avgDistractions = totalSessions > 0 
    ? (sessions.reduce((acc, s) => acc + (s.distractions || 0), 0) / totalSessions).toFixed(1)
    : "0";

  return (
    <div className="w-full space-y-8 pb-12">
      <h2 className="text-3xl font-bold text-white">Your Progress</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#2D2B3B] flex items-center justify-center text-violet-400">
                <Clock size={24} />
            </div>
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Focus Hours</p>
                <p className="text-3xl font-bold text-white mt-1">{totalHours}</p>
            </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#2D2B3B] flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={24} />
            </div>
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Sessions Completed</p>
                <p className="text-3xl font-bold text-white mt-1">{totalSessions}</p>
            </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#2D2B3B] flex items-center justify-center text-rose-400">
                <AlertOctagon size={24} />
            </div>
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg Distractions</p>
                <p className="text-3xl font-bold text-white mt-1">{avgDistractions}</p>
            </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-card p-8 h-96">
        <h3 className="font-bold text-gray-300 mb-8">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2B3B" vertical={false} />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6B7280' }} 
                dy={10} 
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6B7280' }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#1E1B2E', color: 'white' }}
              itemStyle={{ color: '#A78BFA' }}
            />
            <Bar dataKey="minutes" radius={[4, 4, 4, 4]} barSize={40}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? '#8B5CF6' : '#2D2B3B'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insight */}
      <div className="glass-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all"></div>
        <div className="flex items-start space-x-4 relative z-10">
            <div className="p-3 bg-violet-500/20 rounded-xl text-violet-300">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">AI Coach Insight</h3>
              <p className="text-gray-400 mt-2 leading-relaxed text-sm">{summary}</p>
            </div>
        </div>
      </div>
    </div>
  );
};