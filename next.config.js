/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'get.pxhere.com'
    ],
    imageSizes: [
      16,
      32,
      48,
      64,
      96,
      128,
      138,
      180,
      256,
      276,
      360,
      384,
      414,
      540,
    ],
  }
}

module.exports = nextConfig
