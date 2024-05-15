import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Credentials } from "@aws-sdk/types"; // Assuming the Credentials type is imported from @aws-sdk/types
import { Readable } from "stream"; // Assuming you want to use streams with fs
import fs from "fs";
import path from "path";

const client = new S3Client({
  region: process.env.S3_REGION || "",
  credentials: {
    accessKeyId: process.env.S3_ACCESSKEYID || "",
    secretAccessKey: process.env.S3_SECRETACCESSKEY || "",
  },
});
const bucketName = process.env.S3_BUCKETNAME || "";

export async function getSessionDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const url = await getSignedUrl(client, command);
    return url;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getObjectUrlsForFolder = async (folderKey: string) => {
  try {
    const { Contents } = await _getAllObjectUrl(folderKey);

    const urls = await _generatePresignedUrls(Contents as [{ Key: string }]);
    return urls;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
const _generatePresignedUrls = async (objects: [{ Key: string }]) => {
  const urls = [];
  for (const object of objects) {
    urls.push({
      key: object.Key,
      url: await getSessionDownloadUrl(object.Key),
    });
  }
  return urls;
};
async function _getAllObjectUrl(filename: string) {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: filename,
  });
  return await client.send(command);
}
export async function _deleteFileByKey(
  data: {
    key: string;
    isFolder: boolean;
  }[]
) {
  for (const record of data) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: record.key,
    });

    try {
      await client.send(command);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
}

export async function putObjectAsText(key: string, file: string) {
  const type = await _getObjectMetadata(key);
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: type,
    })
  );
}
export async function putObjectUrl(key: string) {
  const type = await _getObjectMetadata(key);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: type,
  });
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return url;
}
async function _getObjectMetadata(key: string) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new HeadObjectCommand(params);

  try {
    const { ContentType } = await client.send(command);
    return ContentType;
  } catch (err) {
    console.error("Error getting object metadata:", err);
    throw err;
  }
}
export async function replicateFolder(
  sourceFolder: string,
  destinationFolder: string
) {
  try {
    const objectKeys: (string | undefined)[] =
      await _listObjectsInFolder(sourceFolder);
    for (const key of objectKeys) {
      if (key) {
        const destinationKey = key.replace(sourceFolder, destinationFolder);
        await _copyObjectInBucket(key, destinationKey);
      }
    }
    // console.log("Folder replicated successfully.");
  } catch (err) {
    console.error("Error replicating folder:", err);
  }
}
async function _listObjectsInFolder(folderName: string) {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: folderName,
  });
  try {
    const response = await client.send(command);
    if (response && response.Contents)
      return response.Contents.map((obj) => obj.Key);
    else return [];
  } catch (err) {
    console.error("Error listing objects:", err);
    return [];
  }
}

async function _copyObjectInBucket(sourceKey: string, destinationKey: string) {
  const command = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${sourceKey}`,
    Key: destinationKey,
  });
  try {
    const response = await client.send(command);
    // console.log(`Object copied successfully: ${response.CopyObjectResult}`);
  } catch (err) {
    console.error("Error copying object:", err);
    throw err;
  }
}
export async function _uploadFilesToS3(
  files: { key: string; responseText: string }[]
) {
  try {
    for (const { key, responseText } of files) {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: responseText,
      });

      await client.send(command);
    }
  } catch (err) {
    console.error("Error uploading files:", err);
  }
}

// --------------------------------- Upload Static folder from local to s3 --------------------------------------
// const uploadFoldertoS3 = async ({
//   local_folder,
//   remote_folder,
// }: {
//   local_folder: string;
//   remote_folder: string;
// }) => {
//   fs.readdir(local_folder, async (error, contents) => {
//     if (error) throw error;
//     if (!contents || contents.length === 0) return;

//     for (const content of contents) {
//       const content_path = path.join(local_folder, content);
//       console.log(content_path);

//       if (fs.lstatSync(content_path).isDirectory()) {
//         await uploadFoldertoS3({
//           local_folder: content_path,
//           remote_folder: path.join(remote_folder, content),
//         });
//       } else {
//         fs.readFile(content_path, async (error, file_content) => {
//           await client.send(
//             new PutObjectCommand({
//               Bucket: "letscode-keyur-gondaliya-private",
//               Key: path.join(remote_folder, content),
//               Body: file_content,
//             })
//           );
//         });
//       }
//     }
//   });
// };

// (async () => {
//   await uploadFoldertoS3({
//     local_folder: "./node",
//     remote_folder: "coreSetup/node",
//   });
// })();
