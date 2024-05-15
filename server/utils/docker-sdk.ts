import chokidar from "chokidar";
import Docker from "dockerode";
import fs from "fs";
import path from "path";
export const docker = new Docker();
export async function _isContainerRunning(containerName: string) {
  try {
    const container = docker.getContainer(containerName);
    const data = await container.inspect();
    return !!data.Name;
  } catch (error) {
    return false;
  }
}
export async function dockerCreateContainer(
  imageName: string,
  containerName: string,
  port: number,
  exposedPort: number
) {
  let volumePath = path.resolve(
    __dirname,
    "../../../../mount/" + containerName.split("-")[0]
  ); // Absolute path on the host machine
  let newContainer = await docker.createContainer({
    Cmd: ["tail", "-f", "/dev/null"],
    Image: imageName,
    name: containerName,
    ExposedPorts: { [`${exposedPort}/tcp`]: {} },
    HostConfig: {
      PortBindings: { [`${exposedPort}/tcp`]: [{ HostPort: `${port}` }] },
      Binds: [`${volumePath}:${process.env.DOCKER_BASE_URL}`],
    },
    Volumes: { [`${process.env.DOCKER_BASE_URL}`]: {} },
  });

  await newContainer.start();
}

export async function dockerDeleteContainer(containerName: string) {
  try {
    const container = docker.getContainer(containerName);
    const data = await container.inspect();

    // Remove the container
    await container.remove({ force: true });

    // Extract the volume path from the container's host configuration
    const hostConfig = data.HostConfig;
    const binds = hostConfig && hostConfig.Binds;
    if (binds && binds.length > 0) {
      const volumePath = binds[0].split(":")[0]; // Extracting the volume path
      // Remove the volume
      await docker.pruneVolumes({
        filters: { label: [`com.docker.compose.project=${data.Name}`] },
      });
    }
    return !!data.Name;
  } catch (error) {
    return false;
  }
}
export async function executeCommandAndUpdateFile(
  command: string,
  containerName: string
) {
  try {
    const container = docker.getContainer(containerName);

    // Execute command inside the container
    const exec = await container.exec({
      Cmd: ["sh", "-c", command],
      AttachStdout: true,
      AttachStderr: true,
    });

    // Start the execution of the command
    const stream = await exec.start({ hijack: true, stdin: true });

    // Wait for the command to finish
    await new Promise((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);
    });
  } catch (error) {
    console.log(error);
  }
}

const targetPath = "/home/damner-lite/code/";

export async function getFilesystemChanges(containerId: string) {
  try {
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: ["find", targetPath, "-type", "f", "-o", "-type", "d"],
      AttachStdout: true,
      AttachStderr: true,
      WorkingDir: targetPath,
    });
    const stream = await exec.start({});
    const writeStream = fs.createWriteStream("kk.txt");
    stream.on("data", (chunk) => {
      writeStream.write(chunk.toString());
    });
    stream.on("end", () => {
      writeStream.end();
    });
  } catch (error) {
    console.error("Error retrieving filesystem changes:", error);
  }
}
const filePath = path.join(__dirname, "/demo");
// Path to your .txt file

// // Read the contents of the file
// fs.readFile(filePath, "utf8", (err, data) => {
//   if (err) {
//     console.error("Error reading file:", err);
//     return;
//   }

//   // Split the data by newline character to get an array of file paths
//   const filePaths = data.split("\n");
//   let i = 0,
//     d: string[] = [];
//   // Process each file path
//   filePaths.forEach((filePath) => {
//     // Ignore empty lines
//     if (filePath.trim() === "") return;
//     i++;
//     d.push(filePath);

//     // Here you can do whatever you want with each filePath
//   });
//   console.log(d);
// });
// const watcher = chokidar.watch("./utils/demo", {
//   persistent: true,
// });
// // Something to use when events are received.
// const log = console.log.bind(console);
// // Add event listeners.
// watcher.on("all", (a, b) => console.log(a, b));
interface SnapShot {
  key: string;
  isFolder: boolean;
  responseText: string;
}
export async function readDirectoryAsArray(directoryPath: string) {
  const snapshot: SnapShot[] = [];
  await readDirectory(directoryPath, snapshot);
  return snapshot;
}

async function readDirectory(directoryPath: string, snapshot: SnapShot[]) {
  const files = await fs.promises.readdir(directoryPath);
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);
    const isFolder = stats.isDirectory();
    if (isFolder) {
      snapshot.push({ key: filePath, isFolder, responseText: "" });
      await readDirectory(filePath, snapshot);
    } else {
      const content = await fs.promises.readFile(filePath, "utf-8");
      snapshot.push({ key: filePath, isFolder, responseText: content });
    }
  }
}
