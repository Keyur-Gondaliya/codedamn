"use client";
import Split from "react-split";
import { useEffect, useState } from "react";
import FileSystem from "./FileSystem/FileSystem";
import PlayGround from "./PlayGround/PlayGround";
import * as io from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import Browser from "./Browser/Browser";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentFile,
  setInitialCommand,
  setIsBrowserReady,
  setIsContainerCreated,
  setIsContainerUpdated,
  setIsEditorReady,
  setIsInitialCommandExecuted,
  setPort,
} from "@/redux/features/editor-slice";
import StagesRight from "./LoadingStages/StagesRight";
import LoadingLeft from "./LoadingStages/LoadingLeft";
import { RootState } from "@/redux";
type Props = {};
interface ContainerStat {
  isPreviewAvailable: boolean;
  port: number;
  subDomain: string;
  initialCommand: string[];
}
function WorkSpace({}: Props) {
  const params = usePathname();
  const router = useRouter();
  const [containerStat, setContainerStat] = useState<ContainerStat>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const isContainerCreated = useSelector(
    (state: RootState) => state.fileSystemReducer.isContainerCreated
  );
  const isContainerUpdated = useSelector(
    (state: RootState) => state.fileSystemReducer.isContainerUpdated
  );
  const isInitialCommandExecuted = useSelector(
    (state: RootState) => state.fileSystemReducer.isInitialCommandExecuted
  );
  const isEditorReady = useSelector(
    (state: RootState) => state.fileSystemReducer.isEditorReady
  );
  const isBrowserReady = useSelector(
    (state: RootState) => state.fileSystemReducer.isBrowserReady
  );
  const isReady =
    isContainerCreated &&
    isContainerUpdated &&
    isInitialCommandExecuted &&
    isEditorReady &&
    isBrowserReady;
  useEffect(() => {
    let port = 0;
    const _socket = io.connect(process.env.NEXT_PUBLIC_BASE_URL || "");
    _socket.emit(
      "newContainer",
      params.replace("/playground/", ""),
      (e: ContainerStat) => {
        if (e.port === 0)
          toast.error("Something Went wrong!, please try again letter.");
        setContainerStat(e);
        setIsTerminalOpen(e.isPreviewAvailable);
        dispatch(setPort(e.port));
        dispatch(setInitialCommand(e.initialCommand));
        dispatch(setIsContainerCreated(true));
        if (!e.isPreviewAvailable) {
          dispatch(setIsBrowserReady(true));
        }
        port = e.port;
        setIsLoaded(true);
      }
    );
    _socket.on("terminatedPlayground", () => {
      router.replace("/");
      toast.error("Session Timeout.");
    });
    window.addEventListener("beforeunload", () => {
      dispatch(setIsBrowserReady(false));
      dispatch(setIsContainerCreated(false));
      dispatch(setIsContainerUpdated(false));
      dispatch(setIsEditorReady(false));
      dispatch(setIsInitialCommandExecuted(false));
      if (port !== 0)
        _socket.emit("disconnectUser", {
          containerId: params.replace("/playground/", ""),
          port: port,
        });
    });

    return () => {
      if (port !== 0)
        _socket.emit("disconnectUser", {
          containerId: params.replace("/playground/", ""),
          port: port,
        });
      dispatch(setIsBrowserReady(false));
      dispatch(setIsContainerCreated(false));
      dispatch(setIsContainerUpdated(false));
      dispatch(setIsEditorReady(false));
      dispatch(setIsInitialCommandExecuted(false));
      dispatch(setCurrentFile(null));

      _socket.disconnect();
    };
  }, []);

  if (isLoaded)
    return (
      <>
        <Split
          className={`h-[calc(100%-50px)] ${!isReady ? "split" : "hidden"}`}
          gutterSize={2}
          sizes={[35, 65]}
          minSize={30}
        >
          <LoadingLeft />
          <StagesRight />
        </Split>
        <div
          className={`flex flex-col h-[calc(100%-50px)] ${isReady ? "" : "hidden"}`}
        >
          <Split
            className={`h-[calc(100%-0px)] ${isReady ? "split" : "hidden"}`}
            gutterSize={2}
            sizes={isTerminalOpen ? [25, 50, 25] : [25, 75, 0]}
            minSize={2}
          >
            <FileSystem />
            <PlayGround />
            {containerStat && containerStat.subDomain && (
              <Browser
                url={containerStat.subDomain}
                isTerminalOpen={isTerminalOpen}
              />
            )}
          </Split>
          <div className="w-full flex flex-row-reverse h-[25px] bg-black/60 border-dark-layer-1 border-t">
            <button
              className="border-l text-dark-label-2 rounded-md border-dark-gray-6 text-xs px-2"
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            >
              Browser
            </button>
          </div>
        </div>
      </>
    );
}

export default WorkSpace;
