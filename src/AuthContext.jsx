import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Fetch or create profile for user
  const loadProfile = async (currentUser) => {
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
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser);
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // Create profile on sign up/sign in
        await loadProfile(currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
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
