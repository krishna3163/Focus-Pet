
import { UserSettings, FocusSession, PetState, ThemeType, PetType, PetMood } from '../types';

const STORAGE_KEY = 'bubble_focus_data_v3';

export interface AppData {
  settings: UserSettings;
  sessions: FocusSession[];
  pet: PetState;
}

export const defaultSettings: UserSettings = {
  theme: ThemeType.BUBBLE,
  petType: PetType.CAT,
  dailyGoalMinutes: 120,
  strictMode: false,
  blocklist: ['instagram.com', 'tiktok.com', 'facebook.com', 'twitter.com', 'reddit.com'],
  soundEnabled: true,
  apiKey: '',
  notificationsEnabled: false,
  focusStartHour: '09:00',
  focusEndHour: '17:00',
  dailyScreenTimeLimit: 240, // 4 hours
  username: 'Friend'
};

export const defaultPet: PetState = {
  name: 'Mochi',
  level: 1,
  xp: 0,
  health: 100,
  happiness: 100,
  mood: PetMood.HAPPY
};

export const saveAppData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

export const loadAppData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        settings: { ...defaultSettings, ...data.settings },
        sessions: Array.isArray(data.sessions) ? data.sessions : [],
        pet: { ...defaultPet, ...data.pet }
      };
    }
  } catch (e) {
    console.error("Failed to load data", e);
  }
  return {
    settings: defaultSettings,
    sessions: [],
    pet: defaultPet
  };
};

export const exportData = (data: AppData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bubble-focus-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = async (file: File): Promise<AppData | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        if (data.settings && data.sessions && data.pet) {
          resolve(data as AppData);
        } else {
          reject(new Error("Invalid file format"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
