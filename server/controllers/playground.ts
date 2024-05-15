import db from "../models";
import { Request, Response } from "express";
import {
  dockerCreateContainer,
  dockerDeleteContainer,
  executeCommandAndUpdateFile,
} from "../utils/docker-sdk";
import {
  PlaygroundSessionInterface,
  playgrounds,
} from "../utils/playground-data";
import { AppError } from "../utils/errorModel";
import { putObjectAsText, replicateFolder } from "../utils/s3-sdk";
import { v4 } from "uuid";
import { _updateFileOnWrite } from "../utils/supportFunctions";
import path from "path";
import { portSubdomainList } from "../utils/portSubdomainList";

const SUCCESS = true;

const PlaygroundSession = db.playground;

export const getHistory = async (req: Request, res: Response) => {
  const user = req.user._id.toString();
  const { prevLength } = req.query;
  try {
    const playgroundListData = await PlaygroundSession.find({
      user,
    })
      .sort({ updatedAt: -1 })
      .skip(Number(prevLength))
      .limit(5);
    res.json({
      list: playgroundListData,
      isMore:
        (await PlaygroundSession.count({
          user,
        })) >
        Number(prevLength) + 5,
    });
  } catch (error) {
    res.status(400).json({ message: "Something Went wrong", error });
  }
};
export const addToHistory = async (req: Request, res: Response) => {
  try {
    const { name, playgroundTypeId } = req.body;
    const user = req.user._id.toString(),
      createId = v4().replaceAll("-", "");
    const newPlayground = new PlaygroundSession({
      name,
      createId,
      user,
      playgroundTypeId,
      fileSnapshot: playgrounds
        .filter((p) => p.id === playgroundTypeId)[0]
        .fileSnapshot.map((p) => ({
          ...p,
          key: `sessionList/${createId}${p.key}`,
        })),
    });

    await newPlayground.save();
    const sourceFolder = `coreSetup/${playgroundTypeId}/`;
    const destinationFolder = `sessionList/${createId}/`;
    await replicateFolder(sourceFolder, destinationFolder);
    res.json({ SUCCESS, createId });
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: "Something Went wrong", error });
  }
};
export const updateS3File = async (req: Request, res: Response) => {
  try {
    const { key, file, port } = req.body;
    await putObjectAsText(key, file); // Update S3 file

    let keyFile = key.replace("sessionList/", "");
    console.log(keyFile);

    const filePath = path.resolve(
      __dirname,
      "../../../../mount/" + keyFile.split("-")[0]
    );
    _updateFileOnWrite(filePath, file);
    res.json({ SUCCESS });
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: "Something Went wrong", error });
  }
};
export const checkPreviewAvailable = async (
  currentSession: PlaygroundSessionInterface
) => {
  try {
    if (currentSession && currentSession._id) {
      let playgroundTypeId = currentSession.playgroundTypeId;
      let currentPlayground = playgrounds.filter(
        (e) => e.id == playgroundTypeId
      )[0];
      await dockerCreateContainer(
        currentPlayground.dockerImage,
        currentSession.createId + "-" + currentSession.port,
        currentSession.port,
        currentPlayground.exposedPort
      );
      let currPg = playgrounds.filter(
        (e) => e.id === currentSession.playgroundTypeId
      )[0];
      return {
        isPreviewAvailable: currPg.isPreviewAvailable,
        port: currentSession.port,
        initialCommand: currPg.initialCommand,
      };
    }
    return {
      isPreviewAvailable: false,
      port: 0,
      initialCommand: [],
    };
  } catch (error) {
    console.log(error);
    return {
      isPreviewAvailable: false,
      port: 0,
      initialCommand: [],
    };
  }
};
export const _updatePlaygroundFileSnapshot = async (
  createId: string,
  fileSnapshot: { key: string; isFolder: boolean }[]
) => {
  try {
    await PlaygroundSession.findOneAndUpdate({ createId }, { fileSnapshot });
  } catch (error) {
    new AppError("Something went wrong!", 400, error);
  }
};
export const updatePlaygroundSession = async (
  containerId: string,
  isDeleted: boolean,
  socketId: string
): Promise<PlaygroundSessionInterface | null> => {
  try {
    let { port, subDomain } = await _portFinder();
    let session: PlaygroundSessionInterface | null =
      await PlaygroundSession.findOneAndUpdate(
        { createId: containerId },
        { isDeleted, port, subDomain, socketId }
      );

    if (session && session._id) {
      session.port = port;
      session.subDomain = subDomain;
      return session;
    }

    return null;
  } catch (error) {
    new AppError("Something went wrong!", 400, error);
    return null;
  }
};
async function _portFinder() {
  let port =
    Math.floor(Math.random() * (3003 + portSubdomainList.length - 3003 + 1)) +
    3003;
  const portSubdomain = portSubdomainList.filter((e) => e.port === port)[0];
  let runningSession: PlaygroundSessionInterface | null =
    await PlaygroundSession.findOne({ port, isDeleted: false });
  if (runningSession && runningSession._id) return _portFinder();
  else return portSubdomain;
}
export const getPlaygroundFiles = async (createId: string) => {
  try {
    const playgroundListData = await PlaygroundSession.findOne({
      createId,
    });
    return playgroundListData && playgroundListData.fileSnapshot
      ? playgroundListData.fileSnapshot
      : null;
  } catch (error) {
    return null;
  }
};
async function cleanupInactiveSessions() {
  const inactiveThreshold = 20 * 60 * 1000; // 20 minutes in milliseconds

  try {
    const inactiveSessions = await PlaygroundSession.find({
      isDeleted: false,
      lastUpdateTime: { $lt: new Date(Date.now() - inactiveThreshold) },
    });

    inactiveSessions.forEach(async (session) => {
      await dockerDeleteContainer(session.createId + "-" + session.port);
      console.log(`Cleaning up session ${session._id}`);
    });

    // Update isDeleted flag for inactive sessions
    await PlaygroundSession.updateMany(
      {
        isDeleted: false,
        lastUpdateTime: { $lt: new Date(Date.now() - inactiveThreshold) },
      },
      {
        isDeleted: true,
      }
    );

    console.log("Scheduler Cleanup complete.");
  } catch (error) {
    console.error("Error cleaning up inactive sessions:", error);
  }
}

// Schedule session cleanup periodically (e.g., every 5 minutes) /  CRON JOB
// setInterval(cleanupInactiveSessions, 5 * 60 * 1000);
export const _getAllHistory = async () => {
  try {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000); // 20 min
    const playgroundListData = await PlaygroundSession.find({
      updatedAt: { $lt: twentyMinutesAgo },
      isDeleted: false,
    });
    return playgroundListData;
  } catch (error) {
    return [];
  }
};
