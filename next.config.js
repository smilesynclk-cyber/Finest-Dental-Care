/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the 'output: export' line
  images: { unoptimized: true },
  env: {
    // Expose these variables to the build process
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.supabaseUrl,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.supabaseKey,
  },
};

module.exports = nextConfig;