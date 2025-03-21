import React, { createContext, useContext, useEffect, useState } from "react";
import { User, auth, onAuthStateChanged } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { supabase } from "@/lib/supabase";
import { usePro } from "./ProContext";

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
  const { setIsPro } = usePro();

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
            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert([
                {
                  firebase_uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  display_name:
                    firebaseUser.displayName ||
                    firebaseUser.email?.split("@")[0],
                  avatar_url: firebaseUser.photoURL,
                  is_pro: false,
                  created_at: new Date().toISOString(),
                },
              ])
              .select()
              .single();

            if (newUser) {
              setIsPro(newUser.is_pro);
            }
          } else if (userData) {
            // Update Pro status based on Supabase data
            setIsPro(userData.is_pro);
          }
        } catch (error) {
          console.error("Error syncing user with Supabase:", error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setIsPro]);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Create user in Supabase
      await supabase.from("users").insert([
        {
          firebase_uid: user.uid,
          email: user.email,
          display_name: user.email?.split("@")[0],
          is_pro: false,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
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
