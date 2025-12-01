
import { UserSettings, Appointment } from '../types';

const STORAGE_KEY = 'docbook_data_v2';

export interface AppData {
  settings: UserSettings;
  appointments: Appointment[];
}

export const defaultSettings: UserSettings = {
  username: '',
  age: '',
  gender: 'Not Specified',
  apiKey: '',
  notificationsEnabled: false,
  onboardingComplete: false,
  isAdmin: false
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
      // Merge with defaultSettings to ensure new fields (like onboardingComplete, isAdmin) exist
      return {
        settings: { ...defaultSettings, ...data.settings },
        appointments: Array.isArray(data.appointments) ? data.appointments : [],
      };
    }
  } catch (e) {
    console.error("Failed to load data", e);
  }
  return {
    settings: defaultSettings,
    appointments: [],
  };
};

export const exportData = (data: AppData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `docbook-backup-${new Date().toISOString().split('T')[0]}.json`;
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
        if (data.settings && data.appointments) {
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
