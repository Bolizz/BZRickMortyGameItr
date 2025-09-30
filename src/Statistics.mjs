import Table from "cli-table3";

export class Statistics {
  constructor() {
    this.roundsSwitched = 0;
    this.roundsStayed = 0;
    this.winsSwitched = 0;
    this.winsStayed = 0;
  }
  record({ switched, win }) {
    if (switched) {
      this.roundsSwitched++;
      if (win) this.winsSwitched++;
    } else {
      this.roundsStayed++;
      if (win) this.winsStayed++;
    }
  }
  estimate(p, q) {
    // p = wins / rounds (handle 0)
    return p && q ? (p / q).toFixed(3) : q ? "0.000" : "?";
  }
  print(exact) {
    const t = new Table({
      head: ["Game results", "Rick switched", "Rick stayed"],
      colAligns: ["left", "right", "right"],
    });

    t.push(
      ["Rounds", this.roundsSwitched, this.roundsStayed],
      ["Wins", this.winsSwitched, this.winsStayed],
      [
        "P (estimate)",
        this.estimate(this.winsSwitched, this.roundsSwitched),
        this.estimate(this.winsStayed, this.roundsStayed),
      ],
      ["P (exact)", exact.switch.toFixed(3), exact.stay.toFixed(3)]
    );

    console.log("\n                  GAME STATS");
    console.log(t.toString());
  }
}
