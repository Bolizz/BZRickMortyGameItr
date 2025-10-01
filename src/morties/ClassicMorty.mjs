import { Morty } from "../Morty.mjs";

export class ClassicMorty extends Morty {
  get name() {
    return "ClassicMorty";
  }

  async chooseOtherBox(fair, N, gunIndex, rickGuess) {
    if (rickGuess !== gunIndex) {
      await fair.get(N - 1, "2");
      return gunIndex;
    } else {
      const { value: idx } = await fair.get(N - 1, "2");

      let other = idx;
      if (other >= rickGuess) other += 1;
      return other;
    }
  }

  exactProbabilities(N) {
    return { stay: 1 / N, switch: (N - 1) / N };
  }
}
