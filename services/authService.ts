import { User } from '../types';

// This is a mocked service to simulate Google Authentication.
// It persists the user session in localStorage and simulates an account picker UI.

const MOCK_USER_KEY = 'mockCalmSpaceUser';

const mockUsers: User[] = [
  {
    id: 'mock_user_12345',
    displayName: 'Alex Doe',
    email: 'alex.doe@example.com',
    photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=Alex%20Doe`,
  },
  {
    id: 'mock_user_67890',
    displayName: 'Priya Singh',
    email: 'priya.singh@example.com',
    photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=Priya%20Singh`,
  },
  {
    id: 'mock_user_abcde',
    displayName: 'Sam Chen',
    email: 'sam.chen@example.com',
    photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=Sam%20Chen`,
  },
];


interface AuthState {
    currentUser: User | null;
    isPickerOpen: boolean;
    pickerUsers: User[];
}

class MockAuthService {
  private state: AuthState = {
    currentUser: null,
    isPickerOpen: false,
    pickerUsers: [],
  };
  
  private listeners: ((state: AuthState) => void)[] = [];
  private signInPromise: { resolve: (user: User) => void, reject: (reason?: any) => void } | null = null;

  constructor() {
    try {
      const savedUser = localStorage.getItem(MOCK_USER_KEY);
      if (savedUser) {
        this.state.currentUser = JSON.parse(savedUser);
      }
    } catch (error)
      {
      console.error("Failed to load user from localStorage", error);
      this.state.currentUser = null;
    }
  }

  signIn = async (): Promise<User> => {
    if (this.signInPromise) {
      this.state.isPickerOpen = true;
      this.notifyListeners();
      // A promise is already in flight, re-use its resolvers
      return new Promise((resolve, reject) => {
        if(this.signInPromise) {
          this.signInPromise.resolve = resolve;
          this.signInPromise.reject = reject;
        }
      });
    }
    
    return new Promise((resolve, reject) => {
        this.signInPromise = { resolve, reject };
        this.state.isPickerOpen = true;
        this.state.pickerUsers = mockUsers;
        this.notifyListeners();
    });
  };
  
  selectAccount = (user: User) => {
    if (!this.signInPromise) return;

    this.state.currentUser = user;
    this.state.isPickerOpen = false;

    try {
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Failed to save user to localStorage", error);
    }
    
    this.signInPromise.resolve(user);
    this.signInPromise = null;
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
    await new Promise(resolve => setTimeout(resolve, 200));
    this.state.currentUser = null;
    try {
        localStorage.removeItem(MOCK_USER_KEY);
    } catch (error) {
        console.error("Failed to remove user from localStorage", error);
    }
    this.notifyListeners();
  };

  onStateChange = (callback: (state: AuthState) => void): (() => void) => {
      this.listeners.push(callback);
      // Immediately notify the new listener with the current state
      callback(this.state);

      // Return an unsubscribe function
      return () => {
          this.listeners = this.listeners.filter(l => l !== callback);
      };
  }

  private notifyListeners = () => {
    this.listeners.forEach(listener => listener(this.state));
  };
}

export const authService = new MockAuthService();