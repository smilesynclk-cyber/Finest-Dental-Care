/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  env: {
    // Expose ALL required variables to the build process
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.supabaseUrl,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.supabaseKey,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

module.exports = nextConfig;