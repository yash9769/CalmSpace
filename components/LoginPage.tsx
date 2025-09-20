import React from 'react';
import { authService } from '../services/supabaseAuthService';

const LoginPage: React.FC = () => {
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await authService.signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
      // In a real app, show an error message to the user
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-green-400 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-book-open text-white text-2xl"></i>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Access Your Journal</h1>
      <p className="max-w-md text-gray-600 dark:text-gray-400 mb-8">
        Please sign in to securely save and access your journal entries. Your thoughts are private and safe with us.
      </p>
      <button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60"
      >
        {isSigningIn ? (
          <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
        )}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </span>
      </button>
    </div>
  );
};

export default LoginPage;
