import { Morty } from "../Morty.mjs";

export class LazyMorty extends Morty {
  get name() {
    return "LazyMorty";
  }

  async chooseOtherBox(_fair, N, gunIndex, rickGuess) {
    if (rickGuess !== gunIndex) return gunIndex;

    for (let i = 0; i < N; i++) if (i !== rickGuess) return i;
  }

  exactProbabilities(N) {
    return { stay: 1 / N, switch: (N - 1) / N };
  }
}
