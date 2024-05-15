import express from "express";
import { loggedIn } from "../validations/auth.validation";
import {
  addHistoryValidation,
  getHistoryValidation,
  uploadFileTOS3Validation,
} from "../validations/playground.validation";

import {
  addToHistory,
  getHistory,
  updateS3File,
} from "../controllers/playground";

const router = express.Router();
router.get("/", loggedIn, getHistoryValidation, getHistory);
router.post("/", loggedIn, addHistoryValidation, addToHistory);
router.put("/file-update", loggedIn, uploadFileTOS3Validation, updateS3File);

export default router;
