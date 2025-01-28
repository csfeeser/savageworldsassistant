module.exports = {
  async rewrites() {
    return [
      {
        source: "/socket.io/:path*",
        destination: "/api/socket", // Redirect socket.io requests to the API route
      },
    ];
  },
};

