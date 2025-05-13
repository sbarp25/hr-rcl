import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: "0.0.0.0",
  //   port: 5173,
  //   hmr: {
  //     // Replace this with your actual machine's IP address or hostname
  //     // that the client can reach
  //     host: "192.168.1.75",
  //     port: 5173,
  //     // Uncommenting the line below can help with some network configurations
  //     // protocol: 'ws',
  //   },
  // },
});
