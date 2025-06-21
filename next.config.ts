const { NextFederationPlugin } = require('@module-federation/nextjs-mf')
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.plugins!.push(
        new NextFederationPlugin({
          name: 'adminApp',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            loginApp: `loginApp@${process.env.NEXT_PUBLIC_LOGIN_REMOTE_URL || 'https://front-loginv1-kevinurena82-6772s-projects.vercel.app'}/_next/static/chunks/remoteEntry.js`,
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: false,
            },
            'react-dom': {
              singleton: true,
              requiredVersion: false,
            },
          },
          extraOptions: {
            exposePages: false,
            enableImageLoaderFix: true,
            enableUrlLoaderFix: true,
          },
        })
      )

      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      }
    }

    return config
  },
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig
