# CalmSpace
> Your personal sanctuary for mental wellness and growth.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React Version](https://img.shields.io/badge/react-^19-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-^5-blue.svg)
![Status](https://img.shields.io/badge/status-in--development-green.svg)

CalmSpace is a comprehensive web application designed to provide empathetic and confidential mental wellness support. It combines an AI-powered companion with a suite of tools to help users navigate stress, understand their emotions, and access support whenever they need it, with a strong emphasis on privacy and user security.

---

## Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
  - [Frontend](#frontend)
  - [Core Concepts](#core-concepts)
- [⚙️ Getting Started](#️-getting-started)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [💡 Future Scope](#-future-scope)
- [🙏 Acknowledgements](#-acknowledgements)

---

## ✨ Key Features

### Core Wellness Tools
-   **🤖 AI Companion:** Engage in supportive, confidential conversations with an AI powered by a simulation of Google's Gemini model. The companion uses a mock Retrieval-Augmented Generation (RAG) system to provide context-aware responses based on the app's own resources.
-   **📓 Secure Encrypted Journal:** A private, PIN-protected digital journal that uses the Web Crypto API for client-side AES-GCM encryption. Track your mood, write down your thoughts, and visualize your emotional trends over time with an integrated mood chart.
-   **📚 Curated Resources:** Access a library of helpful articles, videos, guided audio, and interactive tools like a "Box Breathing" exercise and a stress assessment quiz.

### Community & Professional Support
-   **🤝 Supportive Community:** Connect with peers in anonymous, topic-based forums. Share experiences and offer support on subjects like academic stress, relationships, and mental health in a safe environment.
-   **🧑‍⚕️ Professional Directory:** Browse a directory of verified mental health professionals. Filter by specialty, view detailed profiles with user reviews, and use the integrated booking system to schedule appointments.
-   **🚨 Crisis Support:** A prominent and easily accessible section with quick links to emergency helplines for users in immediate distress.

### User Experience & Privacy
-   **🔒 Privacy First:** Your privacy is paramount. The journal is encrypted on your device *before* being saved to local storage, ensuring that only you can access your entries.
-   **🌓 Light & Dark Modes:** A sleek, modern UI that respects user system preferences for light or dark themes.
-   **📱 Fully Responsive:** A seamless experience across all devices, from desktops to mobile phones.

---

## 🛠️ Tech Stack & Architecture

This project is built as a self-contained, frontend-only application. All backend functionalities are simulated through mock services, allowing for a fully interactive experience without a live server or database.

### Frontend
-   **Framework:** [React](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Charts:** [Recharts](https://recharts.org/)
-   **Icons:** [Font Awesome](https://fontawesome.com/)

### Core Concepts
-   **Real Supabase Integration:** Authentication and data storage are powered by Supabase, providing real user accounts, secure data persistence, and scalable database functionality.
-   **Client-Side Encryption:** The Journal feature uses the **Web Crypto API** to perform AES-GCM encryption directly in the browser. The user's PIN is used to derive an encryption key that never leaves their device, ensuring maximum privacy.
-   **Google OAuth Authentication:** Users can sign in with their Google accounts through Supabase Auth, providing a seamless and secure authentication experience.
-   **Simulated RAG (Retrieval-Augmented Generation):** The `geminiService` simulates a RAG pipeline. When a user sends a message, the service can be extended to first "retrieve" relevant information from other mock services (like `resourceService` or `communityService`) and then "augment" the prompt before generating a more contextually relevant response.

---

## ⚙️ Getting Started

This application is designed to run in a specific web-based development environment that handles dependencies and serving automatically. No local installation is required.

**Prerequisites:**
-   A modern web browser (Chrome, Firefox, Safari, Edge).

**Running the Application:**
1.  Ensure all project files are loaded into the development environment.
2.  The environment will automatically serve the `index.html` file and compile the TypeScript/React code.
3.  The application should be visible in the preview window.

---

## 📂 Project Structure

The project follows a feature-oriented structure, making it easy to navigate and maintain.

```
/
├── components/         # Reusable React components for each feature
│   ├── ChatWindow.tsx      # Core AI companion UI
│   ├── JournalPage.tsx     # Encrypted journal and mood tracking
│   ├── ResourcesPage.tsx   # Library of articles, tools, etc.
│   ├── CommunityPage.tsx   # Anonymous user forums
│   └── ...                 # Other UI components
│
├── services/           # Backend services and integrations
│   ├── supabaseAuthService.ts  # Real Supabase authentication with Google OAuth
│   ├── geminiService.ts    # Mocks the Gemini AI API and RAG pipeline
│   ├── cryptoService.ts    # Handles client-side encryption logic
│   └── ...                 # Other data services
│
├── App.tsx             # Main application component, handles routing and layout
├── types.ts            # Centralized TypeScript type definitions
├── index.html          # HTML entry point for the application
├── index.tsx           # React application root
├── .env                # Environment variables for Supabase
├── .env.example        # Example environment variables
├── supabase-setup.sql  # Database schema for Supabase
└── README.md           # You are here!
```

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or improvements, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/your-feature-name`
3.  **Make your changes** and commit them with a clear message.
4.  **Push to your branch:** `git push origin feature/your-feature-name`
5.  **Open a Pull Request** and describe the changes you've made.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## 💡 Future Scope

-   **Live Gemini API:** Integrate the live Google Gemini API to provide real-time, dynamic AI conversations.
-   **Push Notifications:** Implement web push notifications for journal reminders and community updates.
-   **Advanced AI Insights:** Leverage AI to provide personalized insights based on journal entry sentiment analysis (while respecting user privacy).
-   **Real Database Integration:** Replace remaining mock services with real database operations using the Supabase schema we've created.
-   **Enhanced Community Features:** Add real-time chat, user profiles, and advanced moderation features.

---

## 🙏 Acknowledgements
-   **Avatars:** User avatars are generated using the wonderful [DiceBear API](https://www.dicebear.com/).
-   **Images:** Background and resource images are from [Unsplash](https://unsplash.com/).
