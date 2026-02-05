import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // Fetch or create profile for user
  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    try {
      const { data: profileData, error } = await createOrGetProfile(currentUser);
      if (error) {
        console.error('Profile error:', error);
      }
      setProfile(profileData);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    let mounted = true;

    // Get initial session with retry logic
    const initAuth = async (retryCount = 0) => {
      try {
        // First check if we have a session in storage
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session fetch error:', error);
          // Try refreshing the session
          if (retryCount < 2) {
            const { data: refreshData } = await supabase.auth.refreshSession();
            if (refreshData?.session && mounted) {
              setUser(refreshData.session.user);
              await loadProfile(refreshData.session.user);
              return;
            }
          }
        }

        if (mounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            await loadProfile(currentUser);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);

      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentUser) {
          await loadProfile(currentUser);
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      } else if (event === 'INITIAL_SESSION') {
        // Handle initial session from storage
        if (currentUser) {
          await loadProfile(currentUser);
        }
        setLoading(false);
        setInitialized(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = {
    user,
    profile,
    loading,
    initialized,
    isAuthenticated: !!user,
    isPro: profile?.plan_type === 'pro' || profile?.plan_type === 'business',
    planType: profile?.plan_type || 'free',
    refreshProfile: async () => {
      if (user) {
        await loadProfile(user);
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
