// User and Auth related types
export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export type Page = 'Companion' | 'Journal' | 'Resources' | 'Community' | 'Professionals' | 'Settings';

// Chat related types
export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: string;
}

// Journal related types
export type Mood = 'Ecstatic' | 'Happy' | 'Neutral' | 'Sad' | 'Anxious';

export interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  content: string;
  tags: string[];
  status: 'complete' | 'draft';
}

// Crypto/Security related types
export interface EncryptedPayload {
  iv: string;
  cipherText: string;
}

// Resources and Quiz related types
export interface Resource {
    id: string;
    title: string;
    description: string;
    link?: string;
    type: 'Article' | 'Video' | 'Hotline' | 'Website' | 'Audio' | 'Infographic' | 'PDF';
    duration?: string;
    imageUrl?: string;
}

export interface ResourceCategory {
    category: string;
    description: string;
    resources: Resource[];
}

export interface ResourceCompletion {
    resourceId: string;
    completedAt: string;
}

export interface ToastNotification {
    id: number;
    message: string;
    icon: string;
}

export interface QuizOption {
  text: string;
  score: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

// Community related types
export type CommunityTopic = "Academic Stress" | "Friendships & Relationships" | "Anxiety & Mental Health" | "Daily Motivation";

export interface Author {
  id: string;
  displayName: string;
  photoURL: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  author: Author | null;
  content: string;
  createdAt: string;
  supports: string[]; // array of user IDs
}

export interface CommunityPost {
  id: string;
  topic: CommunityTopic;
  title: string;
  content: string;
  author: Author | null; // null for anonymous
  createdAt: string;
  supports: string[]; // array of user IDs
  comments: CommunityComment[];
}


// Professionals related types
export interface Review {
  id: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  location: string;
  photoUrl: string;
  description: string;
  verified: boolean;
  rating: number; // Average rating
  reviewCount: number;
  reviews: Review[];
  sessionTypes: ('Video Call' | 'Chat Session' | 'In-person')[];
  availability: { [date: string]: string[] }; // e.g., { '2024-07-29': ['09:00', '10:00'] }
}