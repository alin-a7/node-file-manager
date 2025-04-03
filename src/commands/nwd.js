import path from "path";
import fs from "fs/promises";

import { tryOperation } from "../helpers.js";

export function goUp(currentDir) {
  const parentDir = path.dirname(currentDir);
  return parentDir;
}

export async function changeDirectory(dirPath, currentDir) {
  if (!dirPath) {
    console.log("Operation failed: please specify directory");
    return;
  }

  return await tryOperation(async function () {
    const newPath = path.resolve(currentDir, dirPath);
    const stats = await fs.stat(newPath);

    if (!stats.isDirectory()) {
      console.log("Operation failed: not a directory");
      return;
    }
    return newPath;
  });
}

export async function listFiles(currentDir) {
  await tryOperation(async function () {
    const files = await fs.readdir(currentDir, {
      withFileTypes: true,
    });
    
    const sortedFiles = files.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    console.log("\nCurrent directory content:");
    sortedFiles.forEach((file, index) =>
      console.log(
        `${index + 1}. ${file.name} — ${
          file.isDirectory() ? "[DIR]" : "[FILE]"
        }`
      )
    );
  });
}
