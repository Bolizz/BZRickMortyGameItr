import crypto from "node:crypto";
import { KeyManager } from "./KeyManager.mjs";

export class FairNumberProtocol {
  constructor(io) {
    this.io = io;
    this.sessions = [];
  }

  async get(range, label = "") {
    if (!Number.isInteger(range) || range < 2) {
      throw new Error(`Range must be an integer >= 2 (got ${range})`);
    }

    const secretKey = KeyManager.newKey();
    const mortyNumber = await crypto.randomInt(0, range);

    const commitment = this.#hmacSha3(secretKey, mortyNumber).toUpperCase();
    const tag = label ? `HMAC${label}` : "HMAC";
    console.log(`Morty: ${tag}=${commitment}`);

    const rickNumber = await this.io.askIntInRange(
      "Morty: Rick, enter your number",
      0,
      range
    );

    const fairNumber = (mortyNumber + rickNumber) % range;

    const sessionIndex =
      this.sessions.push({
        key: secretKey,
        m: mortyNumber,
        r: rickNumber,
        range,
        label,
        fair: fairNumber,
      }) - 1;

    return { value: fairNumber, index: sessionIndex };
  }

  reveal(index) {
    const s = this.sessions[index];
    if (!s) return;

    const labelNote = s.label ? ` ${s.label}` : "";
    console.log(`Morty: Aww man, my${labelNote} random value is ${s.m}.`);
    console.log(
      `Morty: KEY${s.label || ""}=${s.key.toString("hex").toUpperCase()}`
    );
    console.log(
      `Morty: So the${labelNote} fair number is (${s.m} + ${s.r}) % ${s.range} = ${s.fair}.`
    );
  }

  revealAll() {
    for (let i = 0; i < this.sessions.length; i++) this.reveal(i);
  }

  reset() {
    this.sessions = [];
  }

  #hmacSha3(key, mortyNumber) {
    const msg = Buffer.from([mortyNumber]);
    return crypto.createHmac("sha3-256", key).update(msg).digest("hex");
  }
}
