import * as path from "path";
import type { Alias, ResolverFunction } from "vite";
import {
  aliasResolver,
  identityResolver,
  moduleDirectoryResolver,
  mergingResolver,
} from ".";

export type ViteAliasOptions = {
  aliases: {
    [alias: string]: string;
  };
  exclude?: RegExp[];
};

class banlistRegExp extends RegExp {
  banlist: RegExp[];

  constructor(pattern: string, banlist: RegExp[], flags?: string) {
    super(pattern, flags);
    this.banlist = banlist;
  }

  test(string: string): boolean {
    for (const ban of this.banlist) {
      if (ban.test(string)) {
        return false;
      }
    }
    return super.test(string);
  }
}

// viteAliasResolver returns Vite Aliases initialized
// to resolve in a prettier and better way than by default.
// Use bypass to specify regexp of what not to alias
// (e.g. @vite or other problematic, dynamic modules)
export const viteAliasResolver = (
  options: ViteAliasOptions & Object
): Alias[] => {
  const aliases = Object.keys(options.aliases).filter((key) =>
    options.aliases.hasOwnProperty(key)
  );

  const resolver = mergingResolver(
    ...aliases.map((alias) =>
      aliasResolver(
        { alias, directory: path.resolve(options.aliases[alias]) },
        // resolve directories by hand first, then pass to vite's resolver
        moduleDirectoryResolver,
        identityResolver
      )
    )
  );

  const viteAliasResolver: ResolverFunction = async function (
    importee,
    importer,
    resolveOptions
  ) {
    const resolve = (src: string) =>
      this.resolve(
        src,
        importer,
        Object.assign({ skipSelf: true }, resolveOptions)
      );

    const possibleResolutions = await Promise.resolve(resolver(importee));
    if (possibleResolutions !== undefined && possibleResolutions.length > 0) {
      for (const possibleResolution of possibleResolutions) {
        const resolved = await resolve(possibleResolution);
        if (Boolean(resolved)) {
          return resolved;
        }
      }
    }
    return (await resolve(importee)) || { id: importee };
  };

  return aliases.map((alias) => {
    // normal regexp match except for bypasses
    return {
      find: new banlistRegExp(
        `^${alias}(.+)`,
        options.exclude ? options.exclude : []
      ),
      replacement: `${alias}$1`,
      customResolver: viteAliasResolver,
    };
  });
};
