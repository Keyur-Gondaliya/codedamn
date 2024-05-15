import { Playground } from "@/app/page";
import { playgrounds } from "@/utils/playgrounds";
import { getTimeDifference } from "@/utils/dateFormate";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface UserHistory {
  userHistory: Playground[];
}
const HistoryTable = ({ userHistory }: UserHistory) => {
  const router = useRouter();

  return (
    <>
      <tbody className="text-white">
        {userHistory &&
          userHistory.map((problem: Playground, idx: number) => (
            <tr
              className={`${idx % 2 == 1 ? "bg-dark-layer-1" : "bg-dark-layer-2"} cursor-pointer`}
              key={problem._id}
              onClick={() => {
                router.push(`/playground/${problem.createId}`);
              }}
            >
              <td className="px-6 py-4 w-20">
                <Image
                  src={
                    playgrounds && playgrounds.length > 0
                      ? (playgrounds[+problem.playgroundTypeId - 1]
                          ?.image as string)
                      : ""
                  }
                  height={25}
                  width={25}
                  alt={problem.playgroundTypeId}
                />
              </td>

              <td className="px-6 py-4 w-60" colSpan={6}>
                {problem.name}
              </td>

              <td className={"px-6 py-4 w-40"} colSpan={1}>
                {getTimeDifference(problem.updatedAt).count}{" "}
                {getTimeDifference(problem.updatedAt).format} {" ago"}
              </td>
            </tr>
          ))}
      </tbody>
    </>
  );
};
export default HistoryTable;
