import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Auth features will be disabled.');
}

// Custom storage using localStorage with fallback
const customStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn('localStorage not available');
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn('localStorage not available');
    }
  },
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'guideai-auth-token',
        storage: customStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

// ═══════════════════════════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════════════════════════

export const signUpWithEmail = async (email, password) => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signInWithEmail = async (email, password) => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabase) return { user: null };

  const { data: { user } } = await supabase.auth.getUser();
  return { user };
};

// ═══════════════════════════════════════════════════════════════
// PROFILE HELPERS
// ═══════════════════════════════════════════════════════════════

export const getProfile = async (userId) => {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

// Creates profile if not exists, returns existing profile if it does
export const createOrGetProfile = async (user) => {
  if (!supabase || !user) return { data: null, error: { message: 'Supabase not configured' } };

  // First try to get existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If profile exists, return it
  if (existingProfile) {
    return { data: existingProfile, error: null };
  }

  // If no profile exists (PGRST116 = no rows), create one
  if (fetchError && fetchError.code === 'PGRST116') {
    const newProfile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      plan_type: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
      return { data: null, error: createError };
    }

    return { data: createdProfile, error: null };
  }

  return { data: null, error: fetchError };
};

export const updateProfile = async (userId, updates) => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single();

  return { data, error };
};

// ═══════════════════════════════════════════════════════════════
// DEVICES HELPERS
// ═══════════════════════════════════════════════════════════════

export const getDevices = async (userId) => {
  if (!supabase) return { data: [], error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
};

export const saveDevice = async (userId, device) => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase
    .from('devices')
    .insert({
      user_id: userId,
      device_name: device.name,
      device_model: device.model,
      device_type: device.type,
      pdf_content: device.pdfContent || null,
      qr_url: device.qrUrl,
      scan_count: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  return { data, error };
};

export const deleteDevice = async (deviceId) => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', deviceId);

  return { error };
};

export const incrementScanCount = async (deviceId) => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { error } = await supabase.rpc('increment_scan_count', { device_id: deviceId });
  return { error };
};

// ═══════════════════════════════════════════════════════════════
// DEVICE LIMITS
// ═══════════════════════════════════════════════════════════════

export const PLAN_LIMITS = {
  free: 1,
  pro: 10,
  business: Infinity,
};

export const canSaveMoreDevices = async (userId, planType) => {
  const limit = PLAN_LIMITS[planType] || PLAN_LIMITS.free;
  if (limit === Infinity) return true;

  const { data } = await getDevices(userId);
  return data.length < limit;
};

// ═══════════════════════════════════════════════════════════════
// STRIPE PAYMENT INTEGRATION
// ═══════════════════════════════════════════════════════════════

// Stripe Payment Links (replace with your actual Stripe payment links)
export const STRIPE_LINKS = {
  pro: 'https://buy.stripe.com/test_YOUR_PRO_LINK', // Replace with actual Stripe link
  business: 'https://buy.stripe.com/test_YOUR_BUSINESS_LINK', // Replace with actual Stripe link
};

// Plan prices for display
export const PLAN_PRICES = {
  free: { monthly: 0, yearly: 0 },
  pro: { monthly: 19, yearly: 190 }, // ~17% discount yearly
  business: { monthly: 49, yearly: 490 },
};

// Upgrade user plan (called after successful Stripe webhook or manual upgrade)
export const upgradePlan = async (userId, newPlanType) => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase
    .from('profiles')
    .update({
      plan_type: newPlanType,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

// Generate Stripe checkout URL with user metadata
export const getCheckoutUrl = (plan, userId, userEmail) => {
  const baseUrl = STRIPE_LINKS[plan];
  if (!baseUrl) return null;

  // Append user info as URL params for Stripe metadata
  const params = new URLSearchParams({
    client_reference_id: userId,
    prefilled_email: userEmail || '',
  });

  return `${baseUrl}?${params.toString()}`;
};

// Verify payment status (placeholder for webhook handling)
export const verifyPaymentStatus = async (sessionId) => {
  // This would typically call a Supabase Edge Function
  // that verifies the Stripe session and updates the user's plan
  console.log('Verify payment for session:', sessionId);
  return { success: true };
};
