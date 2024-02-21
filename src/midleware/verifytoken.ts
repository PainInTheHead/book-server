import { myDataSource } from "./../../app-data-source";
import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/user.entity";
import { RequestWithUser } from "../Types/req.user";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "./errorHandler";
import { decodeToken } from "../utils/decoded";

export const verifyToken = async function (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new CustomError("Unauthorized action", StatusCodes.UNAUTHORIZED);
  }
  try {
    const decoded = decodeToken(token);
    const userId = decoded.userId;

    const userRepository = myDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new CustomError("Not found", StatusCodes.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
