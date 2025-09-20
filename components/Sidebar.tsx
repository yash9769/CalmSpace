import React from 'react';
import { Page, User } from '../types';

interface NavItemProps {
  icon: string;
  label: Page;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center justify-center md:justify-start w-full p-3 my-1 rounded-lg transition-colors duration-200 ${active ? 'bg-purple-600/20 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
    aria-current={active ? 'page' : undefined}
  >
    <i className={`fas ${icon} w-6 text-center text-xl`}></i>
    <span className="hidden md:inline ml-4 font-medium">{label}</span>
  </button>
);

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  user: User | null;
  onSignOut: () => void;
}

const navItems: { icon: string; label: Page }[] = [
    { icon: "fa-comment-dots", label: "Companion" },
    { icon: "fa-book-open", label: "Journal" },
    { icon: "fa-compass", label: "Resources" },
    { icon: "fa-users", label: "Community" },
    { icon: "fa-user-doctor", label: "Professionals" },
    { icon: "fa-cog", label: "Settings" }
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, user, onSignOut }) => {
  return (
    <aside className="h-full w-16 md:w-64 p-2 md:p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border-r border-white/20 dark:border-gray-700/50 flex flex-col items-center">
      <div className="flex items-center justify-center h-16 w-full mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-green-400 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <h1 className="hidden md:inline ml-3 text-2xl font-bold text-gray-800 dark:text-gray-100">CalmSpace</h1>
      </div>

      <nav className="w-full">
        {navItems.map((item) => (
           <NavItem 
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activePage === item.label}
            onClick={() => setActivePage(item.label)}
           />
        ))}
      </nav>

      <div className="mt-auto w-full pt-4 border-t border-white/20 dark:border-gray-700/50">
         {user ? (
          <div className="flex items-center justify-center md:justify-start p-2">
            <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
            <div className="hidden md:flex flex-col ml-3 overflow-hidden">
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{user.displayName}</span>
              <button onClick={onSignOut} className="text-xs text-red-500 hover:underline text-left">Sign Out</button>
            </div>
          </div>
        ) : (
           <button 
            onClick={() => setActivePage('Journal')} 
            className="flex items-center justify-center md:justify-start w-full p-3 my-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
            >
              <i className="fas fa-sign-in-alt w-6 text-center text-xl"></i>
              <span className="hidden md:inline ml-4 font-medium">Sign In to Journal</span>
            </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;