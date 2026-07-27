// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Log warning if variables are missing
if (!supabaseUrl || !supabaseAnonKey) {  // ✅ Fixed: changed 'supanonKey' to 'supabaseAnonKey'
  console.warn('⚠️ Supabase environment variables are missing. Some features may not work.')
}

// Create and export the client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)