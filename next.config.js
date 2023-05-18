/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.NODE_ENV === 'production' ? process.env.API_URL_PROD : process.env.API_URL_DEV,
  }
}

module.exports = nextConfig
