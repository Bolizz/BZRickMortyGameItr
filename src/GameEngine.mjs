export class GameEngine {
  constructor({ io, fair, morty, N, stats }) {
    this.io = io;
    this.fair = fair;
    this.morty = morty;
    this.N = N;
    this.stats = stats;
  }

  async round() {
    this.fair.reset();
    console.log(
      `Morty: Oh geez, Rick, I'm gonna hide your portal gun in one of the ${this.N} boxes, okay?`
    );

    const { value: gunIndex } = await this.fair.get(this.N, "1");

    const guess = await this.io.askIntInRange(
      `Morty: Okay, okay, I hid the gun. What's your guess`,
      0,
      this.N
    );

    const other = await this.morty.chooseOtherBox(
      this.fair,
      this.N,
      gunIndex,
      guess
    );
    console.log(
      `Morty: I'm keeping the box you chose, I mean ${guess}, and the box ${other}.`
    );

    const switchOrStay = await this.io.askIntInRange(
      "Morty: You can switch your box (enter 0), or, you know, stick with it (enter 1).",
      0,
      2
    );
    const switched = switchOrStay === 0;
    const finalPick = switched ? other : guess;

    // Reveal the fair protocol(s)
    this.fair.revealAll();

    console.log(`Morty: You portal gun is in the box ${gunIndex}.`);

    const win = finalPick === gunIndex;
    if (win) console.log("Morty: Aww man, you won, Rick!");
    else
      console.log(
        "Morty: Aww man, you lost, Rick. Now we gotta go on one of *my* adventures!"
      );

    this.stats.record({ switched, win });
  }
}
