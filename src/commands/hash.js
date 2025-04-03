import { createHash } from "crypto";
import path from "path";
import fs from "fs";

import { tryOperation } from "../helpers.js";

export async function calculateHash(filePath, currentDir) {
  if (!filePath) {
    console.log("Operation failed: please specify file");
    return;
  }

  await tryOperation(async function () {
    const resolvedPath = path.resolve(currentDir, filePath);
    const stats = await fs.promises.stat(resolvedPath);

    if (stats.isDirectory()) {
      console.log("Operation failed: not a file");
      return;
    }
    const hash = createHash("sha256");
    const stream = fs.createReadStream(resolvedPath);

    stream.on("data", (chunk) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      const hexHash = hash.digest("hex");
      console.log(`${filePath} hash: ${hexHash}`);
    });

    stream.on("error", (err) => {
      console.error(`Operation failed: ${err.message}`);
    });
  });
}
