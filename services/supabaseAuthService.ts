import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

interface AuthState {
  currentUser: User | null;
  isPickerOpen: boolean;
  pickerUsers: User[];
}

// http://localhost:5175/auth/callback
// http://localhost:5174/auth/callback
// http://localhost:5173/auth/callback
// http://localhost:3000/auth/callback

class SupabaseAuthService {
  private state: AuthState = {
    currentUser: null,
    isPickerOpen: false,
    pickerUsers: [],
  };

  private listeners: ((state: AuthState) => void)[] = [];
  private signInPromise: { resolve: (user: User) => void, reject: (reason?: any) => void } | null = null;

  constructor() {
    // Check for existing session on initialization
    this.initializeAuth();

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.handleUserSignIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.handleUserSignOut();
      }
    });
  }

  private async initializeAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        this.handleUserSignIn(session.user);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  private handleUserSignIn(supabaseUser: SupabaseUser) {
    const user: User = {
      id: supabaseUser.id,
      displayName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      photoURL: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${supabaseUser.email}`,
    };

    this.state.currentUser = user;
    this.notifyListeners();
  }

  private handleUserSignOut() {
    this.state.currentUser = null;
    this.notifyListeners();
  }

  signIn = async (): Promise<User> => {
    if (this.signInPromise) {
      this.state.isPickerOpen = true;
      this.notifyListeners();
      return new Promise((resolve, reject) => {
        if (this.signInPromise) {
          this.signInPromise.resolve = resolve;
          this.signInPromise.reject = reject;
        }
      });
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${supabaseUrl}/auth/v1/callback`
        }
      });

      if (error) throw error;

      return new Promise((resolve, reject) => {
        this.signInPromise = { resolve, reject };
        this.state.isPickerOpen = true;
        this.notifyListeners();
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  selectAccount = (user: User) => {
    // This method is kept for compatibility with the existing UI
    // In Supabase OAuth flow, account selection happens on Google's side
    if (this.signInPromise) {
      this.signInPromise.resolve(user);
      this.signInPromise = null;
    }
    this.state.isPickerOpen = false;
    this.notifyListeners();
  };

  cancelSignIn = () => {
    if (this.signInPromise) {
      this.signInPromise.reject('User cancelled sign in.');
      this.signInPromise = null;
    }
    this.state.isPickerOpen = false;
    this.notifyListeners();
  };

  signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      this.state.currentUser = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  onStateChange = (callback: (state: AuthState) => void): (() => void) => {
    this.listeners.push(callback);
    // Immediately notify the new listener with the current state
    callback(this.state);

    // Return an unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  };

  private notifyListeners = () => {
    this.listeners.forEach(listener => listener(this.state));
  };

  // Additional Supabase-specific methods
  getSupabaseClient = () => supabase;
}

export const authService = new SupabaseAuthService();
