import type * as Vite from "vite";
import type * as Postcss from "postcss";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteAlias } from "./config/resolvers";
import purgecss from "@fullhuman/postcss-purgecss";
import purgeComments from "postcss-discard-comments";
import purgeHtml from "purgecss-from-html";
import purgeSvelte from "./config/purgecss";

const postcssConfig = (
  production: boolean
): Vite.UserConfig["css"]["postcss"] => {
  let plugins: Postcss.Plugin[] = [];
  if (production) {
    plugins.push(
      purgecss({
        content: ["index.html", "src/**/*.svelte"],
        extractors: [
          { extensions: ["svelte"], extractor: purgeSvelte },
          // @ts-ignore
          { extensions: ["html"], extractor: purgeHtml },
        ],
        // safelist tags which won't be extracted as well as scoped classes
        safelist: ["html", "body", /svelte-/],
      }) as Postcss.Plugin
    );
    plugins.push(purgeComments({ removeAll: true }));
  }
  return { plugins };
};

export default defineConfig(({ mode }) => {
  const production = mode === "production";
  return {
    plugins: [
      svelte(), // all svelte options are specified via svelte.config.js
    ],
    resolve: {
      alias: viteAlias({
        "@": "./src",
        "~": "./node_modules",
      }),
    },
    css: {
      postcss: postcssConfig(production),
      preprocessorOptions: {
        scss: {
          // remove scss charsets since they aren't needed
          charset: false,
        },
      },
    },
  };
});
