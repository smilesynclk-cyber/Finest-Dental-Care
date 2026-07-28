import { createClient } from '@/lib/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Get the host from request headers
  const host = request.headers.get('host') || ''
  
  // Determine protocol
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  
  // Use environment variable if available, otherwise construct from host
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
                 process.env.NEXT_PUBLIC_BASE_URL || 
                 ''
  
  let origin = appUrl
  
  // If no environment variable, construct from host
  if (!origin && host) {
    origin = `${protocol}://${host}`
  }
  
  // Final fallback
  if (!origin) {
    origin = 'http://localhost:3000'
  }
  
  // Remove trailing slash
  origin = origin.replace(/\/$/, '')
  
  return NextResponse.redirect(new URL('/login', origin))
}