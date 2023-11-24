/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['tan-bright-gibbon-975.mypinata.cloud']
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
