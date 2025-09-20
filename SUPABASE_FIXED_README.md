# CalmSpace Supabase Database Setup - Fixed Version

This is the **fixed version** that resolves the PostgreSQL syntax error with `CREATE TYPE IF NOT EXISTS`.

## 🐛 The Problem

The error you encountered:
```
ERROR: 42601: syntax error at or near "NOT"
LINE 8: CREATE TYPE IF NOT EXISTS mood_level AS ENUM ('very_low', 'low', 'neutral', 'good', 'excellent');
```

**Root Cause:** PostgreSQL doesn't support `IF NOT EXISTS` for `CREATE TYPE` statements.

## ✅ The Solution

This fixed version uses a **DO block with conditional logic** to safely create enum types:

```sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood_level') THEN
        CREATE TYPE mood_level AS ENUM ('very_low', 'low', 'neutral', 'good', 'excellent');
    END IF;
    -- ... other types
END
$$;
```

## 🚀 How to Use

1. **Open your Supabase SQL Editor**
2. **Copy the contents of `supabase-setup-fixed.sql`**
3. **Run the script**

## 🔧 What Changed

### **Before (Error):**
```sql
CREATE TYPE IF NOT EXISTS mood_level AS ENUM ('very_low', 'low', 'neutral', 'good', 'excellent');
```

### **After (Fixed):**
```sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood_level') THEN
        CREATE TYPE mood_level AS ENUM ('very_low', 'low', 'neutral', 'good', 'excellent');
    END IF;
END
$$;
```

## ✅ Features Included

- ✅ **Safe enum type creation** (no syntax errors)
- ✅ **All tables with `IF NOT EXISTS`**
- ✅ **All indexes with `IF NOT EXISTS`**
- ✅ **All policies with `IF NOT EXISTS`**
- ✅ **All triggers with `IF NOT EXISTS`**
- ✅ **Row Level Security (RLS)**
- ✅ **Sample data included**

## 🔄 Re-running the Script

This version is **completely safe** to run multiple times:
- **First run:** Creates everything
- **Subsequent runs:** Skips existing objects, no errors

## 📊 Tables Created

1. `user_profiles` - Extended user information
2. `journal_entries` - Personal journal with mood tracking
3. `community_posts` - Community discussions
4. `comments` - Post comments
5. `resources` - Mental health resources
6. `quiz_results` - Quiz scores and responses
7. `breathing_sessions` - Track breathing exercises

## 🎯 Next Steps

1. ✅ **Run `supabase-setup-fixed.sql`** in Supabase SQL Editor
2. ✅ **Test authentication** in your CalmSpace app
3. ✅ **Verify tables** in Supabase dashboard
4. ✅ **Start using the database** in your services

## 🆚 Version Comparison

| Version | CREATE TYPE Support | Safe to Re-run | Syntax Errors |
|---------|-------------------|----------------|---------------|
| `supabase-setup.sql` | ❌ No | ❌ No | ❌ Yes |
| `supabase-setup-safe.sql` | ❌ No | ✅ Yes | ❌ Yes |
| `supabase-setup-fixed.sql` | ✅ Yes | ✅ Yes | ✅ No |

**Use `supabase-setup-fixed.sql`** - it's the only version that works correctly with Supabase!

Your CalmSpace database setup is now fixed and ready! 🚀
