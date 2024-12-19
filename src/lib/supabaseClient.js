import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://cikbihrqwkfgvkrdgmqi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpa2JpaHJxd2tmZ3ZrcmRnbXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTI4ODAsImV4cCI6MjA1MDE4ODg4MH0.Yb2X29BqJ-dLIrwEwN3tRk-CUXcZquQmbgf6-AGCllg')