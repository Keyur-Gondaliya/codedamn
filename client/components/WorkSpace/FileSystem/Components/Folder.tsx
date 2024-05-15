import { useState } from "react";
import { Explorer } from "../Data/folderData";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import { setCurrentFile } from "@/redux/features/editor-slice";
import { getIconForFile } from "vscode-icons-js";

type Props = {
  explorer: Explorer;
  handleInsertNode: (folderId: string, item: string, isFolder: boolean) => void;
};

function Folder({ handleInsertNode, explorer }: Props) {
  const [expand, setExpand] = useState(explorer.id == "1");
  const dispatch = useDispatch<AppDispatch>();
  const currentOpenFile = useSelector(
    (state: RootState) => state.fileSystemReducer.currentFile
  );
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: false,
  });

  const handleNewFolder = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    current: Explorer,
    isFolder: boolean
  ) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };
  const onAddFolder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      handleInsertNode(explorer.id, e.currentTarget.value, showInput.isFolder);

      setShowInput({ ...showInput, visible: false });
    }
  };

  if (explorer.isFolder)
    return (
      <div className={`m-2 text-gray-300`} key={explorer.id} style={{}}>
        <div
          onClick={() => setExpand((prev) => !prev)}
          className={`folder cursor-pointer`}
        >
          {expand ? (
            <Image
              src="/down-arr.svg"
              height={10}
              width={10}
              alt="expand"
              className="ml-2 mr-1"
            />
          ) : (
            <Image
              src="/right-arr.svg"
              height={8}
              width={8}
              alt="collapse"
              className="ml-2 mr-1"
            />
          )}
          <div className="flex justify-between w-full">
            <span>
              {explorer.name}
              {explorer.name === "node_modules" && (
                <sup className="vs-file-title text-xs ml-1">(restricted)</sup>
              )}
            </span>
            {/* {explorer.id == "1" && (
              <div>
                <button
                  onClick={(e) => handleNewFolder(e, currentOpenFile, false)}
                  title="Currently Under Development use terminal to create new file"
                  style={{ height: "15px", width: "15px" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path
                      fill="rgb(238, 238, 238)"
                      d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleNewFolder(e, currentOpenFile, true)}
                  style={{ height: "15px", width: "15px" }}
                  className="ml-1"
                  title="Currently Under Development use terminal to create new folder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                      fill="rgb(238, 238, 238)"
                      d="M512 416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64V416zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24V312h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V200c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H168c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z"
                    />
                  </svg>
                </button>
              </div>
            )} */}
          </div>
        </div>
        <div style={{ display: expand ? "block" : "none" }} className="pl-6">
          {showInput.visible && (
            <div className="inputContainer">
              <span>{showInput.isFolder ? "📁" : "📄"}</span>
              <input
                type="text"
                className="inputContainer__input"
                autoFocus
                onKeyDown={onAddFolder}
                onBlur={() => setShowInput({ ...showInput, visible: false })}
              />
            </div>
          )}

          {explorer.items.map((item: Explorer) => (
            <Folder
              explorer={item}
              key={item.id}
              handleInsertNode={handleInsertNode}
            />
          ))}
        </div>
      </div>
    );
  else
    return (
      <span
        className="vs-file pl-4 text-gray-300 cursor-pointer"
        onClick={() => dispatch(setCurrentFile(explorer))}
        key={explorer.id}
        style={{
          backgroundColor:
            currentOpenFile?.id == explorer.id ? "rgb(255 255 255 / 0.17)" : "",
        }}
      >
        <span className="vs-file-icon">
          <Image
            src={`/icons/${
              explorer.name == "vite.config.js"
                ? "file_type_light_js.svg"
                : getIconForFile(explorer.name)
            }`}
            alt="file"
            width={15}
            height={15}
          />
        </span>
        <span className="vs-file-title">{explorer.name}</span>
      </span>
    );
}

export default Folder;
