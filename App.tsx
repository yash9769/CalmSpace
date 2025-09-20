import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import JournalPage from './components/JournalPage';
import ResourcesPage from './components/ResourcesPage';
import CommunityPage from './components/CommunityPage';
import ProfessionalsPage from './components/ProfessionalsPage';
import LoginPage from './components/LoginPage';
import AccountPicker from './components/AccountPicker';
import LandingPage from './components/LandingPage'; // Import the new LandingPage
import { Page, User } from './types';
import { authService } from './services/authService';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-full text-center text-gray-500">
    <div className="p-8 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
        <p className="mt-2">This feature is coming soon!</p>
    </div>
  </div>
);


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Companion');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [accountPickerState, setAccountPickerState] = useState<{ isOpen: boolean; users: User[] }>({ isOpen: false, users: [] });
  const [showLandingPage, setShowLandingPage] = useState(!localStorage.getItem('hasVisitedCalmSpace'));

  useEffect(() => {
    const unsubscribe = authService.onStateChange(state => {
      setUser(state.currentUser);
      setAccountPickerState({
        isOpen: state.isPickerOpen,
        users: state.pickerUsers
      });
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleBeginJourney = () => {
    localStorage.setItem('hasVisitedCalmSpace', 'true');
    setShowLandingPage(false);
    setActivePage('Companion');
  };

  const handleNavigate = (page: Page) => {
    localStorage.setItem('hasVisitedCalmSpace', 'true');
    setShowLandingPage(false);
    setActivePage(page);
  };
  
  const handleSignOut = async () => {
    await authService.signOut();
    setActivePage('Companion'); // Navigate to a non-protected page
  };

  const renderPage = () => {
    // Pages requiring authentication
    if (['Journal', 'Community', 'Professionals'].includes(activePage)) {
      if (isAuthLoading) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        );
      }
      if (!user) {
        return <LoginPage />;
      }
    }

    switch (activePage) {
      case 'Companion':
        return <ChatWindow />;
      case 'Journal':
        // We know user is not null here due to the check above
        return <JournalPage user={user!} />;
      case 'Resources':
        return <ResourcesPage user={user} />;
      case 'Community':
        return <CommunityPage user={user!} />;
      case 'Professionals':
        return <ProfessionalsPage user={user!} />;
      case 'Settings':
        return <PlaceholderPage title="Settings" />;
      default:
        return <ChatWindow />;
    }
  };
  
  if (showLandingPage) {
    return <LandingPage onBegin={handleBeginJourney} onNavigate={handleNavigate} />;
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 dark:from-gray-900 dark:via-purple-900/50 dark:to-gray-800 flex overflow-hidden">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        user={user}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 p-4 md:p-6 h-full">
        {renderPage()}
      </main>
      {accountPickerState.isOpen && (
        <AccountPicker 
          users={accountPickerState.users}
          onSelect={authService.selectAccount}
          onCancel={authService.cancelSignIn}
        />
      )}
    </div>
  );
};

export default App;