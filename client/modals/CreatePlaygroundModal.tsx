import { useState } from "react";
import axiosInstance from "@/utils/AxiosInstance";
import { useRouter } from "next/navigation";
import NormalMdSpinner from "@/components/Spinner/NormalMdSpinner";
type Props = {
  visible: boolean;
  onClose: () => void;
  title: string | undefined;
  id: string | undefined;
};

function CreatePlaygroundModal({ visible, onClose, title, id }: Props) {
  if (!visible) return <></>;

  const [name, setName] = useState("my-playground");
  const [isDisable, setIsDisable] = useState<boolean>(false);

  const router = useRouter();
  const handleOpenPrompt = async (id: string) => {
    try {
      setIsDisable(true);
      const response = await axiosInstance.post("api/playground", {
        name: name,
        playgroundTypeId: id,
      });
      setIsDisable(false);
      if (response.status === 200) {
        router.push(`/playground/${response.data.createId}`);
      }
    } catch (error) {
    } finally {
      onClose();
    }
  };
  return (
    <>
      <div
        id="modelConfirm"
        className="fixed block z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 "
      >
        <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
          <div className="flex justify-end p-2">
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="p-6 pt-0 ">
            <div className="flex flex-col">
              {isDisable ? (
                <div className="flex items-center mb-3">
                  <svg
                    className="w-8 h-8 text-brand-orange mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Creating a new playground for you. Please wait...</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <label className="text-md font-normal text-gray-500 mt-1 mb-2">
                    {title}
                  </label>
                  <input
                    type="text"
                    className="border border-gray-700 p-2 rounded mb-5"
                    placeholder="Enter Playground Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    autoFocus
                  />
                </div>
              )}
            </div>
            <div className="text-right">
              <a
                onClick={onClose}
                className="text-gray-900 cursor-pointer bg-white hover:text-brand-orange focus:ring-4 focus:to-brand-orange-s border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center mx-2"
                data-modal-toggle="delete-user-modal"
              >
                Cancel
              </a>
              <a
                onClick={() => {
                  if (!isDisable && id) handleOpenPrompt(id);
                }}
                className="text-white cursor-pointer bg-brand-orange hover:bg-brand-orange-s focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
              >
                {isDisable ? <NormalMdSpinner /> : "Create"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CreatePlaygroundModal;
