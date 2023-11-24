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
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
