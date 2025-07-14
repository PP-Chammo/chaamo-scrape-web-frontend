import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://atdordzshxrtafbogpiw.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_SERVICE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0ZG9yZHpzaHhydGFmYm9ncGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjk5NzcsImV4cCI6MjA2NTkwNTk3N30.VaFd0kZ63XCMY9Q1ScP9Km2N-j9Cioz4mM8haYylUNA";

export const supabase = createClient(supabaseUrl, supabaseKey);
