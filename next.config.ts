import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
      '',
  },
};

export default nextConfig;
