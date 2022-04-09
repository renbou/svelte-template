import preprocess from "svelte-preprocess";
import { scssLegacyAliasImporter } from "./config/resolvers";

export default {
  preprocess: preprocess({
    sourceMap: process.env["NODE_ENV"] === "production",
    scss: {
      // use our custom async resolvers/importers
      renderSync: false,
      // svelte currently uses legacy importers
      importer: scssLegacyAliasImporter({
        "@": "./src",
        "~": "./node_modules",
      }),
      prependData: '@use "@styles/variables" as *;',
    },
  }),
};
