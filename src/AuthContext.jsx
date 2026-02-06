import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, createOrGetProfile } from './supabaseClient';

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
  const profileLoadedRef = useRef(false);

  // Fetch or create profile - never blocks auth flow
  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser || !mountedRef.current) {
      if (mountedRef.current) setProfile(null);
      return null;
    }

    try {
      const { data: profileData, error } = await createOrGetProfile(currentUser);
      if (error) {
        console.warn('Profile load failed (RLS?):', error.message);
        // Build a fallback profile from user_metadata so UI is never empty
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
      if (mountedRef.current) {
        setProfile(profileData);
        profileLoadedRef.current = true;
      }
      return profileData;
    } catch (err) {
      console.warn('Profile exception:', err.message);
      // Fallback so UI doesn't break
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
    profileLoadedRef.current = false;

    if (!supabase) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    // ═══════════════════════════════════════════════════════════════
    // FAST INITIAL CHECK - show cached user instantly
    // ═══════════════════════════════════════════════════════════════
    try {
      const stored = localStorage.getItem('guideai-auth-token');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user) {
          setUser(parsed.user);
        }
      }
    } catch (e) {
      // ignore
    }

    // ═══════════════════════════════════════════════════════════════
    // MAIN SESSION VERIFICATION
    // ═══════════════════════════════════════════════════════════════
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('getSession error:', error.message);
          try {
            const { data: refreshData } = await supabase.auth.refreshSession();
            if (refreshData?.session && mountedRef.current) {
              setUser(refreshData.session.user);
              await loadProfile(refreshData.session.user);
              return;
            }
          } catch (e) {
            console.warn('refreshSession error:', e.message);
          }
        }

        if (mountedRef.current) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            await loadProfile(currentUser);
          } else {
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
        if (mountedRef.current) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    // ═══════════════════════════════════════════════════════════════
    // AUTH STATE LISTENER
    // ═══════════════════════════════════════════════════════════════
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;
      console.log('[Auth]', event, session?.user?.email || 'no user');

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          if (currentUser) await loadProfile(currentUser);
          if (mountedRef.current) {
            setLoading(false);
            setInitialized(true);
          }
          break;

        case 'SIGNED_OUT':
          if (mountedRef.current) {
            setProfile(null);
            setUser(null);
            setLoading(false);
          }
          break;

        case 'INITIAL_SESSION':
          if (currentUser) await loadProfile(currentUser);
          if (mountedRef.current) {
            setLoading(false);
            setInitialized(true);
          }
          break;

        case 'USER_UPDATED':
          if (currentUser) await loadProfile(currentUser);
          break;

        default:
          break;
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // ═══════════════════════════════════════════════════════════════
  // DERIVED VALUES - always safe, never null when user exists
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
