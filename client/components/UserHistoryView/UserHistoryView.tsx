"use client";
import NormalMdSpinner from "@/components/Spinner/NormalMdSpinner";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/AxiosInstance";
import HistoryTable from "@/components/UserHistoryView/HistoryTable";
import { Playground } from "@/app/page";

type Props = {};

function UserHistoryView({}: Props) {
  const [userHistory, setUserHistory] = useState<Playground[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);

  const [isMore, setIsMore] = useState<boolean>(false);
  useEffect(() => {
    getUserHistory(0, true);
  }, []);
  function getUserHistory(currentLength: number, isFirst: boolean) {
    setIsDisabled(true);
    axiosInstance
      .get(`api/playground?prevLength=${currentLength}`)
      .then((response) => {
        if (response.status === 200) {
          setUserHistory([...userHistory, ...response.data.list]);
          setIsMore(response.data.isMore);
        }
      })
      .finally(() => {
        setIsLoaded(true);
        setIsDisabled(false);
        if (isFirst) setIsInitialLoaded(true);
      });
  }

  if (!isInitialLoaded)
    return (
      <div className="flex justify-center h-full items-center mt-20">
        <NormalMdSpinner />
      </div>
    );
  if (userHistory.length > 0)
    return (
      <div className="relative overflow-x-auto mx-auto px-6 pb-10">
        <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
          {isLoaded && (
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
              <tr>
                <th
                  scope="col"
                  colSpan={8}
                  className="px-1 py-3 w-0 font-medium"
                >
                  Manage playgrounds
                </th>
              </tr>
            </thead>
          )}
          <HistoryTable userHistory={userHistory} />
          {isMore && (
            <tfoot className="text-xs text-gray-700 underline dark:text-gray-400 text-center ">
              <tr>
                <th
                  scope="col"
                  colSpan={8}
                  className="px-1 py-3 w-0 font-medium hover:text-blue-50 cursor-pointer"
                  onClick={() => {
                    if (!isDisabled) getUserHistory(userHistory.length, false);
                  }}
                >
                  {isDisabled ? <NormalMdSpinner /> : "See More"}
                </th>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
}

export default UserHistoryView;
