-- CalmSpace Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE mood_level AS ENUM ('very_low', 'low', 'neutral', 'good', 'excellent');
CREATE TYPE journal_entry_type AS ENUM ('text', 'voice', 'mixed');
CREATE TYPE post_type AS ENUM ('discussion', 'resource_share', 'question', 'support');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal entries table
CREATE TABLE public.journal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    entry_type journal_entry_type DEFAULT 'text',
    mood_before mood_level,
    mood_after mood_level,
    tags TEXT[] DEFAULT '{}',
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts table
CREATE TABLE public.community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    post_type post_type DEFAULT 'discussion',
    tags TEXT[] DEFAULT '{}',
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE public.resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content_url TEXT,
    resource_type TEXT NOT NULL, -- 'article', 'video', 'audio', 'exercise', 'app'
    category TEXT NOT NULL, -- 'anxiety', 'depression', 'mindfulness', 'sleep', 'general'
    tags TEXT[] DEFAULT '{}',
    is_approved BOOLEAN DEFAULT false,
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz results table
CREATE TABLE public.quiz_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quiz_type TEXT NOT NULL, -- 'anxiety', 'depression', 'stress', 'general_wellness'
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    responses JSONB DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Breathing exercises progress
CREATE TABLE public.breathing_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    exercise_type TEXT NOT NULL, -- 'box_breathing', '4_7_8', 'alternate_nostril'
    duration_seconds INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at);
CREATE INDEX idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_resources_approved ON public.resources(is_approved);
CREATE INDEX idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX idx_breathing_sessions_user_id ON public.breathing_sessions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breathing_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Journal entries: Users can only see their own entries, unless shared
CREATE POLICY "Users can view own journal entries" ON public.journal_entries
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal entries" ON public.journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON public.journal_entries
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal entries" ON public.journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Community posts: Anyone can view, only authors can edit
CREATE POLICY "Anyone can view community posts" ON public.community_posts
    FOR SELECT USING (true);
CREATE POLICY "Users can insert own posts" ON public.community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.community_posts
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Comments: Anyone can view, authenticated users can comment
CREATE POLICY "Anyone can view comments" ON public.comments
    FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments
    FOR DELETE USING (auth.uid() = user_id);

-- Resources: Anyone can view approved resources, users can submit
CREATE POLICY "Anyone can view approved resources" ON public.resources
    FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can submit resources" ON public.resources
    FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can update own submitted resources" ON public.resources
    FOR UPDATE USING (auth.uid() = submitted_by);

-- Quiz results: Users can only see their own results
CREATE POLICY "Users can view own quiz results" ON public.quiz_results
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON public.quiz_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Breathing sessions: Users can only see their own sessions
CREATE POLICY "Users can view own breathing sessions" ON public.breathing_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own breathing sessions" ON public.breathing_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_journal_entries_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_community_posts_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample resources
INSERT INTO public.resources (title, description, content_url, resource_type, category, tags, is_approved) VALUES
('Understanding Anxiety', 'A comprehensive guide to understanding anxiety and its symptoms', 'https://example.com/anxiety-guide', 'article', 'anxiety', ARRAY['anxiety', 'mental-health', 'education'], true),
('Guided Meditation for Sleep', 'A 20-minute guided meditation to help you fall asleep', 'https://example.com/sleep-meditation', 'audio', 'sleep', ARRAY['meditation', 'sleep', 'relaxation'], true),
('Breathing Exercises for Stress Relief', 'Simple breathing techniques to reduce stress and anxiety', 'https://example.com/breathing-exercises', 'exercise', 'general', ARRAY['breathing', 'stress-relief', 'mindfulness'], true),
('Depression Support Resources', 'A collection of resources and hotlines for depression support', 'https://example.com/depression-resources', 'article', 'depression', ARRAY['depression', 'support', 'resources'], true);
