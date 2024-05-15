import { Playground, playgrounds } from "@/utils/playgrounds";
import { useState } from "react";
import PlaygroundCard from "./PlaygroundCard";
import CreatePlaygroundModal from "@/modals/CreatePlaygroundModal";
type Props = {};
export interface PlaygroundModel {
  status: boolean;
  data: Playground;
}
function PlaygroundList({}: Props) {
  const [playgroundModel, setPlaygroundModel] = useState({
    status: false,
    data: playgrounds[0],
  });
  return (
    <div className="flex w-full justify-center flex-wrap">
      {playgrounds.map((e) => (
        <PlaygroundCard
          key={e.id}
          playground={e}
          setPlaygroundModel={setPlaygroundModel}
        />
      ))}
      {playgroundModel.status && playgroundModel.data && (
        <CreatePlaygroundModal
          key={playgroundModel.data.id}
          onClose={() =>
            setPlaygroundModel({ data: playgroundModel.data, status: false })
          }
          visible={playgroundModel.status}
          title={playgroundModel.data.title}
          id={playgroundModel.data.id}
        />
      )}
    </div>
  );
}

export default PlaygroundList;
