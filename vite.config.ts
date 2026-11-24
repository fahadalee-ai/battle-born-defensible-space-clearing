import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Nitro writes the Vercel Build Output API to `.vercel/output` on `vite build`.
  nitro: { preset: "vercel" },
  vite: {
    base: "/",
    server: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
    preview: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
  },
});
