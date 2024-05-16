import { useEffect, useState } from "react";
import { defaultExplorer } from "./Data/folderData";
import Folder from "./Components/Folder";
import "./index.css";
import * as io from "socket.io-client";
import useTraverseTree from "@/hooks/useTraverseTree";
import { usePathname } from "next/navigation";
import {
  _addNewFilesToFileSystem,
  _deleteFilesFromFileSystem,
  convertS3KeysToFileSystem,
} from "@/utils/AccessFunction";
import NormalMdSpinner from "@/components/Spinner/NormalMdSpinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  addFileList,
  setIsContainerUpdated,
} from "@/redux/features/editor-slice";
type Props = {};
function FileSystem({}: Props) {
  const params = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [explorer, setExplorer] = useState(defaultExplorer);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const port = useSelector((state: RootState) => state.fileSystemReducer.port);
  const list = useSelector((state: RootState) => state.fileSystemReducer.list);

  const { insertNode } = useTraverseTree();
  useEffect(() => {
    const _socket = io.connect(process.env.NEXT_PUBLIC_BASE_URL || "");
    if (port !== 0) {
      _socket.emit(
        "getFiles",
        { id: params.replace("/playground/", ""), port },
        async (
          fileSystem: { key: string; url: string; responseText: string }[]
        ) => {
          let finalFileSystem = convertS3KeysToFileSystem(fileSystem);
          dispatch(addFileList(finalFileSystem));
          setExplorer(finalFileSystem);
          setIsLoaded(true);
          dispatch(setIsContainerUpdated(true));
        }
      );
    }

    return () => {
      _socket.disconnect();
    };
  }, []);

  const handleInsertNode = (
    folderId: string,
    item: string,
    isFolder: boolean
  ) => {
    const finalTree = insertNode(explorer, folderId, item, isFolder);
    setExplorer(finalTree);
  };
  return (
    <div className="bg-dark-layer-2 overflow-y-scroll overflow-x-hidden">
      {isLoaded ? (
        <Folder explorer={list} handleInsertNode={handleInsertNode} />
      ) : (
        <div className="h-full w-full flex justify-center items-center content-center">
          <NormalMdSpinner />
        </div>
      )}
    </div>
  );
}

export default FileSystem;
