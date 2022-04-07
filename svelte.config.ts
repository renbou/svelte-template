import preprocess from "svelte-preprocess";
import type { PreprocessorGroup } from "svelte-preprocess/dist/types";

export function createPreprocessors(production: boolean): PreprocessorGroup[] {
  return [
    preprocess({
      sourceMap: !production,
      scss: {
        // prependData: '@use "src/styles/variables.scss" as *;',
      },
    }),
  ];
}

export default {
  preprocess: createPreprocessors(false),
};
