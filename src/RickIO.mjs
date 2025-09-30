import readline from "node:readline";

export class RickIO {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  ask(question) {
    return new Promise((resolve) =>
      this.rl.question(question, (ans) => resolve(ans.trim()))
    );
  }
  async askIntInRange(prompt, minInclusive, maxExclusive) {
    while (true) {
      const ans = await this.ask(
        `${prompt} [${minInclusive},${maxExclusive}) `
      );
      const n = Number(ans);
      if (Number.isInteger(n) && n >= minInclusive && n < maxExclusive)
        return n;
      console.log(
        `Please enter an integer in [${minInclusive}, ${maxExclusive}).`
      );
    }
  }
  async askYesNo(prompt) {
    while (true) {
      const ans = (await this.ask(`${prompt} (y/n) `)).toLowerCase();
      if (ans === "y" || ans === "yes") return true;
      if (ans === "n" || ans === "no") return false;
      console.log("Please enter 'y' or 'n'.");
    }
  }
  close() {
    this.rl.close();
  }
}
