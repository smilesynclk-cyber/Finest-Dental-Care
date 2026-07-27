// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // During build, return a dummy client that throws when used
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        console.warn('⚠️ Supabase client skipped during build')
        // Return a proxy that throws if used during build
        return new Proxy({} as any, {
          get: () => {
            throw new Error('Supabase client not available during build')
          }
        })
      }
      throw new Error('Missing Supabase environment variables')
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// For backward compatibility, export a proxy
export const supabase = new Proxy({} as any, {
  get: (_, prop) => {
    const client = getSupabaseClient()
    return client[prop]
  }
})