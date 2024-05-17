import cron from "node-cron";
import {
  _getAllHistory,
  updatePlaygroundSession,
} from "./controllers/playground";
import { dockerDeleteContainer } from "./utils/docker-sdk";
import { _excludeConfigForPort } from "./utils/nginx";
import { _deleteFilesOnInitiate } from "./utils/supportFunctions";
import path from "path";
import { _emitToSocketIDs } from "./listner/socketWorkspace";

cron.schedule("*/10 * * * *", async () => {
  //find records
  let sessionTimeoutList = await _getAllHistory();
  for (let index = 0; index < sessionTimeoutList.length; index++) {
    const { port, createId } = sessionTimeoutList[index];

    if (port && createId) {
      //delete container
      await dockerDeleteContainer(createId + "-" + port);
      const directoryPath = path.resolve(
        __dirname,
        "../../../../mount/" + createId
      );

      //delete mount for container
      _deleteFilesOnInitiate(directoryPath);

      //nginx reset
      _excludeConfigForPort(port);

      // update record
      await updatePlaygroundSession(createId, true, "");
    }
  }
  // send time out alert
  if (sessionTimeoutList && sessionTimeoutList.length > 0)
    _emitToSocketIDs(sessionTimeoutList.map((e) => e.socketId) as string[]);

  //   console.log("Running a task every 20 minutes", sessionTimeoutList);
});
console.log("Cron Jobs started");
