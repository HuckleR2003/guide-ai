# GuideAI - Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL** and **anon public key** from Settings → API

## 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Database Schema

Run these SQL commands in Supabase SQL Editor (Database → SQL Editor):

```sql
-- ═══════════════════════════════════════════════════════════════
-- PROFILES TABLE (extends auth.users)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- DEVICES TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  device_model TEXT,
  device_type TEXT,
  pdf_content TEXT,
  qr_url TEXT,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own devices" ON devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices" ON devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices" ON devices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own devices" ON devices
  FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- SCAN COUNT INCREMENT FUNCTION
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION increment_scan_count(device_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE devices
  SET scan_count = scan_count + 1,
      updated_at = NOW()
  WHERE id = device_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_created_at ON devices(created_at DESC);
```

## 4. Google OAuth Setup

### In Supabase Dashboard:
1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Copy the **Callback URL** (looks like: `https://your-project.supabase.co/auth/v1/callback`)

### In Google Cloud Console:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add **Authorized redirect URIs**:
   - `https://your-project.supabase.co/auth/v1/callback` (from Supabase)
   - `http://localhost:5173` (for local development)
7. Copy the **Client ID** and **Client Secret**

### Back in Supabase:
1. Paste the **Client ID** and **Client Secret** in the Google provider settings
2. Save

## 5. Email Authentication

Email auth works out of the box. To customize:

1. Go to **Authentication** → **Email Templates**
2. Customize confirmation email, magic link, etc.

## 6. Site URL Configuration

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain (e.g., `https://guideai.app`)
3. Add **Redirect URLs**:
   - `http://localhost:5173`
   - `http://localhost:5173/*`
   - `https://your-domain.com`
   - `https://your-domain.com/*`

## 7. Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and test:
- Sign up with email
- Sign in with Google
- Save devices to dashboard
- View dashboard at `#/dashboard`

## Plan Limits

| Plan | Devices | Queries/mo |
|------|---------|------------|
| Free | 1 | 100 |
| Pro | 10 | 1,000 |
| Business | Unlimited | 10,000 |

To upgrade a user manually:
```sql
UPDATE profiles SET plan_type = 'pro' WHERE email = 'user@example.com';
```
