import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FocusSession } from '../types';

interface StatsDashboardProps {
  sessions: FocusSession[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ sessions }) => {
  // Process data for the chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const data = last7Days.map(date => {
    const daySessions = sessions.filter(s => s.date.startsWith(date) && s.completed);
    const totalMinutes = daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: totalMinutes
    };
  });

  const totalFocusTime = sessions.reduce((acc, curr) => acc + (curr.completed ? curr.durationMinutes : 0), 0);
  const totalSessions = sessions.length;

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
        <p className="text-gray-500 text-sm">Track your focus consistency</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Focus</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{totalFocusTime}<span className="text-sm text-gray-400 font-normal ml-1">min</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Sessions</p>
            <p className="text-3xl font-bold text-emerald-500 mt-1">{totalSessions}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-80">
        <h3 className="text-sm font-semibold text-gray-700 mb-6">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
            />
            <YAxis 
                hide={true} 
            />
            <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
            />
            <Bar dataKey="minutes" radius={[6, 6, 6, 6]} barSize={32}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? '#6366f1' : '#e2e8f0'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};