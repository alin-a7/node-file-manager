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
      console.log(`Operation failed: Directory/file already exists`);
      return;
    }

    if (error.code === "ENOENT") {
      console.log(`Operation failed: File not found`);
      return;
    }

    console.log(`Operation failed: ${error.message}`);
  }
};
