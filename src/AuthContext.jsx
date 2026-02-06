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

  // Fetch or create profile for user
  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser || !mountedRef.current) {
      if (mountedRef.current) setProfile(null);
      return null;
    }

    try {
      const { data: profileData, error } = await createOrGetProfile(currentUser);
      if (error) {
        console.error('Profile error:', error);
      }
      if (mountedRef.current) {
        setProfile(profileData);
      }
      return profileData;
    } catch (err) {
      console.error('Failed to load profile:', err);
      if (mountedRef.current) {
        setProfile(null);
      }
      return null;
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
    // FAST INITIAL CHECK - localStorage for instant UI
    // ═══════════════════════════════════════════════════════════════
    try {
      const storedSession = localStorage.getItem('guideai-auth-token');
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed?.user) {
          setUser(parsed.user);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }

    // ═══════════════════════════════════════════════════════════════
    // MAIN SESSION VERIFICATION
    // ═══════════════════════════════════════════════════════════════
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session fetch error:', error);
          try {
            const { data: refreshData } = await supabase.auth.refreshSession();
            if (refreshData?.session && mountedRef.current) {
              setUser(refreshData.session.user);
              await loadProfile(refreshData.session.user);
              return;
            }
          } catch (refreshErr) {
            console.error('Session refresh error:', refreshErr);
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

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentUser) {
          await loadProfile(currentUser);
        }
        if (mountedRef.current) {
          setLoading(false);
          setInitialized(true);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mountedRef.current) {
          setProfile(null);
          setUser(null);
          setLoading(false);
        }
      } else if (event === 'INITIAL_SESSION') {
        if (currentUser) {
          await loadProfile(currentUser);
        }
        if (mountedRef.current) {
          setLoading(false);
          setInitialized(true);
        }
      } else if (event === 'USER_UPDATED') {
        if (currentUser) {
          await loadProfile(currentUser);
        }
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════
  const value = {
    user,
    profile,
    loading,
    initialized,
    isAuthenticated: !!user,
    isPro: profile?.plan_type === 'pro' || profile?.plan_type === 'business',
    planType: profile?.plan_type || 'free',

    displayName: profile?.full_name?.split(' ')[0]
      || user?.user_metadata?.full_name?.split(' ')[0]
      || user?.user_metadata?.name?.split(' ')[0]
      || user?.email?.split('@')[0]
      || 'User',

    fullName: profile?.full_name
      || user?.user_metadata?.full_name
      || user?.user_metadata?.name
      || '',

    avatarUrl: profile?.avatar_url
      || user?.user_metadata?.avatar_url
      || user?.user_metadata?.picture
      || null,

    email: user?.email || '',

    refreshProfile: async () => {
      if (user) {
        return await loadProfile(user);
      }
      return null;
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
