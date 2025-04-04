import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

import {
  tryOperation,
  validateSourceFile,
  validateTargetDirectory,
  checkTargetFileExists,
} from "../helpers.js";

export async function showFileContent(filePath, currentDir) {
  if (!filePath) {
    console.log("Operation failed: Please specify file");
    return;
  }

  await tryOperation(async function () {
    const resolvedPath = path.resolve(currentDir, filePath);
    const content = await fs.promises.readFile(resolvedPath, "utf8");
    console.log("\nFile content:");
    console.log(content);
  });
}

export async function createFile(fileName, currentDir) {
  if (!fileName) {
    console.log("Operation failed: Please specify file name");
    return;
  }

  await tryOperation(async function () {
    const resolvedPath = path.resolve(currentDir, fileName);
    await fs.promises.writeFile(resolvedPath, "", { flag: "wx" });
    console.log(`File created: ${resolvedPath}`);
  });
}

export async function createDirectory(dirName, currentDir) {
  if (!dirName) {
    console.log("Operation failed: Please specify directory name");
    return;
  }

  await tryOperation(async function () {
    const resolvedPath = path.resolve(currentDir, dirName);
    await fs.promises.mkdir(resolvedPath, { recursive: false });
    console.log(`Directory created: ${resolvedPath}`);
  });
}

export async function renameFile(filePath, newName, currentDir) {
  if (!filePath || !newName) {
    console.log("Operation failed: Please specify file and file name");
    return;
  }

  if (newName.includes("/") || newName.includes("\\")) {
    console.log("Operation failed: New name cannot contain path separators");
    return;
  }

  await tryOperation(async function () {
    const resolvedOldPath = path.resolve(currentDir, filePath);
    const resolvedNewPath = path.resolve(
      path.dirname(resolvedOldPath),
      newName
    );

    // check target file existing
    try {
      await fs.promises.access(resolvedNewPath);
      console.log("Operation failed: Target file already exists");
      return;
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    await fs.promises.rename(resolvedOldPath, resolvedNewPath);
    console.log(`Successfully renamed to: ${newName}`);
  });
}

export async function copyFile(sourcePath, destination, currentDir) {
  if (!sourcePath || !destination) {
    console.log("Operation failed: Please specify both source and destination");
    return;
  }

  await tryOperation(async function () {
    const resolvedSource = path.resolve(currentDir, sourcePath);
    const resolvedTarget = path.resolve(currentDir, destination);

    await validateSourceFile(resolvedSource);
    await validateTargetDirectory(resolvedTarget);
    const finalTarget = path.join(
      resolvedTarget,
      path.basename(resolvedSource)
    );
    await checkTargetFileExists(finalTarget);
    await copyWithStreams(resolvedSource, finalTarget);

    console.log(`File copied to: ${path.relative(currentDir, finalTarget)}`);
  });
}

export async function moveFile(sourcePath, destination, currentDir) {
  if (!sourcePath || !destination) {
    console.log("Operation failed: Please specify both source and destination");
    return;
  }

  await tryOperation(async function () {
    const resolvedSource = path.resolve(currentDir, sourcePath);
    const resolvedTarget = path.resolve(currentDir, destination);

    await validateSourceFile(resolvedSource);
    const finalTarget = path.join(
      resolvedTarget,
      path.basename(resolvedSource)
    );
    await checkTargetFileExists(finalTarget);
    await copyWithStreams(resolvedSource, finalTarget);
    await fs.promises.unlink(resolvedSource);

    console.log(`File moved to: ${path.relative(currentDir, finalTarget)}`);
  });
}

export async function deleteFile(filePath, currentDir) {
  if (!filePath) {
    console.log("Operation failed: Please specify path to file");
    return;
  }

  await tryOperation(async function () {
    const resolvedPath = path.resolve(currentDir, filePath);
    await validateSourceFile(resolvedPath);
    await fs.promises.unlink(resolvedPath);
  });
}

// utils
async function copyWithStreams(source, target) {
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(target);
  await pipeline(readStream, writeStream);
}
