import crypto from "node:crypto";

export class UniformCSPRNG {
  static int(n) {
    if (!Number.isInteger(n) || n <= 0)
      throw new Error("Range must be positive integer");
    const MAX = 0x100000000; // 2^32
    const limit = Math.floor(MAX / n) * n; // largest multiple of n
    while (true) {
      const x = crypto.randomBytes(4).readUInt32BE();
      if (x < limit) return x % n;
    }
  }
}
