
export enum AppView {
  SEARCH = 'SEARCH',
  HOSPITALS = 'HOSPITALS',
  THERAPY = 'THERAPY',
  LABS = 'LABS',
  DONATE = 'DONATE',
  SCAN = 'SCAN',
  DIAGNOSIS = 'DIAGNOSIS',
  APPOINTMENTS = 'APPOINTMENTS',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN'
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  gender: string;
  bio: string;
  imageUrl: string;
  availableSlots: string[];
  website?: string; // URL for external booking
  mapUrl?: string; // Google Maps Directions
  phone?: string;
  email?: string;
}

export interface Appointment {
  id: string;
  doctorId: string; // Or Lab ID
  doctorName: string; // Or Lab Name
  doctorSpecialty: string; // Or Test Type
  date: string; // ISO date string
  timeSlot: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  symptoms: string;
  type: 'DOCTOR' | 'LAB' | 'DONATION' | 'HOSPITAL' | 'THERAPY';
  bookingUrl?: string;
}

export interface UserSettings {
  username: string;
  age: string;
  gender: string;
  apiKey: string; 
  notificationsEnabled: boolean;
  onboardingComplete: boolean;
  bloodGroup?: string;
  isAdmin?: boolean; // Persist admin session
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

// Legacy types to prevent errors if referenced
export enum PetMood { HAPPY='HAPPY', SAD='SAD', FOCUSING='FOCUSING', SLEEPING='SLEEPING' }
export interface PetState { name: string; health: number; level: number; mood: PetMood; }
export interface FocusSession { date: string; durationMinutes: number; completed: boolean; distractions?: string; }
export interface BlockItem { id: string; url: string; category: string; }
