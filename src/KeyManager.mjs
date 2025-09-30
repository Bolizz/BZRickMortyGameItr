import crypto from "node:crypto";

export class KeyManager {
  static newKey() {
    return crypto.randomBytes(32);
  }
}
