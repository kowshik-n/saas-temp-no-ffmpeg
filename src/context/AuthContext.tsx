import React, { createContext, useContext, useEffect, useState } from "react";
import { User, auth, onAuthStateChanged } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  updateProfile,
} from "firebase/auth";
import { supabase } from "@/lib/supabase";
import { usePro } from "./ProContext";
import { trackLogin, trackSignUp } from "@/services/analyticsService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create a local state for pro status that will be updated from Supabase
  const [isUserPro, setIsUserPro] = useState(false);

  // Try to use the Pro context, but don't fail if it's not available
  let proContext;
  try {
    proContext = usePro();
  } catch (error) {
    // Pro context not available, we'll use local state instead
    console.log("Pro context not available, using local state");
  }

  // Use the Pro context's setter if available, otherwise use the local setter
  const setIsPro = proContext?.setIsPro || setIsUserPro;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Check if user exists in Supabase
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("firebase_uid", firebaseUser.uid)
            .single();

          // If user doesn't exist in Supabase, create them
          if (error || !userData) {
            console.log("User not found in Supabase, creating new user...");

            try {
              // Create user profile with default values
              const newUserData = {
                firebase_uid: firebaseUser.uid,
                email: firebaseUser.email,
                display_name:
                  firebaseUser.displayName ||
                  firebaseUser.email?.split("@")[0] ||
                  "User",
                avatar_url: firebaseUser.photoURL,
                is_pro: false,
                created_at: new Date().toISOString(),
              };

              const { data: newUser, error: createError } = await supabase
                .from("users")
                .insert([newUserData])
                .select()
                .single();

              if (createError) {
                console.error("Error creating user in Supabase:", createError);
              } else {
                console.log("Successfully created user in Supabase:", newUser);
                // Update Pro status based on new user data
                setIsPro(newUser.is_pro);

                // Create default settings for the user
                try {
                  await supabase.from("user_settings").insert([
                    {
                      user_id: firebaseUser.uid,
                      theme: "light",
                      language: "en",
                      notifications_enabled: true,
                      created_at: new Date().toISOString(),
                    },
                  ]);
                } catch (settingsError) {
                  console.error("Error creating user settings:", settingsError);
                }
              }
            } catch (insertError) {
              console.error(
                "Exception creating user in Supabase:",
                insertError,
              );
            }
          } else if (userData) {
            // Update Pro status based on Supabase data
            setIsPro(userData.is_pro);
            console.log("Found existing user in Supabase:", userData);
          }
        } catch (error) {
          console.error("Error syncing user with Supabase:", error);
        }
      } else {
        // User is signed out, reset pro status
        setIsPro(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setIsPro]);

  const signUp = async (email: string, password: string) => {
    try {
      // Set persistence to LOCAL to keep the user logged in
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Set display name to email username
      const displayName = email.split("@")[0];
      await updateProfile(user, {
        displayName: displayName,
      });

      // Create user in Supabase
      await supabase.from("users").insert([
        {
          firebase_uid: user.uid,
          email: user.email,
          display_name: displayName,
          is_pro: false,
          created_at: new Date().toISOString(),
        },
      ]);

      // Track signup event
      trackSignUp("email");
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Set persistence to LOCAL to keep the user logged in
      await setPersistence(auth, browserLocalPersistence);

      await signInWithEmailAndPassword(auth, email, password);

      // Track login event
      trackLogin("email");
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Set persistence to LOCAL to keep the user logged in
      await setPersistence(auth, browserLocalPersistence);

      const provider = new GoogleAuthProvider();
      // Add scopes if needed
      provider.addScope("profile");
      provider.addScope("email");

      // Set custom parameters
      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(auth, provider);

      // Track login event
      trackLogin("google");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsPro(false);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
