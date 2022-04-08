import preprocess from "svelte-preprocess";
import * as path from "path";
import * as fs from "fs";
import { pathToFileURL } from "url";
export function aliasRe(alias, directory) {
  const subpaths = new Set(fs.readdirSync(path.resolve(process.cwd(), directory), {
    withFileTypes: true
  }).flatMap((d) => d.isFile() ? [d.name, path.parse(d.name).name] : d.name));
  const aliasRegex = new RegExp(`^${alias}(.+)`);
  aliasRegex.test = function(s) {
    return s.startsWith(alias) && subpaths.has(s.slice(alias.length).replace(new RegExp(`^\\${path.sep}*`), "").split(path.sep)[0]);
  };
  return aliasRegex;
}
function scssAliasResolver(aliases) {
  const aliasRegs = Object.keys(aliases).filter((key) => aliases.hasOwnProperty(key)).map((alias) => {
    return {
      re: aliasRe(alias, aliases[alias]),
      alias,
      dirurl: pathToFileURL(aliases[alias])
    };
  });
  return {
    findFileUrl(url) {
      for (const { re, alias, dirurl } of aliasRegs) {
        if (re.test(url)) {
          return new URL(url.slice(alias.length), dirurl);
        }
      }
      return null;
    }
  };
}
export function createPreprocessors(production) {
  return [
    preprocess({
      sourceMap: !production,
      scss: {
        importers: scssAliasResolver({
          "@": "src",
          "~": "node_modules"
        })
      }
    })
  ];
}
export default {
  preprocess: createPreprocessors(false)
};
