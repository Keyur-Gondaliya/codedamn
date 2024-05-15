import Image from "next/image";

type Props = { isUpdating: boolean; fileName: string };

function Topbar({ isUpdating, fileName }: Props) {
  return (
    <div className="h-[20px] w-full flex justify-between pr-4 bg-dark-layer-2  border-dark-layer-1 ">
      <div className="text-dark-label-2 text-[12px] bg-[#1e1e1e] flex flex-col justify-center border-l border-r border-t border-dark-layer-1 pl-2 pr-8">
        {fileName}
      </div>
      <div>
        {isUpdating ? (
          <Image
            src="/active.svg"
            height={17}
            width={17}
            alt="updating"
            title="Updating"
          />
        ) : (
          <Image
            src="/saved.svg"
            height={20}
            width={20}
            alt="saved"
            title="Up-to-Date saved!"
          />
        )}
      </div>
    </div>
  );
}

export default Topbar;
