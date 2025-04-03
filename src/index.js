import { createInterface } from "readline";
import process from "process";

import { handleCommand, exit, updatePrompt } from "./cliManager.js";
import { getUsernameFromArgs } from "./helpers.js";

const username = getUsernameFromArgs();

console.log(`Welcome to the File Manager, ${username}!`);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("SIGINT", () => exit(username, rl));
rl.on("line", (input) => handleCommand(input, username, rl));
rl.on("close", () => exit(username, rl));

updatePrompt(rl);
