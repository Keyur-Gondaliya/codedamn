import { Explorer } from "@/components/WorkSpace/FileSystem/Data/folderData";
import jwt from "jsonwebtoken";

const tokenForUser = (user: any) => {
  const payload = {
    user: {
      _id: user._id,
    },
  };
  let JWT_SECRET = process.env.JWT_SECRET || "defaultjwtsecret";
  return jwt.sign(payload, JWT_SECRET, {});
};

export { tokenForUser };
export function convertS3KeysToFileSystem(
  keys: { key: string; url: string; responseText: string }[]
) {
  const fileSystem: Explorer = {
    id: "1",
    name: "codedamn-lite-workspace",
    isFolder: true,
    items: [],
    responseText: "",
    key: "",
  };

  keys.forEach((keyObject) => {
    const keyParts = keyObject.key.split("/");
    let currentDirectory = fileSystem;

    for (let i = 2; i < keyParts.length; i++) {
      const part = keyParts[i] as string;
      const isLastPart = i === keyParts.length - 1;
      const isFolder = isLastPart
        ? part.split(".").length == 1 && keyObject.responseText == ""
        : true;

      let item: Explorer | undefined = currentDirectory.items.find(
        (item) => item.name === part
      );

      if (!item) {
        item = {
          id: Math.random().toString(36).substr(2, 9), // Generate a random ID
          name: part,
          isFolder: isFolder,
          items: [],
          responseText: keyObject.responseText,
          key: keyObject.key,
        };
        currentDirectory.items.push(item);
        currentDirectory.items.sort((a, b) => {
          if (a.isFolder === b.isFolder) {
            return a.name.localeCompare(b.name);
          }
          return a.isFolder ? -1 : 1;
        });
      }

      if (isFolder) {
        currentDirectory = item;
      }
    }
  });

  return fileSystem;
}

export function _addNewFilesToFileSystem(
  existingFileSystem: Explorer,
  newFiles: { key: string; isFolder: boolean; responseText: string }[]
): Explorer {
  newFiles.forEach((newFile) => {
    const keyParts = newFile.key.split("/");
    let currentDirectory = existingFileSystem;

    for (let i = 2; i < keyParts.length; i++) {
      const part = keyParts[i] as string;
      const isLastPart = i === keyParts.length - 1;
      const isFolder = isLastPart ? newFile.isFolder : true; // Check if it's a folder or a file only for the last part

      let item: Explorer | undefined =
        currentDirectory &&
        currentDirectory.items.find((item) => item.name === part);

      if (!item) {
        item = {
          id: Math.random().toString(36).substr(2, 9), // Generate a random ID
          name: part,
          isFolder: isFolder,
          items: [],
          responseText: isFolder ? "" : newFile.responseText,
          key: newFile.key,
        };
        currentDirectory.items.push(item);
        currentDirectory.items.sort((a, b) => {
          if (a.isFolder === b.isFolder) {
            return a.name.localeCompare(b.name);
          }
          return a.isFolder ? -1 : 1;
        });
      }

      if (isFolder && !isLastPart) {
        currentDirectory = item;
      }
    }
  });

  return existingFileSystem;
}
export function _deleteFilesFromFileSystem(
  existingFileSystem: Explorer,
  deletedFiles: { key: string; isFolder: boolean }[]
): Explorer {
  deletedFiles.forEach((deletedFile) => {
    const keyParts = deletedFile.key.split("/");
    let currentDirectory = existingFileSystem;
    let parentDirectory: Explorer | undefined;

    for (let i = 2; i < keyParts.length; i++) {
      const part = keyParts[i] as string;
      const isLastPart = i === keyParts.length - 1;

      const itemIndex =
        currentDirectory &&
        currentDirectory.items.findIndex((item) => item.name === part);

      if (itemIndex !== -1) {
        const item = currentDirectory.items[itemIndex] as Explorer;

        if (isLastPart) {
          currentDirectory.items.splice(itemIndex, 1); // Remove the item
        } else {
          parentDirectory = currentDirectory;
          currentDirectory = item;
        }
      } else {
        break;
      }
    }
  });

  return existingFileSystem;
}

export function _updateResponseTextById(
  root: Explorer,
  id: string,
  responseText: string
): Explorer | null {
  if (root.id === id) {
    root.responseText = responseText;
    return root;
  }

  for (const item of root.items) {
    const updatedItem = _updateResponseTextById(item, id, responseText);
    if (updatedItem !== null) {
      return root;
    }
  }

  return null;
}

export async function _uploadFileToS3(presignedUrl: string, file: string) {
  try {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
    });

    if (response.ok) {
      // console.log("File uploaded successfully");
    } else {
      console.error("Failed to upload file:", response.statusText);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
