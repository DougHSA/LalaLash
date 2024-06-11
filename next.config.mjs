/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                hostname:"utfs.io"
            },
            {
                hostname:"scontent.cdninstagram.com"
            }
        ]
    }
};

export default nextConfig;
