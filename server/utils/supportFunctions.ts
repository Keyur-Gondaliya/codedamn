import fs from "fs";
import path from "path";

export async function handleFileSelect(
  key: string,
  fileUrl: string,
  isFolder: boolean
) {
  try {
    const response = await fetch(fileUrl);
    const responseText = await response.text();
    return { key: key, url: fileUrl, responseText, isFolder };
  } catch (error) {
    console.error("Error fetching file data:", error);
    return { key: "", url: "", responseText: "", isFolder };
  }
}
export function _findNotCommonStrings(
  deletedFiles: { key: string; isFolder: boolean }[],
  oldRecord: { key: string; isFolder: boolean }[]
) {
  const deletedKeys = deletedFiles.map((item) => item.key);
  const uncommonRecords = oldRecord.filter(
    (record) => !deletedKeys.includes(record.key)
  );
  return uncommonRecords;
}
export function _findChanges(
  snapshot: { key: string; responseText: string; isFolder: boolean }[],
  oldRecord: { key: string; isFolder: boolean }[]
) {
  const snapshotKeys = snapshot.map((item) => item.key);
  const oldRecordKeys = oldRecord.map((item) => item.key);
  let nodeModulesAdded = false;
  const newFiles = snapshot.filter((item) => {
    if (item.key.includes("node_modules")) {
      if (nodeModulesAdded) return false;
      const nodeModulesExists = oldRecordKeys.some((key) =>
        key.includes("node_modules")
      );

      if (!nodeModulesExists) {
        nodeModulesAdded = true;
        return true;
      }
      return false;
    }
    return !oldRecordKeys.includes(item.key);
  });
  const deletedFiles = oldRecord.filter(
    (record) => !snapshotKeys.includes(record.key)
  );

  return {
    newFiles,
    deletedFiles,
  };
}
export function _deleteFilesOnInitiate(rootPath: string) {
  if (!fs.existsSync(rootPath)) {
    return;
  }
  const filesToDelete = fs.readdirSync(rootPath);
  filesToDelete.forEach((file) => {
    const filePath = rootPath + "/" + file;
    if (fs.statSync(filePath).isDirectory()) {
      fs.rm(filePath, { force: true, recursive: true }, (err) => {
        if (err) {
          throw err;
        }
      });
    } else {
      fs.unlinkSync(filePath);
    }
  });
}

export function _createFileOnInitiate(
  file: {
    key: string;
    isFolder: boolean;
    url: string;
    responseText: string;
  },
  rootPath: string
) {
  const filePath = rootPath + __getStringFromSecondSlashToEnd(file.key);
  const directoryPath = path.dirname(filePath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  if (!file.isFolder) {
    fs.writeFileSync(filePath, file.responseText);
  } else {
    fs.mkdirSync(filePath, { recursive: true });
  }
}
function __getStringFromSecondSlashToEnd(key: string) {
  const secondSlashIndex = key.indexOf("/", key.indexOf("/") + 1);
  return secondSlashIndex !== -1 ? key.substring(secondSlashIndex) : "";
}
export function _updateFileOnWrite(filePath: string, newContent: string) {
  try {
    fs.writeFileSync(filePath, newContent);
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error);
  }
}
