// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",

  security: {
    checkOrigin: true,
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/api/location": {
          target:
            "https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/location/, ""),
          secure: false,
        },
      },
    },
  },

  adapter: node({
    mode: "standalone",
  }),

  integrations: [react()],
});
