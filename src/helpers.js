export const getUsernameFromArgs = () => {
  const args = process.argv.slice(2);
  const usernameArg = args.find((arg) => arg.startsWith("--username="));
  const username = usernameArg ? usernameArg.split("=")[1] : "Guest";

  return username;
};

export const tryOperation = async (operation) => {
  try {
    return await operation();
  } catch (err) {
    console.log(`Operation failed: ${err.message}`);
  }
};
