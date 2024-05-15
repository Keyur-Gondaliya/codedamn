import { Socket } from "socket.io";
import {
  dockerDeleteContainer,
  executeCommandAndUpdateFile,
  readDirectoryAsArray,
} from "../utils/docker-sdk";
import {
  _updatePlaygroundFileSnapshot,
  checkPreviewAvailable,
  getPlaygroundFiles,
  updatePlaygroundSession,
} from "../controllers/playground";
import {
  _deleteFileByKey,
  _uploadFilesToS3,
  getObjectUrlsForFolder,
} from "../utils/s3-sdk";
import { PlaygroundSessionInterface } from "../utils/playground-data";
import os from "os";
import {
  _createFileOnInitiate,
  _deleteFilesOnInitiate,
  _findChanges,
  _findNotCommonStrings,
  handleFileSelect,
} from "../utils/supportFunctions";
import { IO } from "../config/socket";
import { Server } from "http";
import { spawn } from "node-pty";
import path from "path";
import { _excludeConfigForPort, _includeConfigForPort } from "../utils/nginx";
var shell = os.platform() === "win32" ? "powershell.exe" : "bash";
let io: any = null;
export const initSocket = function (server: Server) {
  io = IO(server);

  io.on("connection", (socket: Socket) => {
    socket.on("newContainer", async (id, cb) => {
      try {
        let currentSession: PlaygroundSessionInterface | null =
          await updatePlaygroundSession(id, false, socket.id);
        if (currentSession != null) {
          const {
            isPreviewAvailable,
            port,
            initialCommand,
          }: {
            isPreviewAvailable: boolean;
            port: number;
            initialCommand: string[];
          } = await checkPreviewAvailable(currentSession);
          _includeConfigForPort(port);

          cb({
            isPreviewAvailable,
            port,
            subDomain: currentSession.subDomain,
            initialCommand,
          });
        }
      } catch (error) {
        console.log(".......", error);
        cb({ isPreviewAvailable: false, port: 0 });
      }
    });
    socket.on(
      "getFiles",
      async ({ id, port }: { id: string; port: number }, cb) => {
        let list: { key: string; url: string }[] = await getObjectUrlsForFolder(
          `sessionList/${id}`
        );
        let oldRecord = await getPlaygroundFiles(id);
        if (oldRecord) {
          const finalArray = oldRecord
            .map((oldItem) => {
              const newItem = list.find(
                (newItem) => newItem.key === oldItem.key
              );
              if (newItem) {
                return {
                  key: oldItem.key,
                  url: newItem && newItem.url,
                  isFolder: oldItem.isFolder,
                };
              }
            })
            .filter(Boolean) as {
            key: string;
            url: string;
            isFolder: boolean;
          }[];
          const fileSystem: {
            key: string;
            url: string;
            responseText: string;
          }[] = [];
          const directoryPath = path.resolve(
            __dirname,
            "../../../../mount/" + id
          );
          _deleteFilesOnInitiate(directoryPath);
          for (const keyObject of finalArray) {
            const { key, url, isFolder } = keyObject;
            const fileData = await handleFileSelect(key, url, isFolder); // Fetches the file

            _createFileOnInitiate(fileData, directoryPath); // update docker container file
            fileSystem.push(fileData);
          }

          cb(fileSystem);
        } else cb([]);
      }
    );

    socket.on(
      "disconnectUser",
      async ({ containerId, port }: { containerId: string; port: number }) => {
        if (containerId) {
          await dockerDeleteContainer(containerId + "-" + port);
          await updatePlaygroundSession(containerId, true, "");
          _excludeConfigForPort(port);
        }
      }
    );
    var ptyProcess = spawn(shell, [], {
      name: "xterm-color",
      cwd: "/",
      env: process.env,
    });
    ptyProcess.onData((data) => {
      socket.emit("terminalResponse", data.toString());
    });
    socket.on(
      "terminalStart",
      async ({ containerName }: { containerName: string; command: string }) => {
        ptyProcess.write("docker exec -it " + containerName + " bash \r");
      }
    );

    socket.on(
      "terminal",
      async ({
        containerName,
        command,
      }: {
        containerName: string;
        command: string;
      }) => {
        ptyProcess.write(command);
        if (command === "\r" || command.includes("\r")) {
          setTimeout(function () {
            const directoryPath = path.resolve(
              __dirname,
              "../../../../mount/" + containerName.split("-")[0]
            );

            readDirectoryAsArray(directoryPath)
              .then(async (snapshot) => {
                snapshot = snapshot.map((e) => ({
                  ...e,
                  key: e.key.replace(
                    path.resolve(__dirname, "../../../../mount"),
                    "sessionList"
                  ),
                }));

                let oldRecord = await getPlaygroundFiles(
                  containerName.split("-")[0]
                );
                if (oldRecord) {
                  let { deletedFiles, newFiles } = _findChanges(
                    snapshot,
                    oldRecord
                  );

                  if (deletedFiles.length > 0) {
                    oldRecord = _findNotCommonStrings(deletedFiles, oldRecord);
                    _deleteFileByKey(deletedFiles); // S3 file Delete
                  }
                  if (newFiles.length > 0) {
                    oldRecord = oldRecord.concat(newFiles);
                    _uploadFilesToS3(newFiles); // S3 file add
                  }

                  if (newFiles.length > 0 || deletedFiles.length > 0) {
                    await _updatePlaygroundFileSnapshot(
                      containerName.split("-")[0],
                      oldRecord
                    );
                    socket.emit("updateInFileSystem", {
                      deletedFiles,
                      newFiles,
                    });
                  }
                }
              })
              .catch((error) => console.error("Error:", error));
          }, 1000);
        }
      }
    );
    socket.on(
      "terminalInitial",
      async ({
        containerName,
        command,
      }: {
        containerName: string;
        command: string;
      }) => {
        ptyProcess.write(command);
        if (command === "\r" || command.includes("\r")) {
          let oldRecord = await getPlaygroundFiles(containerName.split("-")[0]);
          if (oldRecord) {
            let newFiles = [
              {
                key:
                  "sessionList/" +
                  containerName.split("-")[0] +
                  "/node_modules",
                responseText: "",
                isFolder: true,
              },
            ];
            oldRecord = oldRecord.concat(newFiles);
            _uploadFilesToS3(newFiles); // S3 file add

            await _updatePlaygroundFileSnapshot(
              containerName.split("-")[0],
              oldRecord
            );
            socket.emit("updateInFileSystem", {
              deletedFiles: [],
              newFiles,
            });
          }
        }
      }
    );
  });
};
export function _emitToSocketIDs(socketIDs: string[]) {
  if (io) {
    socketIDs.forEach((socketID) => {
      io!.to(socketID).emit("terminatedPlayground");
    });
  } else {
    console.error("Socket.io instance is not initialized.");
  }
}
