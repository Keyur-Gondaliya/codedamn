import { RootState } from "@/redux";
import { setIsBrowserReady } from "@/redux/features/editor-slice";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = { url: string; isTerminalOpen: boolean };

function Browser({ url, isTerminalOpen }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reload, setReload] = useState(1);
  const dispatch = useDispatch();
  const isInitialCommandExecuted = useSelector(
    (state: RootState) => state.fileSystemReducer.isInitialCommandExecuted
  );
  useEffect(() => {
    if (isInitialCommandExecuted) {
      const checkIframeLoaded = () => {
        if (!isLoaded) {
          // Reload the iframe after 2 second till page load.
          setReload((prev) => prev + 1);
          if (iframeRef && iframeRef.current) iframeRef.current.src = url;
          dispatch(setIsBrowserReady(true));
        }
      };
      const reloadInterval = setInterval(checkIframeLoaded, 2000);
      return () => clearInterval(reloadInterval);
    }
  }, [isLoaded, url, isInitialCommandExecuted]);

  const handleLoad = () => {
    setIsLoaded(true);
    dispatch(setIsBrowserReady(true));
  };

  return (
    <div className={`w-full flex flex-col ${!isTerminalOpen ? "hidden" : ""}`}>
      <div className="flex justify-center items-center py-1.5 bg-dark-layer-2 text-white">
        <div
          onClick={() => {
            iframeRef && iframeRef.current ? (iframeRef.current.src += "") : "";
            setReload((prev) => prev + 1);
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
          src={url}
          style={{
            width: "100%",
            height: "100%",
          }}
          className="border border-dark-divider-border-2"
          ref={iframeRef}
          onLoad={handleLoad}
          key={reload}
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
