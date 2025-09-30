import { FriendlyError } from "./ArgParser.mjs";

export class MortyLoader {
  static async load(modulePath, className) {
    let mod;
    try {
      mod = await import(MortyLoader._normalize(modulePath));
    } catch (e) {
      throw new FriendlyError(
        `Cannot load Morty module '${modulePath}'. Ensure the path is correct.\n` +
          `Example: node src/main.mjs 3 ./src/morties/ClassicMorty.mjs ClassicMorty`
      );
    }

    let Cls;
    if (className) {
      Cls = mod[className];
      if (!Cls) {
        throw new FriendlyError(
          `Morty class '${className}' was not found in module '${modulePath}'.\n` +
            `Exported keys: ${Object.keys(mod).join(", ") || "(none)"}`
        );
      }
    } else {
      // Try to find the first exported class with a 'name' and 'exactProbabilities'
      Cls = Object.values(mod).find((v) => typeof v === "function");
      if (!Cls) {
        throw new FriendlyError(
          `Module '${modulePath}' does not export a Morty class. Provide a class name as the 3rd argument.`
        );
      }
    }

    return Cls;
  }

  static _normalize(p) {
    if (
      p.startsWith("file://") ||
      p.startsWith("http://") ||
      p.startsWith("https://")
    )
      return p;
    if (p.startsWith(".")) return p;
    if (p.startsWith("/")) return p;
    return "./" + p;
  }
}
