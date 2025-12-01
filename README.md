# AI Medical Assistant

## Overview

**AI Medical Assistant** is a comprehensive healthcare management platform powered by AI and Gemini technology. It provides an intelligent solution for doctor appointment booking, medical consultations, hospital searches, laboratory services, therapy bookings, and much more.

This application is built with modern web technologies (Vite, React, TypeScript) and features an intuitive interface with AI-powered chat support for enhanced user experience.

## Features

- **Doctor Search & Appointments**: Find and book appointments with healthcare professionals
- **Hospital Locator**: Search and locate hospitals in your area
- **Laboratory Services**: Discover and book lab tests and services
- **Therapy Services**: Find therapists and schedule therapy sessions
- **Medical Diagnosis**: AI-powered diagnosis assistant
- **Health Certificate Scanner**: Scan and manage health certificates
- **Donation Hub**: Contribute to health-related causes
- **Medical Chat**: AI-powered medical chatbot for health queries
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Appointment Management**: Track and manage all your appointments
- **User Settings**: Customize your experience and preferences

## Technology Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **API**: Google Gemini AI
- **State Management**: React Hooks
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Storage**: Local Storage with service layer

## Project Structure

```
.
├── components/        # Reusable UI components
├── features/          # Feature modules
│   ├── AdminDashboard
│   ├── AppointmentsList
│   ├── CertificateScanner
│   ├── Diagnosis
│   ├── DoctorSearch (Timer)
│   ├── DonationHub
│   ├── HospitalSearch
│   ├── LabSearch
│   ├── MedicalChat
│   ├── Settings
│   ├── TherapySearch
│   └── Other features
├── services/          # Business logic and API integration
├── App.tsx            # Main application component
├── index.tsx          # Entry point
├── manifest.json      # Chrome extension manifest
├── metadata.json      # App metadata
└── README.md          # This file
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishna3163/AI-Medical-Assistant.git
   cd AI-Medical-Assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Getting Started

1. **First Launch**: Complete the onboarding process
2. **Search for Doctors**: Use the search feature to find doctors by specialty
3. **Book Appointments**: Select a doctor and book your appointment
4. **Track Appointments**: View all your appointments in the Appointments section
5. **Chat Support**: Use the AI chat for medical guidance and support

## Key Components

### Navigation
Easy navigation between different features like Doctor Search, Hospitals, Labs, Therapy, and more.

### Medical Chat
Powered by Google Gemini, provides intelligent responses to health-related queries.

### Admin Dashboard
Secure admin access to manage platform data and user information.

### Appointment Management
Track, manage, and organize all your medical appointments in one place.

## Configuration

### Metadata (metadata.json)

The app metadata includes:
- **name**: AI Medical Assistant
- **description**: Smart doctor appointment booking system powered by AI search
- **requestFramePermissions**: Configuration for permissions

### Manifest (manifest.json)

Defines the Chrome extension properties, permissions, and actions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, questions, or feedback, please open an issue on the GitHub repository.

## Author

**Krishna Sharma** - [@krishna3163](https://github.com/krishna3163)

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- UI animations with [Framer Motion](https://www.framer.com/motion/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
