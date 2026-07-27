// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Log warning if variables are missing
if (!supabaseUrl || !supanonKey) {
  console.warn('⚠️ Supabase environment variables are missing. Some features may not work.')
}

// Create a client with a wrapper that checks for missing config
const client = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

// Wrap the client to prevent errors when missing config
export const supabase = new Proxy(client, {
  get(target, prop) {
    // Check if we have valid config before allowing operations
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase client is not configured. Check your environment variables.')
      return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    }
    return target[prop as keyof typeof target]
  }
})