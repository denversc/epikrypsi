import { randomBytes as nodeCryptoRandomBytes } from "node:crypto";

export interface RandomSource {
  bytes(numberBytes: number): Promise<Uint8Array>;
}

export class NodeCryptoRandomSource implements RandomSource {
  bytes(numberBytes: number): Promise<Uint8Array> {
    if (!Number.isInteger(numberBytes)) {
      throw new TypeError(`invalid numBytes: ${numberBytes} (must be an integer) [nrte95snfa]`);
    } else if (numberBytes < 0) {
      throw new Error(
        `invalid numBytes: ${numberBytes} ` +
          `(must be greater than or equal to zero) [hd4br2gk94]`,
      );
    }

    return new Promise((resolve, reject) => {
      nodeCryptoRandomBytes(numberBytes, (error, buf) => {
        if (error) {
          reject(error);
        } else {
          resolve(buf);
        }
      });
    });
  }
}
