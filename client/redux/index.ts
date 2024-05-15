import { configureStore } from "@reduxjs/toolkit";
import fileSystemReducer from "./features/editor-slice";
export const store: any = configureStore({
  reducer: {
    fileSystemReducer: fileSystemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
