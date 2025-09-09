/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...outras configs...
  images: {
    domains: [
      "static.wikia.nocookie.net",
      // adicione outros domínios se necessário
    ],
  },
};

export default nextConfig;