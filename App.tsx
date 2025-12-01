
import React, { useState, useEffect } from 'react';
import { AppView, UserSettings, Appointment, Doctor } from './types';
import { loadAppData, saveAppData, defaultSettings } from './services/storage';
import { Navigation } from './components/Navigation';
import { DoctorSearch } from './features/Timer'; 
import { AppointmentsList } from './features/Stats';
import { SettingsPanel } from './features/Settings';
import { Onboarding } from './features/Onboarding';
import { LabSearch } from './features/LabSearch';
import { DonationHub } from './features/Donation';
import { CertificateScanner } from './features/CertificateScanner';
import { MedicalChat } from './features/MedicalChat';
import { HospitalSearch } from './features/HospitalSearch';
import { TherapySearch } from './features/TherapySearch';
import { AdminDashboard } from './features/AdminDashboard';
import { Diagnosis } from './features/Diagnosis';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState<AppView>(AppView.SEARCH);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const data = loadAppData();
    setSettings(data.settings);
    setAppointments(data.appointments);
    
    // Check if admin was previously logged in
    if (data.settings.isAdmin) {
      setIsAdmin(true);
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveAppData({ settings, appointments });
  }, [settings, appointments, isLoaded]);

  const handleBooking = (doc: Doctor, slot: string, symptoms: string) => {
    const newApt: Appointment = {
      id: Date.now().toString(),
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      date: new Date().toISOString(),
      timeSlot: slot,
      status: 'UPCOMING',
      symptoms: symptoms,
      type: 'DOCTOR', // This could be improved to pass type dynamically
      bookingUrl: doc.website || 'https://google.com'
    };
    setAppointments([...appointments, newApt]);
    
    alert(`Appointment tracked! Redirecting you to ${doc.name}'s booking page to complete the process.`);
    if (doc.website) {
      window.open(doc.website, '_blank');
    } else {
      window.open(`https://www.google.com/search?q=${doc.name}+booking`, '_blank');
    }

    setView(AppView.APPOINTMENTS);
  };

  const cancelAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    // Persist admin session so they don't have to login via chat next time
    setSettings(prev => ({ ...prev, isAdmin: true }));
    setView(AppView.ADMIN);
    setIsChatOpen(false); // Auto close chat to show dashboard
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-cyan-400 animate-pulse">Loading DocBook...</div>;

  if (!settings.onboardingComplete) {
    return <Onboarding onComplete={(newSettings) => setSettings({ ...settings, ...newSettings })} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col md:flex-row overflow-hidden relative font-sans">
      
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] animate-float-slow pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px] animate-float-medium pointer-events-none z-0"></div>

      <Navigation 
        currentView={view} 
        setView={setView} 
        user={settings}
        toggleChat={() => setIsChatOpen(!isChatOpen)} 
        isAdmin={isAdmin}
      />

      <main className="flex-1 w-full h-screen overflow-y-auto z-10 
        px-4 pb-24 pt-6 
        md:px-8 md:pb-8 md:pt-8 md:ml-24 scroll-smooth">
        
        <AnimatePresence mode="wait">
          {view === AppView.SEARCH && (
            <motion.div key="search" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto">
              <DoctorSearch settings={settings} onBook={handleBooking} />
            </motion.div>
          )}

          {view === AppView.DIAGNOSIS && (
            <motion.div key="diagnosis" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
              <Diagnosis settings={settings} />
            </motion.div>
          )}

          {view === AppView.HOSPITALS && (
             <motion.div key="hospitals" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
               <HospitalSearch settings={settings} onBook={(doc, slot, sym) => handleBooking(doc, slot, sym)} />
             </motion.div>
          )}

          {view === AppView.THERAPY && (
             <motion.div key="therapy" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
               <TherapySearch settings={settings} onBook={(doc, slot, sym) => handleBooking(doc, slot, sym)} />
             </motion.div>
          )}

          {view === AppView.LABS && (
            <motion.div key="labs" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
              <LabSearch settings={settings} onBook={(doc, slot, sym) => handleBooking(doc, slot, sym)} />
            </motion.div>
          )}

          {view === AppView.DONATE && (
            <motion.div key="donate" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
              <DonationHub settings={settings} />
            </motion.div>
          )}

          {view === AppView.SCAN && (
             <motion.div key="scan" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
               <CertificateScanner settings={settings} />
             </motion.div>
          )}

          {view === AppView.APPOINTMENTS && (
            <motion.div key="appointments" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }} className="max-w-5xl mx-auto pt-4">
              <AppointmentsList appointments={appointments} cancelAppointment={cancelAppointment} />
            </motion.div>
          )}

          {view === AppView.SETTINGS && (
             <motion.div key="settings" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto pt-4">
                <SettingsPanel settings={settings} updateSettings={(s) => setSettings({...settings, ...s})} fullData={{ settings, appointments }} />
             </motion.div>
          )}

          {view === AppView.ADMIN && isAdmin && (
              <motion.div key="admin" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
                <AdminDashboard currentUser={settings} updateUser={(s) => setSettings({...settings, ...s})} />
              </motion.div>
          )}
        </AnimatePresence>

        <MedicalChat 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          settings={settings} 
          onAdminLogin={handleAdminLogin}
        />

      </main>
    </div>
  );
};

export default App;
