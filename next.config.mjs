/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...outras configs...
  images: {
    domains: [
      "static.wikia.nocookie.net",
      "via.placeholder.com",
      "picsum.photos",
      "images.unsplash.com",
      "cdn.jsdelivr.net",
      "raw.githubusercontent.com",
      // adicione outros domínios se necessário
    ],
  },
};

export default nextConfig;