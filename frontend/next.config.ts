/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For optimized deployment
  images: {
    domains: ['your-vercel-app.vercel.app'], // Your future Vercel domain
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL, // Will set in Vercel dashboard
  }
};

module.exports = nextConfig;