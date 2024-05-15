import NormalMdSpinner from "@/components/Spinner/NormalMdSpinner";
import { RootState } from "@/redux";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function StagesRight() {
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
  let data = [
    { status: isContainerCreated, title: "Adding Your Container Request" },
    { status: isContainerUpdated, title: "Getting Your Dedicated Container" },
    { status: isInitialCommandExecuted, title: "Connecting to your Container" },
    { status: isEditorReady, title: "Setting Up your Editor" },
    { status: isBrowserReady, title: "Finalizing Your Playground" },
  ];
  useEffect(() => {}, [
    isBrowserReady,
    isContainerCreated,
    isContainerUpdated,
    isEditorReady,
    isInitialCommandExecuted,
  ]);

  return (
    <div className="w-full h-full flex justify-center items-center bg-black flex-col gap-2">
      <div className="flex flex-col gap-3">
        {data.map((e) => (
          <StageRightComponent
            status={e.status}
            title={e.title}
            key={e.title}
          />
        ))}
      </div>
    </div>
  );
}
type Props = { status: boolean; title: string };

export default StagesRight;
const StageRightComponent = ({ status, title }: Props) => (
  <div className="flex items-center">
    {status ? (
      <Image src="/correct.svg" height={15} width={15} alt="correct" />
    ) : (
      <NormalMdSpinner />
    )}
    <div className={`text-${status ? "white" : "dark-label-2"} ml-2`}>
      {" "}
      {title}
    </div>{" "}
  </div>
);
