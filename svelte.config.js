import preprocess from "svelte-preprocess";
export function createPreprocessors(production) {
  return [
    preprocess({
      sourceMap: !production
    })
  ];
}
export default {
  preprocess: createPreprocessors(false)
};
