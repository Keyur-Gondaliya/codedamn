import { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { ZodInputValidation } from "../utils/error";

const querySchema = z.object({
  prevLength: z.string().trim().min(1),
});
export const getHistoryValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    querySchema.parse(req.query);
    next();
  } catch (error: any) {
    return res.status(400).json(ZodInputValidation(error));
  }
};

const addPlaygroundSchema = z.object({
  name: z.string().trim().min(1),
  playgroundTypeId: z.string().trim().min(1),
});
export const addHistoryValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    addPlaygroundSchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json(ZodInputValidation(error));
  }
};

const uploadFileTOS3Schema = z.object({
  port: z.number().int().nonnegative(),
  key: z.string().trim().min(1),
  file: z.string().trim().min(1),
});
export const uploadFileTOS3Validation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {} = req.body;

    uploadFileTOS3Schema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json(ZodInputValidation(error));
  }
};
