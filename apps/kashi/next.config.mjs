import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/redux-token-lists',
  '@sushiswap/redux-localstorage',
  '@sushiswap/chain',
  '@sushiswap/wagmi',
  '@sushiswap/ui',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/kashi',
  reactStrictMode: true,
  swcMinify: false,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  experimental: {
    nextScriptWorkers: true,
  },
}

export default withTranspileModules(nextConfig)
