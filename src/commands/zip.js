import { createReadStream, createWriteStream } from "fs";
import { createGzip, createGunzip } from "zlib";
import path from "path";
import { pipeline } from "stream/promises";

import {
  tryOperation,
  validateSourceFile,
  validateTargetDirectory,
} from "../helpers.js";

export async function compressFile(filePath, destination, currentDir) {
  if (!filePath) {
    console.log("Operation failed: Please specify file");
    return;
  }

  await tryOperation(async function () {
    const resolvedSource = path.resolve(currentDir, filePath);
    const resolvedTarget = path.resolve(currentDir, destination);
    const originalName = path.basename(resolvedSource);
    const finalTarget = path.join(resolvedTarget, `${originalName}.gz`);

    await validateSourceFile(resolvedSource);
    await validateTargetDirectory(resolvedTarget);

    await pipeline(
      createReadStream(resolvedSource),
      createGzip(),
      createWriteStream(finalTarget)
    );
    console.log(
      `File ${path.basename(resolvedSource)} compressed successfully`
    );
  });
}

export async function decompressFile(filePath, destination, currentDir) {
  if (!filePath) {
    console.log("Operation failed: Please specify file");
    return;
  }

  await tryOperation(async function () {
    const resolvedSource = path.resolve(currentDir, filePath);
    const resolvedTarget = path.resolve(currentDir, destination);
    const originalName = getOriginalFilename(resolvedSource);
    const finalTarget = path.join(resolvedTarget, originalName);

    await validateSourceFile(resolvedSource);
    await validateTargetDirectory(resolvedTarget);

    await pipeline(
      createReadStream(resolvedSource),
      createGunzip(),
      createWriteStream(finalTarget)
    );
    console.log(
      `File ${path.basename(resolvedSource)} decompressed successfully`
    );
  });
}

// utils
function getOriginalFilename(fullPath) {
  const basename = path.basename(fullPath);
  if (basename.endsWith(".gz")) {
    return basename.slice(0, -3);
  }
  return basename;
}
