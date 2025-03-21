import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nthxaudroxtrhryprcwo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHhhdWRyb3h0cmhyeXByY3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDUyNzcsImV4cCI6MjA1ODEyMTI3N30.hQz_tcep3e_Wcwdme1XXMLaQhkHEna6CCrGdwIaetvo";

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
