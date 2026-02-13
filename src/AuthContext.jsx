import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getProfile } from './supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const mountedRef = useRef(true);

  // Load profile from DB (trigger already created it on signup)
  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser || !mountedRef.current) {
      if (mountedRef.current) setProfile(null);
      return null;
    }

    try {
      const { data, error } = await getProfile(currentUser.id);

      if (error || !data) {
        // DB unreachable or RLS issue — use metadata as fallback
        const fallback = {
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || null,
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
          plan_type: 'free',
        };
        if (mountedRef.current) setProfile(fallback);
        return fallback;
      }

      if (mountedRef.current) setProfile(data);
      return data;
    } catch (err) {
      console.warn('[Auth] Profile load error:', err.message);
      const fallback = {
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || null,
        avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
        plan_type: 'free',
      };
      if (mountedRef.current) setProfile(fallback);
      return fallback;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (!supabase) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    // ═══════════════════════════════════════════════════════════════
    // SINGLE SOURCE OF TRUTH: onAuthStateChange
    //
    // Supabase v2 fires INITIAL_SESSION immediately when listener
    // is registered, containing the current session (from storage
    // or from URL hash tokens). This is the ONLY place we read
    // auth state — no separate getSession() call needed.
    // ═══════════════════════════════════════════════════════════════
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;

        console.log('[Auth]', event, session?.user?.email || 'no user');

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Load profile WITHOUT blocking the initialized flag.
          // Use setTimeout to avoid Supabase deadlock warning
          // ("calling supabase.auth.getSession() inside onAuthStateChange")
          setTimeout(() => {
            if (mountedRef.current) {
              loadProfile(currentUser);
            }
          }, 0);
        } else {
          setProfile(null);
        }

        // Mark as initialized on ANY event (INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, etc.)
        if (mountedRef.current) {
          setLoading(false);
          setInitialized(true);
        }
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // ═══════════════════════════════════════════════════════════════
  // DERIVED VALUES
  // ═══════════════════════════════════════════════════════════════
  const displayName = profile?.full_name?.split(' ')[0]
    || user?.user_metadata?.full_name?.split(' ')[0]
    || user?.user_metadata?.name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'User';

  const avatarUrl = profile?.avatar_url
    || user?.user_metadata?.avatar_url
    || user?.user_metadata?.picture
    || null;

  const value = {
    user,
    profile,
    loading,
    initialized,
    isAuthenticated: !!user,
    isPro: profile?.plan_type === 'pro' || profile?.plan_type === 'business',
    planType: profile?.plan_type || 'free',
    displayName,
    fullName: profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    avatarUrl,
    email: user?.email || '',
    refreshProfile: async () => user ? await loadProfile(user) : null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
