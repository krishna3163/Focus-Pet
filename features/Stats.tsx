
import React from 'react';
import { Appointment } from '../types';
import { CalendarCheck, MapPin, Clock, User, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentsProps {
  appointments: Appointment[];
  cancelAppointment: (id: string) => void;
}

export const AppointmentsList: React.FC<AppointmentsProps> = ({ appointments, cancelAppointment }) => {
  return (
    <div className="w-full max-w-3xl mx-auto pb-24">
      <h2 className="text-3xl font-bold text-white mb-8">My Appointments</h2>

      {appointments.length === 0 ? (
        <div className="glass-card p-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-500">
            <CalendarCheck size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-300">No Upcoming Visits</h3>
          <p className="text-gray-500 mt-2">Use the search to find a doctor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {appointments.map((apt) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-cyan-500"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/30">
                     <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{apt.doctorName}</h3>
                    <p className="text-cyan-400 text-sm">{apt.doctorSpecialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                       <span className="flex items-center gap-1"><CalendarCheck size={12}/> {apt.timeSlot}</span>
                       <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> Tracked</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end gap-2">
                   <div className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                      Reason: {apt.symptoms}
                   </div>
                   <div className="flex gap-3 mt-2">
                      <button 
                        onClick={() => cancelAppointment(apt.id)}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Remove
                      </button>
                      {apt.bookingUrl && (
                        <a 
                          href={apt.bookingUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          Visit Website <ExternalLink size={10} />
                        </a>
                      )}
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
