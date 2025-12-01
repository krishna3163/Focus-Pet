<div align="center">

# 🌸 Focus Pet - Productivity Meets Virtual Companionship

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**A beautiful productivity app that combines the Pomodoro technique with an adorable virtual pet that grows and thrives as you focus.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📸 Preview

> 🎨 **Beautiful UI with anime-inspired design** featuring smooth animations, glassmorphism effects, and a calming dark theme with vibrant gradients
>
> ### 🎨 Visual Showcase

#### Main Focus Timer Interface
- **Pomodoro Timer**: Beautiful circular timer display (25:00 default)
- **Multiple Modes**: Focus, Short Break, Long Break buttons
- **Pet Companion**: Adorable virtual pet display that reacts to your focus
- **Start Button**: Large, easy-to-tap play button for starting sessions
- **Dark Theme**: Easy on the eyes with purple gradient accents

#### Statistics & Analytics Dashboard  
- **Weekly Activity Chart**: Visual representation of your focus patterns
- **Progress Tracking**: Total focus hours, sessions completed, distractions tracked
- **Daily Breakdown**: See which days you focused the most
- **Trends**: AI-powered insights about your productivity habits

#### Settings & Customization
- **Appearance & Vibe**: Theme packs (Bubbly default theme)
- **Pet Companion Selection**: Choose from Cat, Dog, Robot, Blob characters
- **Personalization**: Set your name and customize timer durations
- **Google API Integration**: AI chat feature for smart insights

> 📸 **Live App Preview**: Visit the deployed application to see the full interactive experience!

---

## ✨ Features

### 🎯 Smart Pomodoro Timer
- **Multiple Timer Modes**: Pomodoro (25 min), Short Break (5 min), Long Break (15 min), and Custom modes
- **Distraction Tracking**: Monitor when you get distracted during focus sessions
- **Session History**: Keep track of all your focus sessions with detailed analytics
- **AI-Powered Insights**: Get personalized productivity analysis powered by Gemini API

### 🐾 Virtual Pet System
- **Pet Evolution**: Choose from multiple pet types and watch them grow as you focus
- **Dynamic Stats**: Track your pet's Happiness, Health, Experience, and Level
- **Rewards System**: Earn XP from completed focus sessions to level up your pet
- **Pet Customization**: Select different pet characters that match your personality

### 📊 Advanced Analytics
- **Focus Statistics**: Visual charts showing your focus patterns and productivity trends
- **Weekly/Monthly Views**: Analyze your productivity over different time periods
- **Session Breakdown**: Detailed breakdown of completed, abandoned, and distracted sessions
- **Progress Tracking**: Watch your growth journey with beautiful data visualizations

### 🛡️ Distraction Shield
- **Website Blocklist**: Block distracting websites during focus sessions
- **Custom Blocklist Management**: Easily add, remove, or organize blocked sites
- **Strict Mode**: Extra penalties for distractions when you need maximum focus

### ⚙️ Customization & Settings
- **Theme Options**: Light and Dark themes with beautiful gradients
- **Audio Settings**: Toggle notifications and sound cues
- **Data Management**: Import/Export your data for backup and sync
- **User Preferences**: Customize username, pet type, and timer settings

### 🎨 Beautiful UI/UX
- **Glassmorphism Design**: Modern, frosted glass effect components
- **Smooth Animations**: Framer Motion animations for delightful interactions
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Anime Aesthetics**: Sakura petals, floating elements, and gradient backgrounds
- **Dark Theme**: Easy on the eyes for long focus sessions

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/krishna3163/Focus-Pet.git
cd Focus-Pet
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your free Gemini API key from [Google AI Studio](https://ai.studio/)

4. **Run the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
Focus-Pet/
├── components/           # Reusable UI components
│   ├── Navigation.tsx    # Main navigation sidebar
│   ├── PetDisplay.tsx    # Pet animation and display
│   ├── FocusTimer.tsx    # Timer component
│   └── BlocklistManager.tsx
├── features/             # Feature modules
│   ├── Timer/            # Pomodoro timer logic
│   ├── Pet/              # Pet behavior and animations
│   ├── Stats/            # Analytics and statistics
│   └── Settings/         # Settings panel
├── services/             # Business logic
│   └── storage.ts        # Local storage management
├── types.ts              # TypeScript type definitions
├── App.tsx               # Main application component
├── index.tsx             # React entry point
└── package.json          # Dependencies and scripts
```

---

## 💻 Tech Stack

### Frontend Framework
- **React 18** - UI library for building interactive components
- **TypeScript** - Type-safe JavaScript for better developer experience

### Build & Development
- **Vite** - Lightning-fast build tool and dev server
- **npm** - Package manager

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions

### Features & APIs
- **Google Gemini API** - AI-powered productivity insights
- **Local Storage** - Browser storage for persistent data
- **Web Notifications API** - Browser notifications for timers

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking

---

## 🎮 How to Use

### Starting a Focus Session
1. Enter your name in settings
2. Choose your pet type
3. Select timer mode (Pomodoro, Short Break, etc.)
4. Click **Start Focus** button
5. Stay focused - your pet will grow! 🌱

### Viewing Stats
- Click the **📊 Stats** button in the navigation
- See your focus patterns and productivity trends
- Get AI insights about your productivity

### Managing Blocklist
- Go to **🛡️ Shield** in navigation
- Add websites you find distracting
- They'll be blocked during focus sessions

### Customizing Your Experience
- Click **⚙️ Settings** to:
  - Change your username
  - Switch pet characters
  - Toggle notifications
  - Import/Export your data
  - Adjust timer durations

---

## 📊 Data Storage

All your data is stored **locally in your browser** using the Web Storage API. Your data is completely private and never sent to any server (except Gemini API for analytics).

- **Focus Sessions**: All completed, incomplete, and distracted sessions
- **Pet Stats**: Current level, XP, happiness, and health
- **User Settings**: Preferences, pet type, theme, and blocklist

### Backup & Restore
- Export your data as JSON file: Settings → Export Data
- Restore from backup: Settings → Import Data

---

## 🎯 Future Features

- [ ] Multi-device sync
- [ ] Social features (share progress with friends)
- [ ] Leaderboards
- [ ] Pet breeding system
- [ ] Custom pet creation
- [ ] Real distraction blocking (browser extension)
- [ ] Mobile app (React Native)
- [ ] Collaborative focus sessions
- [ ] Achievement badges
- [ ] Advanced habit tracking

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Use TypeScript for type safety
- Add comments for complex logic
- Test your changes before submitting PR

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- Inspired by the Pomodoro Technique
- Google Gemini API for AI features
- React and Vite communities
- Framer Motion for animations
- Tailwind CSS for beautiful styling

---

## 📧 Contact & Support

Have questions or suggestions? Reach out!
- **GitHub Issues**: [Report bugs or request features](https://github.com/krishna3163/Focus-Pet/issues)
- **GitHub Discussions**: [Join the community](https://github.com/krishna3163/Focus-Pet/discussions)

---

<div align="center">

### Made with ❤️ by [Krishna](https://github.com/krishna3163)

⭐ If you find this project helpful, consider giving it a star!

</div>
