import fs from "fs";
import path from "path";

export const getUsernameFromArgs = () => {
  const args = process.argv.slice(2);
  const usernameArg = args.find((arg) => arg.startsWith("--username="));
  const username = usernameArg ? usernameArg.split("=")[1] : "Guest";

  return username;
};

export const tryOperation = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    if (error.code === "EEXIST") {
      console.log(
        `Operation failed: Directory/file ${error.path} already exists`
      );
      return;
    }

    if (error.code === "ENOENT") {
      console.log(`Operation failed: File ${error.path} not found`);
      return;
    }

    console.log(`Operation failed: ${error.message}`);
  }
};

export async function validateSourceFile(resolvedPath) {
  const stats = await fs.promises.stat(resolvedPath);
  if (!stats.isFile()) {
    throw new Error(`Source ${resolvedPath} is not a file`);
  }
}

export async function checkTargetFileExists(resolvedPath) {
  try {
    await fs.promises.access(resolvedPath);
    throw new Error(`File  ${resolvedPath} already exists in target directory`);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

export async function validateTargetDirectory(resolvedPath) {
  const stats = await fs.promises.stat(resolvedPath).catch(() => null);
  if (!stats?.isDirectory()) {
    throw new Error(`Target directory ${resolvedPath} doesn't exist`);
  }
}
