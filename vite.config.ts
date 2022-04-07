import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { createPreprocessors } from "./svelte.config";
import * as path from "path";
import type { Alias } from "vite";
import * as fs from "fs";

function aliasResolver(alias: string, directory: string): Alias {
  directory = path.resolve(__dirname, directory);
  const subdirectories = new Set(
    fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((d) => {
        if (d.isSymbolicLink()) {
          // pnpm uses symlinks for node_modules
          const realdir = fs.realpathSync(path.join(directory, d.name));
          return fs.existsSync(realdir) && fs.lstatSync(realdir).isDirectory();
        }
        return d.isDirectory();
      })
      .map((d) => d.name)
  );
  const aliasRegex = new RegExp(`^${alias}(.+)`);
  aliasRegex.test = function (s: string) {
    return (
      s.startsWith(alias) &&
      subdirectories.has(
        s
          .slice(alias.length) // must begin with alias
          .replace(new RegExp(`^\\${path.sep}*`), "") // slashes might be placed after alias
          .split(path.sep)[0] // we need to match the first subdirectory
      )
    );
  };
  return {
    find: aliasRegex,
    replacement: "$1",
    customResolver: async function (importee, importer, resolveOptions) {
      // Strip leading slashes and then check if first component is a valid subdirectory.
      // Update the importee if we matched, otherwise restore the original.
      importee = importee.replace(new RegExp(`^\\${path.sep}*`), "");
      const updatedImportee = subdirectories.has(importee.split(path.sep)[0])
        ? path.join(directory, importee)
        : `${alias}${importee}`;
      console.log(
        `custom resolving matched ${importee} (${
          importee.split(path.sep)[0]
        }) in ${Array.from(subdirectories).join(", ")} => ${updatedImportee}`
      );
      const resolved = await this.resolve(
        updatedImportee,
        importer,
        Object.assign({ skipSelf: true }, resolveOptions)
      );
      return resolved || { id: importee };
    },
  };
}

export default defineConfig(({ mode }) => {
  const production = mode === "production";
  const logreg = /^@(.+)/;
  const originaltest = logreg.test;
  logreg.test = function (s: string) {
    const result = originaltest.apply(this, [s]);
    console.log(`Tested ${this} on ${s}: ${result}`);
    return result;
  };
  return {
    plugins: [
      svelte({
        preprocess: createPreprocessors(production),
      }),
    ],
    resolve: {
      alias: [
        aliasResolver("@", "src"),
        aliasResolver("~", "node_modules"),
        // { find: "@", replacement: path.resolve(__dirname, "./src") },
        // { find: logreg, replacement: path.resolve(__dirname, "./src/$1") },
      ],
      // alias: {
      //   // "@": path.resolve(__dirname, "./src"),
      //   // "~": path.resolve(__dirname, "./node_modules"),
      // },
    },
  };
});
