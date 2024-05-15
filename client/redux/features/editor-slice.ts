import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  defaultExplorer,
  Explorer,
} from "@/components/WorkSpace/FileSystem/Data/folderData";

// Define the type for the initial state
interface EditorState {
  list?: Explorer;
  currentFile?: Explorer | null;
  port: number;
  initialCommand: string[];
  isContainerCreated: boolean;
  isContainerUpdated: boolean;
  isInitialCommandExecuted: boolean;
  isEditorReady: boolean;
  isBrowserReady: boolean;
}

// Define the initial state
const initialState: EditorState = {
  list: defaultExplorer,
  port: 0,
  initialCommand: [],
  isContainerCreated: false,
  isContainerUpdated: false,
  isInitialCommandExecuted: false,
  isEditorReady: false,
  isBrowserReady: false,
};

// Create a slice
const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    addFileList: (state, action: PayloadAction<Explorer>) => {
      state.list = action.payload;
    },
    setCurrentFile: (state, action: PayloadAction<Explorer | null>) => {
      state.currentFile = action.payload;
    },
    setPort: (state, action: PayloadAction<number>) => {
      state.port = action.payload;
    },
    setInitialCommand: (state, action: PayloadAction<string[]>) => {
      state.initialCommand = action.payload;
    },
    setIsContainerCreated: (state, action: PayloadAction<boolean>) => {
      state.isContainerCreated = action.payload;
    },
    setIsContainerUpdated: (state, action: PayloadAction<boolean>) => {
      state.isContainerUpdated = action.payload;
    },
    setIsInitialCommandExecuted: (state, action: PayloadAction<boolean>) => {
      state.isInitialCommandExecuted = action.payload;
    },
    setIsEditorReady: (state, action: PayloadAction<boolean>) => {
      state.isEditorReady = action.payload;
    },
    setIsBrowserReady: (state, action: PayloadAction<boolean>) => {
      state.isBrowserReady = action.payload;
    },
  },
});

// Extract the action creators and reducer
export const {
  addFileList,
  setCurrentFile,
  setPort,
  setInitialCommand,
  setIsContainerCreated,
  setIsBrowserReady,
  setIsContainerUpdated,
  setIsEditorReady,
  setIsInitialCommandExecuted,
} = workspaceSlice.actions;
let fileSystemReducer = workspaceSlice.reducer;
export default fileSystemReducer;
