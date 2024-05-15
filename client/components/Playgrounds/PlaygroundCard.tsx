"use client";
import { Playground } from "@/utils/playgrounds";
import { PlaygroundModel } from "./PlaygroundList";

type Props = {
  playground: Playground;
  setPlaygroundModel: (playground: PlaygroundModel) => void;
};

function PlaygroundCard({ playground, setPlaygroundModel }: Props) {
  return (
    <>
      <div
        className={`relative flex pl-11  w-full max-w-[22rem] flex-col  bg-dark-fill-2 bg-clip-border text-gray-700 shadow-none border-gray-400 rounded-md cursor-pointer m-2 hover:border-blue-600 border-transparent border-2 hover:border-current `}
        onClick={() => setPlaygroundModel({ status: true, data: playground })}
      >
        <div className="relative flex items-center gap-4 pt-0 pb-4 mx-0 mt-4 overflow-hidden text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border">
          <img
            src={playground.image}
            alt={playground.title}
            className="relative inline-block h-[30px] w-[30px] p-1 object-cover object-center bg-gray-400 rounded-md"
          />
          <div className="flex w-full flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <h5 className="block font-sans text-l antialiased font-semibold leading-snug tracking-normal text-white">
                {playground.title}
              </h5>
            </div>
            <p className="block font-sans text-sm antialiased font-light leading-relaxed text-gray-400">
              {playground.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaygroundCard;
