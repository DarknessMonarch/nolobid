// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio.nolobids.com',
        pathname: '/nolobids/**', 
      },
    ],
  },
};
