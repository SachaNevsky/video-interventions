/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_WS_IP: process.env.NEXT_PUBLIC_WS_IP,
    }
};

export default nextConfig;
