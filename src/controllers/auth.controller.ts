import { Request, Response } from "express";
import UserModel from "../models/user.schema";
import { verifyToken } from "../utils/jwt.utils";

const logoutUser = async (req: Request, res: Response) => {
  try {
    req.logout(function (err) {
      if (err) {
        console.log(err);
      }
      return res.status(200).json({
        message: "Logout successful",
      });
    });
  } catch (error: any) {
    console.log(error);
    res.status(error.status ? error.status : 500).json({
      message: error.message,
    });
  }
};

const getAuthUser = async (req: Request, res: Response) => {
  try {
    if (!req.headers?.authorization) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const valueBearer = req.headers?.authorization?.split(" ").pop() as string;

    const verifyAccess: any = verifyToken(valueBearer);

    const user: any = await UserModel.findOne({ email: verifyAccess?.email })
      .select("-hash -salt")
      .populate({
        path: "token",
        select: "access refresh",
      });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const tokens = {
      access: user.token?.access,
      refresh: user.token?.refresh,
    };

    user.token = undefined;

    const userResponse = {
      user,
      access_token: tokens.access,
      refresh_token: tokens.refresh,
      token_type: "Bearer",
    };

    res.status(200).json(userResponse);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    res.status(error.status ? error.status : 500).json({
      message: error.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.find().populate({
      path: "chats",
    });
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(error.status ? error.status : 500).json({
      message: error.message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: any = await UserModel.findById(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(error.status ? error.status : 500).json({
      message: error.message,
    });
  }
};

const patchUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const user: any = await UserModel.findByIdAndUpdate(id, body);
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(error.status ? error.status : 500).json({
      message: error.message,
    });
  }
};

export { getAuthUser, logoutUser, getAllUsers, getUserById, patchUserById };
