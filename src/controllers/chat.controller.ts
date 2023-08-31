import { Request, Response } from "express";
import {
  newChat,
  getAllChats,
  getChatById,
  getChatsUserById,
  getChatsUserByName,
  getChatsUserByUsersName,
  putArchiveChat,
  deletUserChat,
  deleteChatById,
  deletUserArchiveChat,
} from "../services/chat.service";


const createChat = async (req: Request, res: Response) => {
  try {
    const chat = await newChat(req.body);
    res.status(200).json(chat);
  } catch (error: any) {
    if (error.message.includes("1")) {
      res.status(403).json({
        message: "Invalid data."
      });
    }
    if (error.message.includes("2")) {
      res.status(400).json({
        message: "This user has blocked you."
      });
    }
  };
};

const getAllChatsController = async (req: Request, res: Response) => {
  try {
    const chats = await getAllChats();
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  };
};

const getChatByIdController = async (req: Request, res: Response) => {
  try {
    const { id }: any = req.params;
    const chat = await getChatById(id);
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json(error);
  };
};

const getChatsUserByIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const chats = await getChatsUserById(userId);

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  };
};

const getChatsUserByUsersNameController = async (req: Request, res: Response) => {
  try {
    const { userId, secUserId } = req.query;
    if (typeof userId !== "string" || typeof secUserId !== "string") throw { message: "invalid data" };
    const chats = await getChatsUserByUsersName(userId, secUserId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  };
};

const putArchiveChatController = async (req: Request, res: Response) => {
  try {
    const { chatId, userId, action } = req.query;
    if (typeof userId !== "string" || typeof chatId !== "string" || typeof action !== "string") throw { message: "invalid data" }
    const chats = await putArchiveChat(userId, chatId, action);
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  };
};

const getChatsUserByNameController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { userName, type } = req.query;
    const userNameSearch = typeof userName === "string" ? userName : "";
    if (typeof type !== "string") return "Invalid Data."
    const chats = await getChatsUserByName(userId, userNameSearch, type);
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  };
};

const deleteChatByIdController = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.query;
    if (typeof (chatId) !== "string") throw { message: "Invalid data" }
    const chats = await deleteChatById(chatId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  };
};

const deleteUserChatByIdController = async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.query;
    if (typeof (userId) !== "string" || typeof (chatId) !== "string") throw { message: "Invalid data" }
    const chats = await deletUserChat(userId, chatId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  };
};

const deletUserArchiveChatByIdController = async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.query;
    if (typeof (userId) !== "string" || typeof (chatId) !== "string") throw { message: "Invalid data" }
    const chats = await deletUserArchiveChat(userId, chatId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  };
};


export {
  createChat,
  getAllChatsController,
  getChatByIdController,
  getChatsUserByIdController,
  getChatsUserByNameController,
  deleteChatByIdController,
  getChatsUserByUsersNameController,
  putArchiveChatController,
  deleteUserChatByIdController,
  deletUserArchiveChatByIdController
}