import NormalMdSpinner from "@/components/Spinner/NormalMdSpinner";

type Props = {};

function LoadingLeft({}: Props) {
  return (
    <div className="w-full h-full flex justify-center items-center bg-black">
      <div className="flex items-center">
        <NormalMdSpinner />
        <div className="text-white ml-2"> Hang on...</div>{" "}
      </div>
    </div>
  );
}

export default LoadingLeft;
