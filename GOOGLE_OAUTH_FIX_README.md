# 🔧 Fix Google OAuth redirect_uri_mismatch Error

## 🐛 The Problem

```
Access blocked: zeu ai's request is invalid
Error 400: redirect_uri_mismatch
```

This error occurs because the redirect URI configured in Google Cloud Console doesn't match what Supabase is trying to use.

## 🔍 Root Cause

Your Supabase auth service uses `window.location.origin` as the redirect URI, but your Google Cloud Console has different redirect URIs configured.

## ✅ Solution

### **Step 1: Check Your Current Redirect URI**

Your app is currently using:
```javascript
redirectTo: window.location.origin
```

This means it's using your current domain (e.g., `http://localhost:5175` for development).

### **Step 2: Update Google Cloud Console**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Navigate to "APIs & Services" > "Credentials"

2. **Find Your OAuth Client:**
   - Look for your OAuth 2.0 Client ID
   - Click on it to edit

3. **Add These Redirect URIs:**

For **Development** (localhost):
```
http://localhost:5175/auth/callback
http://localhost:5174/auth/callback
http://localhost:5173/auth/callback
http://localhost:3000/auth/callback
```

For **Production** (when deployed):
```
https://your-domain.com/auth/callback
```

### **Step 3: Update Supabase Auth Settings**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Open your project

2. **Navigate to Authentication:**
   - Go to "Authentication" > "Settings"

3. **Update Site URL:**
   - Set your site URL to: `http://localhost:5175` (for development)
   - Or your production domain

4. **Update Redirect URLs:**
   - Add: `http://localhost:5175/auth/callback`
   - Add your production callback URL

### **Step 4: Update Your Environment Variables**

Make sure your `.env` file has the correct Supabase URL:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🔧 Alternative Fix: Hardcode Redirect URI

If you want to hardcode the redirect URI instead of using `window.location.origin`, update your auth service:

```typescript
// In supabaseAuthService.ts, change this line:
redirectTo: window.location.origin

// To this:
redirectTo: 'http://localhost:5175/auth/callback'
```

## 📋 Complete Checklist

- [ ] ✅ Updated Google Cloud Console redirect URIs
- [ ] ✅ Updated Supabase Auth settings
- [ ] ✅ Verified environment variables
- [ ] ✅ Tested Google OAuth login

## 🆘 Still Having Issues?

### **Common Mistakes:**

1. **Wrong Port Number:**
   - Make sure you're using the correct port (5175, 5174, etc.)

2. **Missing Protocol:**
   - Always include `http://` or `https://`

3. **Trailing Slashes:**
   - Don't add trailing slashes to redirect URIs

4. **Case Sensitivity:**
   - URIs are case-sensitive

### **Debug Steps:**

1. **Check Browser Console:**
   - Look for the exact redirect URI being used

2. **Verify Environment:**
   - Make sure you're running on the correct port

3. **Check Supabase Logs:**
   - Look at your Supabase dashboard for auth errors

## 🚀 Test Your Fix

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Try Google OAuth login again**

3. **Check if the error is resolved**

## 📞 Need More Help?

If you're still getting the error, please share:
- Your current development URL (e.g., `http://localhost:5175`)
- Screenshots of your Google Cloud Console OAuth settings
- Screenshots of your Supabase Auth settings

This will help identify the exact mismatch causing the issue.

---

**Remember:** The redirect URI must match exactly between Google Cloud Console and what your app is trying to use. Even a small difference like `http` vs `https` or missing `/auth/callback` will cause this error.
