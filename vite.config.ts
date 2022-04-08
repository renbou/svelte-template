import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { createPreprocessors } from "./svelte.config";
import { viteAliasResolver } from "./config/resolver";

export default defineConfig(({ mode }) => {
  const production = mode === "production";
  return {
    plugins: [
      svelte({
        preprocess: createPreprocessors(production),
      }),
    ],
    resolve: {
      alias: viteAliasResolver({
        aliases: {
          "@": "./src",
          "~": "./node_modules",
        },
        exclude: [/@vite/],
      }),
    },
  };
});
