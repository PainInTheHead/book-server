import { User } from "../entity/user.entity";
const jwt = require("jsonwebtoken");
import * as bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { myDataSource } from "../../app-data-source";
import { CustomError } from "../midleware/errorHandler";
import { RequestWithUser } from "../Types/req.user";

const userRepo = myDataSource.getRepository(User);

export const userRegister = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    const newUser = await userRepo.findOneBy({ email: email });
    if (newUser) {
      throw new CustomError("This user already exists", StatusCodes.CONFLICT);
    }
    const salt = bcrypt.genSaltSync(10);
    const user = myDataSource.getRepository(User).create({
      email: email,
      password: bcrypt.hashSync(password, salt),
    });
    await userRepo.save(user).then(() => console.log("User created"));
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const userLogin = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    const user = await userRepo.findOneBy({ email: email });
    if (!user) {
      throw new CustomError(
        "This user does not exist",
        StatusCodes.BAD_REQUEST
      );
    }
    const descryptPass = bcrypt.compareSync(password, user.password);
    if (!descryptPass) {
      throw new CustomError(
        "Invalid authentication details",
        StatusCodes.BAD_REQUEST
      );
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.SECRET_KEY,
      { expiresIn: 60 * 60 }
    );
    return res
      .status(200)
      .json({ token: `Bearer ${token}`, id: user.id, avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

export const userMakeAva = async function (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, avatar } = req.body;

    const user = await userRepo.findOneBy({ id: id });
    if (!user) {
      throw new CustomError("Authorisation Error", StatusCodes.UNAUTHORIZED);
    }
    user.avatar = avatar;
    await myDataSource.getRepository(User).save(user);
    res.status(200).json({ message: "Аватар изменен" });
  } catch (error) {
    next(error);
  }
};
