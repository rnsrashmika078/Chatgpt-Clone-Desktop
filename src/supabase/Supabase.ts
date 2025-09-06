import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gyieuhkdrbjmknzebype.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5aWV1aGtkcmJqbWtuemVieXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNDU1NDEsImV4cCI6MjA3MjYyMTU0MX0.jaZjt7bYZEoCBxma0ti3l_wcN1LxePOecgX7ppa9EP4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
