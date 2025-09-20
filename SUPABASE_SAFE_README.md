# CalmSpace Supabase Database Setup - Safe Version

This is the **safe version** of the database setup that uses `CREATE IF NOT EXISTS` and `CREATE POLICY IF NOT EXISTS` to prevent errors if you run the script multiple times.

## 🚀 Quick Start

1. **Open your Supabase dashboard**
2. **Go to SQL Editor**
3. **Copy the contents of `supabase-setup-safe.sql`**
4. **Run the script**

## ✅ What This Script Does

### **Safe Operations (Won't Error on Re-runs)**
- ✅ `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
- ✅ `CREATE TYPE IF NOT EXISTS ...`
- ✅ `CREATE TABLE IF NOT EXISTS ...`
- ✅ `CREATE INDEX IF NOT EXISTS ...`
- ✅ `CREATE POLICY IF NOT EXISTS ...`
- ✅ `CREATE TRIGGER IF NOT EXISTS ...`

### **Tables Created**
1. **`user_profiles`** - Extended user information
2. **`journal_entries`** - Personal journal entries with mood tracking
3. **`community_posts`** - Community discussions
4. **`comments`** - Comments on posts
5. **`resources`** - Mental health resources
6. **`quiz_results`** - Quiz scores and responses
7. **`breathing_sessions`** - Track breathing exercises

### **Security Features**
- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Proper access policies** for data protection
- ✅ **Automatic user profile creation** when users sign up

### **Performance Features**
- ✅ **Indexes** on frequently queried columns
- ✅ **Automatic timestamp updates**
- ✅ **UUID primary keys** for all tables

## 🔄 Re-running the Script

You can run this script multiple times safely:
- **First run:** Creates everything
- **Subsequent runs:** Skips existing objects, no errors

## 📊 Sample Data Included

The script includes 4 sample mental health resources:
- Understanding Anxiety (article)
- Guided Meditation for Sleep (audio)
- Breathing Exercises for Stress Relief (exercise)
- Depression Support Resources (article)

## 🛠️ Individual Queries

If you prefer to run individual parts, here are the key queries:

### **1. Enable Extension**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### **2. Create Types**
```sql
CREATE TYPE IF NOT EXISTS mood_level AS ENUM ('very_low', 'low', 'neutral', 'good', 'excellent');
CREATE TYPE IF NOT EXISTS journal_entry_type AS ENUM ('text', 'voice', 'mixed');
CREATE TYPE IF NOT EXISTS post_type AS ENUM ('discussion', 'resource_share', 'question', 'support');
```

### **3. Create Tables**
```sql
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- (Repeat for other tables...)
```

### **4. Enable RLS**
```sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
-- (Repeat for all tables...)
```

### **5. Create Policies**
```sql
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);
-- (Repeat for all policies...)
```

## 🔍 Verification Queries

After running the script, verify everything was created:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check sample data
SELECT * FROM resources WHERE is_approved = true;
```

## ⚠️ Important Notes

- **Run in Supabase SQL Editor** (not regular PostgreSQL)
- **Script is idempotent** - safe to run multiple times
- **Maintains existing data** - won't delete anything
- **Updates policies** - uses `CREATE OR REPLACE` for functions

## 🎯 Next Steps

1. ✅ **Run the safe SQL script**
2. ✅ **Test authentication** in your app
3. ✅ **Verify database tables** in Supabase dashboard
4. ✅ **Start building services** to use the database

Your CalmSpace database is now ready! 🚀
