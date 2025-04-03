import process from "process";

import {
  showFileContent,
  createFile,
  copyFile,
  renameFile,
  moveFile,
  deleteFile,
} from "./commands/fs.js";
import { listFiles, changeDirectory, goUp } from "./commands/nwd.js";
import { handleOsCommand } from "./commands/os.js";
import { calculateHash } from "./commands/hash.js";

let currentDir = process.cwd();
let isExiting = false;

export function updatePrompt(rl) {
  rl.setPrompt(`You are currently in ${currentDir}\n> `);
  rl.prompt();
}

export function exit(username, rl) {
  if (isExiting) return;
  isExiting = true;

  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);

  if (rl) {
    rl.close();
  }

  process.exit(0);
}

export async function handleCommand(input, username, rl) {
  const [command, ...args] = input.trim().split(" ");

  switch (command) {
    // exit
    case ".exit":
      exit(username, rl);
      break;
    // nwd
    case "up":
      currentDir = goUp(currentDir);
      break;
    case "cd":
      const newDir = await changeDirectory(args[0], currentDir);
      if (newDir) {
        currentDir = newDir;
      }
      break;
    case "ls":
      await listFiles(currentDir);
      break;

    case "cat":
      await showFileContent(args[0]);
      break;
    case "add":
      await createFile(args[0]);
      break;
    case "rn":
      await renameFile(args[0], args[1]);
      break;
    case "cp":
      await copyFile(args[0], args[1]);
      break;
    case "mv":
      await moveFile(args[0], args[1]);
      break;
    case "rm":
      await deleteFile(args[0]);
      break;
    // os
    case "os":
      handleOsCommand(args[0]);
      break;
    // hash
    case "hash":
      await calculateHash(args[0], currentDir);
      break;

    default:
      console.log("Invalid input");
  }

  updatePrompt(rl);
}
