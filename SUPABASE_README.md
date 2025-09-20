# CalmSpace Supabase Database Setup

This guide will help you set up the database schema for your CalmSpace mental wellness application.

## Prerequisites

1. A Supabase project (already created with your credentials)
2. Access to the Supabase SQL Editor

## Setup Instructions

### 1. Run the SQL Script

1. Open your Supabase project dashboard
2. Go to the **SQL Editor** tab
3. Create a new query
4. Copy and paste the contents of `supabase-setup.sql`
5. Click **Run** to execute the script

### 2. Verify Setup

After running the script, you should see:
- 6 new tables in your database
- Row Level Security (RLS) policies enabled
- Automatic triggers for user profiles and timestamps
- Sample resources data

## Database Schema

### Tables Created

1. **`user_profiles`** - Extended user information
   - Links to Supabase auth.users
   - Stores display name, bio, avatar

2. **`journal_entries`** - Personal journal entries
   - Private entries with mood tracking
   - Support for text, voice, and mixed entries
   - Tagging system

3. **`community_posts`** - Community discussion posts
   - Support for different post types
   - Anonymous posting option
   - Tagging system

4. **`comments`** - Comments on community posts
   - Threaded discussions
   - Anonymous commenting

5. **`resources`** - Mental health resources
   - Articles, videos, exercises
   - Categories and tags
   - Approval system for user submissions

6. **`quiz_results`** - Quiz scores and responses
   - Track mental health assessments
   - Store recommendations

7. **`breathing_sessions`** - Track breathing exercises
   - Monitor practice habits
   - Different exercise types

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Community posts are publicly readable
- Resources require approval before being visible

### Automatic Features

- User profiles are created automatically when users sign up
- Timestamps are updated automatically
- UUID primary keys for all tables

## Next Steps

1. **Update your services** to use these tables
2. **Test the authentication** flow
3. **Add more sample data** if needed
4. **Set up database backups** in Supabase

## Environment Variables

Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

If you encounter any issues:

1. Check the Supabase logs in the dashboard
2. Verify your user has the necessary permissions
3. Make sure all extensions are enabled
4. Check that RLS policies are working correctly

## Sample Queries

Here are some useful queries to test your setup:

```sql
-- View all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- View sample resources
SELECT * FROM resources WHERE is_approved = true;
