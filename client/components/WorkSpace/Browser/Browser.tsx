import { RootState } from "@/redux";
import { setIsBrowserReady } from "@/redux/features/editor-slice";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = { url: string; isTerminalOpen: boolean };
type CurrentLink = { link: string; isStarted: boolean };
function Browser({ url, isTerminalOpen }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reload, setReload] = useState(1);
  const dispatch = useDispatch();
  const [currentUrl, setCurrentUrl] = useState<CurrentLink>({
    link: url,
    isStarted: false,
  });
  const isInitialCommandExecuted = useSelector(
    (state: RootState) => state.fileSystemReducer.isInitialCommandExecuted
  );

  useEffect(() => {
    if (isInitialCommandExecuted) {
      if (!currentUrl.isStarted) {
        const checkIframeLoaded = async () => {
          // Reload the iframe after 2 second till page load.
          await _checkStatus();
          dispatch(setIsBrowserReady(true));
        };
        const reloadInterval = setInterval(checkIframeLoaded, 2000);
        return () => clearInterval(reloadInterval);
      }
    }
  }, [url, isInitialCommandExecuted, currentUrl.isStarted]);

  const handleLoad = async (e: any) => {
    dispatch(setIsBrowserReady(true));
  };
  async function _checkStatus() {
    setReload((prev) => prev + 1);

    let currentUrlTemp = url + "?reload=" + reload;
    try {
      let res = await fetch(currentUrlTemp, {
        credentials: "omit",
        method: "GET",
        mode: "cors",
      });
      if (res.headers.get("x-Server-Status") === "Started") {
        if (!currentUrl.isStarted)
          setCurrentUrl({ link: currentUrlTemp, isStarted: true });
      } else {
        if (currentUrl.isStarted)
          setCurrentUrl({ link: currentUrlTemp, isStarted: false });
      }
    } catch (error) {
      setCurrentUrl({ link: url, isStarted: false });
    }
  }
  return (
    <div className={`w-full flex flex-col ${!isTerminalOpen ? "hidden" : ""}`}>
      <div className="flex justify-center items-center py-1.5 bg-dark-layer-2 text-white">
        <div
          onClick={async () => {
            setReload((prev) => prev + 1);
            await _checkStatus();
          }}
          className="p-1 cursor-pointer mx-1.5"
        >
          <Image src="/reload.svg" height={18} width={18} alt="reload" />
        </div>
        <div className=" border border-dark-divider-border-2 rounded-md font-sans text-xs px-3 py-1.5 w-full mr-1 bg-dark-layer-1">
          {url}
        </div>
        <div className="pr-2">
          <a href={url} target="_blank">
            <Image src="/openUrl.svg" height={20} width={20} alt="redirect" />
          </a>
        </div>
      </div>

      {process.env.NEXT_PUBLIC_IS_LIVE &&
      process.env.NEXT_PUBLIC_IS_LIVE == "false" ? (
        <iframe
          title="browser-frame"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
          className="border border-dark-divider-border-2"
          ref={iframeRef}
          onLoad={handleLoad}
          src={currentUrl.link}
        ></iframe>
      ) : (
        <div className="flex justify-center items-center h-full w-full p-5 m-5 text-dark-gray-8">
          <p>
            Browser security blocks preview from HTTPS to HTTP. Please open in{" "}
            <a
              href={url}
              target="_blank"
              className="text-blue-500 hover:text-blue-800"
            >
              new tab
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}

export default Browser;
