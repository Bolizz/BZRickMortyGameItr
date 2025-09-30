import crypto from "node:crypto";
import { KeyManager } from "./KeyManager.mjs";
import { UniformCSPRNG } from "./UniformCSPRNG.mjs";

export class FairNumberProtocol {
  constructor(io) {
    this.io = io;
    this.sessions = [];
  }
  async get(range, label = "") {
    const key = KeyManager.newKey();
    const m = UniformCSPRNG.int(range);

    const hmac = crypto
      .createHmac("sha3-256", key)
      .update(Buffer.from([m]))
      .digest("hex")
      .toUpperCase();

    if (label) console.log(`Morty: HMAC${label}=${hmac}`);
    else console.log(`Morty: HMAC=${hmac}`);

    const r = await this.io.askIntInRange(
      "Morty: Rick, enter your number",
      0,
      range
    );

    const fair = (m + r) % range;
    const idx = this.sessions.push({ key, m, r, range, label, fair }) - 1;
    return { value: fair, index: idx };
  }

  reveal(index) {
    const s = this.sessions[index];
    if (!s) return;
    const { m, r, range, key, label, fair } = s;
    const tag = label ? ` ${label}` : "";
    console.log(`Morty: Aww man, my${tag} random value is ${m}.`);
    console.log(
      `Morty: KEY${label || ""}=${key.toString("hex").toUpperCase()}`
    );
    console.log(
      `Morty: So the${
        tag || ""
      } fair number is (${m} + ${r}) % ${range} = ${fair}.`
    );
  }

  revealAll() {
    for (let i = 0; i < this.sessions.length; i++) this.reveal(i);
  }

  reset() {
    this.sessions = [];
  }
}
