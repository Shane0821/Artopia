/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['ipfs.io']
    },
    webpack(config) {
    config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
    }
    return config
    }
}

module.exports = nextConfig
