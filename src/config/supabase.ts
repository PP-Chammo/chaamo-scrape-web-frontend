import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://atdordzshxrtafbogpiw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0ZG9yZHpzaHhydGFmYm9ncGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjk5NzcsImV4cCI6MjA2NTkwNTk3N30.VaFd0kZ63XCMY9Q1ScP9Km2N-j9Cioz4mM8haYylUNA"
);
