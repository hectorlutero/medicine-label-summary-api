/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    openFdaApi: process.env.OPEN_FDA_API,
  },
}

module.exports = nextConfig
