import * as path from "path";
import * as fsp from "fs/promises";
import type { Stats } from "fs";

const existsAnd = async (path: string, func: (f: Stats) => boolean) =>
  fsp
    .stat(path)
    .then((f) => func(f))
    .catch(() => false);
const existsFile = async (path: string) => existsAnd(path, (s) => s.isFile());
const existsDir = async (path: string) =>
  existsAnd(path, (s) => s.isDirectory());

export type PossibleResolution = string[] | undefined;

// PossiblyResolver should return possible filepaths to which the source importee
// might resolve to. The source is considered resolved if at least one of the returned
// paths exists and is accessible.
export type PossiblyResolver = (
  source: string
) => Promise<PossibleResolution> | PossibleResolution;

// identityResolver is a PossiblyResolver returning the
// passed source as a possible resolution.
export function identityResolver(source: string) {
  return [source];
}

// moduleDirectoryResolver is a PossiblyResolver which tries
// to resolve the source as a directory with a package.json,
// index.js, etc
export async function moduleDirectoryResolver(source: string) {
  if (!(await existsDir(source))) {
    return undefined;
  }

  let resolutions: string[] = [];
  // try package.json -> main first
  const packagePath = path.join(source, "package.json");
  try {
    if (await existsFile(packagePath)) {
      const pkgdata = JSON.parse((await fsp.readFile(packagePath)).toString());
      const pathToMain = pkgdata["main"]
        ? path.join(source, pkgdata["main"])
        : undefined;
      if (pathToMain) {
        resolutions.push(pathToMain);
      }
    }
  } catch (err) {
    console.error(
      `Error resolving module package.json for path ${source}: ${
        err instanceof Error ? err.message : err
      }`
    );
  }

  // overwise let's try index.js
  const indexPath = path.join(source, "index.js");
  if (await existsFile(packagePath)) {
    resolutions.push(indexPath);
  }
  return resolutions;
}

// mergingResolver returns a resolver which merges the results
// of resolutions through other resolvers
export function mergingResolver(
  ...resolvers: PossiblyResolver[]
): PossiblyResolver {
  return async (source: string) => {
    const results: string[] = [];
    for (const resolver of resolvers) {
      await Promise.resolve(resolver(source)).then((resolution) => {
        if (resolution !== undefined) {
          results.push(...resolution);
        }
      });
    }
    return results;
  };
}

// aliasResolver creates a new resolver which resolves paths
// by unaliasing and passing them to other resolvers
export function aliasResolver(
  {
    alias,
    directory,
  }: {
    alias: string;
    directory: string;
  },
  ...resolvers: PossiblyResolver[]
): PossiblyResolver {
  const merged = mergingResolver(...resolvers);
  return async (source: string): Promise<PossibleResolution> => {
    if (source.startsWith(alias) && source.length > alias.length) {
      return merged(path.join(directory, source.slice(alias.length)));
    }
    return undefined;
  };
}

export * from "./plugins";
