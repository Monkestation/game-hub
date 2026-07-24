const nextConfig = {
  /* config options here */
  distDir: process.env.NODE_ENV === "production" ? "build" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.monkestation.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "monkestation.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.catbox.moe",
        pathname: "/**",
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,DELETE,PATCH,POST,PUT",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value:
  //             "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
