import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Auth features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
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
