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
  const initializingRef = useRef(false);

  // Fetch or create profile for user
  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser || !mountedRef.current) {
      setProfile(null);
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

    // Prevent double initialization
    if (initializingRef.current) return;
    initializingRef.current = true;

    // ═══════════════════════════════════════════════════════════════
    // FAST INITIAL CHECK - Check localStorage first for instant UI
    // ═══════════════════════════════════════════════════════════════
    const checkStoredSession = () => {
      try {
        const storedSession = localStorage.getItem('guideai-auth-token');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          if (parsed?.user) {
            // Show user immediately while we verify
            setUser(parsed.user);
            return true;
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
      return false;
    };

    const hasStoredSession = checkStoredSession();

    // If we have stored session, show content faster
    if (hasStoredSession) {
      setLoading(false);
    }

    // ═══════════════════════════════════════════════════════════════
    // MAIN SESSION VERIFICATION
    // ═══════════════════════════════════════════════════════════════
    const initAuth = async () => {
      try {
        // Get and verify actual session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session fetch error:', error);
          // Try refreshing
          const { data: refreshData } = await supabase.auth.refreshSession();
          if (refreshData?.session && mountedRef.current) {
            setUser(refreshData.session.user);
            await loadProfile(refreshData.session.user);
            return;
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
      } catch (error) {
        console.error('Auth init error:', error);
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

    // Start initialization
    initAuth();

    // ═══════════════════════════════════════════════════════════════
    // AUTH STATE LISTENER - Handle sign in/out events
    // ═══════════════════════════════════════════════════════════════
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);

      if (!mountedRef.current) return;

      const currentUser = session?.user ?? null;

      // Update user state immediately
      setUser(currentUser);

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          if (currentUser) {
            await loadProfile(currentUser);
          }
          // Ensure loading is false after sign in
          if (mountedRef.current) {
            setLoading(false);
            setInitialized(true);
          }
          break;

        case 'SIGNED_OUT':
          if (mountedRef.current) {
            setProfile(null);
            setLoading(false);
          }
          break;

        case 'INITIAL_SESSION':
          // This fires when page loads with existing session
          if (currentUser) {
            await loadProfile(currentUser);
          }
          if (mountedRef.current) {
            setLoading(false);
            setInitialized(true);
          }
          break;

        case 'USER_UPDATED':
          if (currentUser) {
            await loadProfile(currentUser);
          }
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

    // User display helpers
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

    // Methods
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
