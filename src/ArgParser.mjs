export class ArgParser {
  static parse(argv) {
    // argv = ['node','path/main.mjs', ...]
    const args = argv.slice(2);
    if (args.length < 2 || args.length > 3) {
      throw new FriendlyError(
        "Invalid arguments. Expected 2 or 3 arguments: <boxes> <mortyModulePath> [<className>].\n" +
          "Examples:\n" +
          "  node src/main.mjs 3 ./src/morties/ClassicMorty.mjs ClassicMorty\n" +
          "  node src/main.mjs 3 ./src/morties/LazyMorty.mjs LazyMorty"
      );
    }

    const nRaw = args[0];
    const n = Number(nRaw);
    if (!Number.isInteger(n) || n < 3) {
      throw new FriendlyError(
        `Box count must be an integer >= 3 (got '${nRaw}').\n` +
          "Try: node src/main.mjs 3 ./src/morties/ClassicMorty.mjs ClassicMorty"
      );
    }

    const mortyModulePath = args[1];
    const className = args[2] || null;

    return { n, mortyModulePath, className };
  }
}

export class FriendlyError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "FriendlyError";
  }
}
