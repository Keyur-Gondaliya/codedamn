"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import * as io from "socket.io-client";
import { RootState } from "@/redux";
import {
  addFileList,
  setIsInitialCommandExecuted,
} from "@/redux/features/editor-slice";
import {
  _addNewFilesToFileSystem,
  _deleteFilesFromFileSystem,
} from "@/utils/AccessFunction";
import structuredClone from "@ungap/structured-clone";

type Props = {};
type FIleUpdate = {
  newFiles: { key: string; isFolder: boolean; responseText: string }[];
  deletedFiles: string[];
};
function Auth({}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const inputBuffer = useRef<string>("");
  const params = usePathname();
  const port = useSelector((state: RootState) => state.fileSystemReducer.port);
  const IsFSReady = useSelector(
    (state: RootState) => state.fileSystemReducer.isContainerUpdated
  );

  const dispatch = useDispatch();
  const [fileUpdate, setFileUpdate] = useState({
    newFiles: [],
    deletedFiles: [],
  });
  const finalFileSystem = useSelector(
    (state: RootState) => state.fileSystemReducer.list
  );

  const initialCommand = useSelector(
    (state: RootState) => state.fileSystemReducer.initialCommand
  );

  useEffect(() => {
    if (IsFSReady) {
      const _socket = io.connect(process.env.NEXT_PUBLIC_BASE_URL || "");

      if (ref.current) {
        const terminal = new Terminal({ fontSize: 12, rows: 8 });
        term.current = terminal;

        terminal.open(ref.current);
        _socket.emit("terminalStart", {
          containerName: params.replace("/playground/", "") + "-" + port,
        });
        if (initialCommand.length > 0) {
          let cmd = initialCommand.join(" && ");
          terminal.write(cmd);
          _socket.emit("terminalInitial", {
            containerName: params.replace("/playground/", "") + "-" + port,
            command: cmd + "\r",
          });
        }
        dispatch(setIsInitialCommandExecuted(true));
        let str = "";
        _socket.on("terminalResponse", (data: string) => {
          if (!str.includes(process.env.NEXT_PUBLIC_DOCKER_BASE_URL || "")) {
            str += data;
            terminal.clear();
          }

          terminal.write(data);
        });
        _socket.on("updateInFileSystem", (data) => {
          setFileUpdate(data);
        });
        let cmdStr: string[] = [];
        terminal.onKey((e) => {
          if (e.key === "\u007f") cmdStr.pop();

          if (
            !e.domEvent.altKey &&
            !e.domEvent.ctrlKey &&
            !e.domEvent.metaKey &&
            !e.domEvent.shiftKey
          ) {
            if (e.key === "\r") {
              _socket.emit("terminal", {
                containerName: params.replace("/playground/", "") + "-" + port,
                command: cmdStr.join("").trim() === "exit" ? "\u0003" : e.key,
              });
              cmdStr = [];
            } else {
              cmdStr.push(e.key);
              _socket.emit("terminal", {
                containerName: params.replace("/playground/", "") + "-" + port,
                command: e.key,
              });
            }
          } else {
            cmdStr = [];
            if (e.domEvent.ctrlKey && e.domEvent.key == "d") {
            } else {
              _socket.emit("terminal", {
                containerName: params.replace("/playground/", "") + "-" + port,
                command: e.key,
              });
            }
          }
        });
        const handleResize = (height: number) => {
          if (ref && ref.current) {
            const rows = Math.floor(height / 12);
            terminal.resize(terminal.cols, rows);
          }
        };
        // Create a ResizeObserver
        const resizeObserver = new ResizeObserver((entries) => {
          if (entries && entries.length > 0) {
            const { height } = (entries[0] && entries[0].contentRect) || {
              height: 96,
            };
            handleResize(height);
          }
        });
        resizeObserver.observe(ref.current);
        return () => {
          if (terminal) {
            terminal.dispose();
            _socket.off("terminalResponse");
            _socket.off("updateInFileSystem");
            _socket.disconnect();
          }
        };
      }
    }
  }, [IsFSReady]);
  useEffect(() => {
    if (fileUpdate.newFiles.length > 0 || fileUpdate.deletedFiles.length > 0) {
      let addUpdated = _addNewFilesToFileSystem(
        structuredClone(finalFileSystem),
        fileUpdate.newFiles
      );
      let fullUpdateDone = _deleteFilesFromFileSystem(
        structuredClone(addUpdated),
        fileUpdate.deletedFiles
      );

      dispatch(addFileList(fullUpdateDone));
    }
  }, [fileUpdate]);

  return <div className="overflow-y-scroll" ref={ref}></div>;
}

export default Auth;
