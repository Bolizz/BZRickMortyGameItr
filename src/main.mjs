import { ArgParser, FriendlyError } from "./ArgParser.mjs";
import { MortyLoader } from "./MortyLoader.mjs";
import { RickIO } from "./RickIO.mjs";
import { FairNumberProtocol } from "./FairNumberProtocol.mjs";
import { Statistics } from "./Statistics.mjs";

(async () => {
  try {
    const { n: N, mortyModulePath, className } = ArgParser.parse(process.argv);

    const MortyClass = await MortyLoader.load(mortyModulePath, className);
    const morty = new MortyClass();

    const io = new RickIO();
    const fair = new FairNumberProtocol(io);
    const stats = new Statistics();

    const { GameEngine } = await import("./GameEngine.mjs");
    const engine = new GameEngine({ io, fair, morty, N, stats });

    console.log(`> Running with N=${N}, Morty=${morty.name}`);

    let rounds = 0;
    do {
      console.log("");
      await engine.round();
      rounds++;
    } while (await io.askYesNo("Morty: D-do you wanna play another round"));

    io.close();

    const exact = morty.exactProbabilities(N);
    stats.print(exact);
  } catch (e) {
    if (e.name === "FriendlyError") {
      console.error(e.message);
      process.exit(2);
    }
    // Hide stack trace; show friendly fallback
    console.error(
      "Cannot start the game. Please check your arguments.\n" +
        "Example: node src/main.mjs 3 ./src/morties/ClassicMorty.mjs ClassicMorty"
    );
    process.exit(2);
  }
})();
