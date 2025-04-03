import os from "os";

export function handleOsCommand(arg) {
  switch (arg) {
    case "--EOL":
      console.log(`Default system EOL: ${JSON.stringify(os.EOL)}`);
      break;
    case "--cpus":
      printCPUInfo();
      break;
    case "--homedir":
      console.log(`System home directory: ${os.homedir()}`);
      break;
    case "--username":
      console.log(`System username: ${os.userInfo().username}`);
      break;
    case "--architecture":
      console.log(`System architecture: ${os.arch()}`);
      break;
    default:
      console.log("Operation failed: Invalid OS command");
  }
}

const printCPUInfo = () => {
  const cpus = os.cpus();
  console.log(`Total CPUs: ${cpus.length}`);
  cpus.forEach((cpu, index) => {
    console.log(
      `CPU ${index + 1}: model - ${cpu.model}, speed - ${(cpu.speed / 1000).toFixed(2)} GHz`
    );
  });
};
