function aliasResolver(alias: string, directory: string): ResolverFunction {
  directory = path.resolve(__dirname, directory);
  const subdirectories = new Set(
    readdirSync(directory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
  );
  const extractDir = (p: string) => {
    const dirEndIndex = p.indexOf(path.sep);
    return p.slice(alias.length, dirEndIndex < 0 ? p.length : dirEndIndex);
  };
  return async function (importee, importer, resolveOptions) {
    if (
      importee.startsWith(alias) &&
      subdirectories.has(extractDir(importee))
    ) {
      return path.join(directory, importee.slice(alias.length));
    }
    const resolved = await this.resolve(
      importee,
      importer,
      Object.assign({ skipSelf: true }, resolveOptions)
    );
    return resolved || { id: importee };
  };
}
