import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { createPreprocessors } from "./svelte.config";
import * as path from "path";

export default defineConfig(({ mode }) => {
  const production = mode === "production";
  return {
    plugins: [svelte({ preprocess: createPreprocessors(production) })],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
