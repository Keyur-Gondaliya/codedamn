"use client";
import { useEffect, useState } from "react";
import "./index.css";
import MonacoEditor from "@monaco-editor/react";
import config, { _getLanguageFromFileExtension } from "./config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  _updateResponseTextById,
  _uploadFileToS3,
} from "@/utils/AccessFunction";
import { addFileList, setIsEditorReady } from "@/redux/features/editor-slice";
import structuredClone from "@ungap/structured-clone";
import * as io from "socket.io-client";
import Topbar from "./Topbar/Topbar";
import axiosInstance from "@/utils/AxiosInstance";

type Props = {};
function EditorView({}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [language, setLanguage] = useState<string>("javascript");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isFirstTimeLoad, setIsFirstTimeLoad] = useState<boolean>(false);
  const port = useSelector((state: RootState) => state.fileSystemReducer.port);
  const currentOpenFile = useSelector(
    (state: RootState) => state.fileSystemReducer.currentFile
  );
  const totalFile = useSelector(
    (state: RootState) => state.fileSystemReducer.list
  );
  const [value, setValue] = useState<string>("");

  function handleEditorChange(value: string | undefined, ev: any) {
    setValue(value || "");
    setIsFirstTimeLoad(true);
  }
  useEffect(() => {
    const _socket = io.connect(process.env.NEXT_PUBLIC_BASE_URL || "");

    const debounceTimer = setTimeout(() => {
      if (
        totalFile &&
        currentOpenFile &&
        currentOpenFile.id &&
        isFirstTimeLoad
      ) {
        const updatedRoot = _updateResponseTextById(
          structuredClone(totalFile),
          currentOpenFile.id,
          value || ""
        );

        updateFile(currentOpenFile.key, value);
        if (updatedRoot) dispatch(addFileList(updatedRoot));
        setIsFirstTimeLoad(false);
      }
    }, 500);

    return () => {
      _socket.disconnect();
      clearTimeout(debounceTimer);
    };
  }, [value]);

  useEffect(() => {
    if (currentOpenFile && currentOpenFile.name) {
      const fileName = currentOpenFile.name;
      const fileExtension = fileName.split(".").pop() as string;
      const language = _getLanguageFromFileExtension(fileExtension);
      setLanguage(language);
      setValue(currentOpenFile.responseText);
    }
    dispatch(setIsEditorReady(true));
  }, [currentOpenFile]);
  function updateFile(key: string, file: string) {
    setIsUpdating(true);
    axiosInstance
      .put(`api/playground/file-update`, { key, file, port })
      .then((response) => {
        if (response.status === 200) {
        }
      })
      .catch((err) => {})
      .finally(() => {
        setIsUpdating(false);
      });
  }

  return (
    <div className="flex flex-col ">
      <Topbar
        isUpdating={isUpdating}
        fileName={
          currentOpenFile && (currentOpenFile.key.split("/").pop() as string)
        }
      />
      <MonacoEditor
        key={currentOpenFile && currentOpenFile.id}
        theme={config.defaultThemes[0]}
        path={language}
        value={value}
        onChange={handleEditorChange}
        defaultLanguage={language}
        options={config.options}
      />
    </div>
  );
}

export default EditorView;
