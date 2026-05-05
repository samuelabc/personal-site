import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import fs from "node:fs";
import path from "node:path";

function serveSpaFallback() {
  return {
    name: "serve-spa-fallback",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && !path.extname(req.url)) {
          const filePath = path.join("public", req.url, "index.html");
          if (fs.existsSync(filePath)) {
            req.url = path.posix.join(req.url, "index.html");
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  site: "https://samuelthien.site",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss(), serveSpaFallback()],
  },
});
