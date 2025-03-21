import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = "https://nthxaudroxtrhryprcwo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHhhdWRyb3h0cmhyeXByY3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDUyNzcsImV4cCI6MjA1ODEyMTI3N30.hQz_tcep3e_Wcwdme1XXMLaQhkHEna6CCrGdwIaetvo";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error);
  return {
    error: true,
    message: error.message || "An error occurred with the database connection",
  };
};

// Check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .single();
    if (error) throw error;
    return { connected: true, data };
  } catch (error) {
    console.error("Supabase connection check failed:", error);
    return { connected: false, error };
  }
};
