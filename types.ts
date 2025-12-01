
export enum AppView {
  FOCUS = 'FOCUS',
  STATS = 'STATS',
  SETTINGS = 'SETTINGS',
  BLOCKLIST = 'BLOCKLIST'
}

export enum ThemeType {
  BUBBLE = 'BUBBLE',
  MINIMAL = 'MINIMAL',
  DARK = 'DARK',
  FOREST = 'FOREST',
  OCEAN = 'OCEAN'
}

export enum TimerMode {
  POMODORO = 'POMODORO',
  STOPWATCH = 'STOPWATCH',
  COUNTDOWN = 'COUNTDOWN'
}

export enum PetType {
  DOG = 'DOG',
  CAT = 'CAT',
  ROBOT = 'ROBOT',
  PLANT = 'PLANT',
  BLOB = 'BLOB'
}

export enum PetMood {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  FOCUSING = 'FOCUSING',
  SLEEPING = 'SLEEPING',
  NEUTRAL = 'NEUTRAL'
}

export interface BlockItem {
  id: string;
  url: string;
  category: string;
}

export interface FocusSession {
  id: string;
  date: string;
  durationMinutes: number;
  mode: TimerMode;
  completed: boolean;
  distractions: number;
}

export interface UserSettings {
  theme: ThemeType;
  petType: PetType;
  dailyGoalMinutes: number;
  strictMode: boolean; // Focus Lock
  blocklist: string[];
  soundEnabled: boolean;
  apiKey: string; 
  notificationsEnabled: boolean;
  focusStartHour: string; // "09:00"
  focusEndHour: string; // "17:00"
  dailyScreenTimeLimit: number; // Minutes
  username: string;
}

export interface PetState {
  name: string;
  level: number;
  xp: number;
  health: number; // 0-100
  happiness: number; // 0-100
  mood: PetMood;
}
