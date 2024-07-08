/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyDLgIXFbG87JLU_-iY5tAuCZskD_VmgiIY',
    },
    images: {
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'pai.agforce.co.id',
            },
            {
                protocol:'https',
                hostname:'images.unsplash.com',
            },
            {
                protocol:'https',
                hostname:'upload.wikimedia.org',
            },
            {
                protocol:'https',
                hostname:'hr-dev.agforce.co.id',
            },
            {
                protocol:'https',
                hostname:'cdn.agforce.co.id',
            },
            {
                protocol:'https',
                hostname:'eas-tech.net',
            },
            {
                protocol:'https',
                hostname:'pai.agforce.co.id',
            }
        ]
    },
};

export default nextConfig;
