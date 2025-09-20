import React from 'react';
import { Page } from '../types';

interface LandingPageProps {
  onBegin: () => void;
  onNavigate: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onBegin, onNavigate }) => {
  return (
    <div
      className="relative h-screen w-screen flex flex-col text-white font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('/calm-water-surface-at-sunset-free-photo.webp')" }}
    >
      <header className="absolute z-20 top-0 left-0 right-0 p-6 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>CalmSpace</h1>
          <div className="flex items-center space-x-8 text-sm font-medium" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
            <button onClick={() => onNavigate('Companion')} className="hover:text-gray-200 transition-colors">Companion</button>
            <button onClick={() => onNavigate('Journal')} className="hover:text-gray-200 transition-colors">Journal</button>
            <button onClick={() => onNavigate('Resources')} className="hover:text-gray-200 transition-colors">Resources</button>
            <button onClick={() => onNavigate('Community')} className="hover:text-gray-200 transition-colors">Community</button>
            <button onClick={() => onNavigate('Professionals')} className="hover:text-gray-200 transition-colors">Professionals</button>
            <button onClick={() => onNavigate('Settings')} className="hover:text-gray-200 transition-colors">Settings</button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 
          className="text-5xl md:text-6xl font-light leading-tight tracking-wide mb-4 animate-fade-in-up"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        >
          "Your mental health matters, and you <br /> deserve to feel peace."
        </h2>
        <p 
          className="text-lg text-gray-200 mb-10 animate-fade-in-up" 
          style={{ animationDelay: '0.3s', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        >
          Welcome to your personal sanctuary for mental wellness and growth
        </p>
        <div className="flex space-x-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={onBegin}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Begin Your Journey
          </button>
          <button className="px-10 py-4 bg-white/20 backdrop-blur-sm rounded-full font-semibold hover:bg-white/30 transition-colors duration-300">
            Learn More
          </button>
        </div>
      </main>
       {/* FIX: Converted non-standard `styled-jsx` syntax to a standard <style> tag to resolve the TSX error. The `jsx` and `global` attributes are not valid in this React environment. */}
       <style>{`
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;