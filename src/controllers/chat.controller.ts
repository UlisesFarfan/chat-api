import { Request, Response } from "express";
import { newChat, getAllChats, getChatById, getChatsUserById, getChatsUserByName, getChatsUserByUsersName } from "../services/chat.service";


const createChat = async (req: Request, res: Response) => {
    try {
        const chat = await newChat(req.body);
        res.status(200).json(chat);
    } catch (error: any) {
        console.log(error)
        res.status(403).json({
            message: error.message
        });
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
        if (typeof userId !== "string" || typeof secUserId !== "string") throw { message: "invalid data" }
        const chats = await getChatsUserByUsersName({ userId: userId, secUserId: secUserId });
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json(error);
    };
};

const getChatsUserByNameController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { userName } = req.query;
        const userNameSearch = typeof userName === "string" ? userName : "";
        const chats = await getChatsUserByName(userId, userNameSearch);
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json(error);
    };
};

const deleteChatByIdController = async (req: Request, res: Response) => {
    try {
        const { userId, chatId } = req.query;
        if (typeof (userId) !== "string" || typeof (chatId) !== "string") throw { message: "Invalid data" }
        const chats = await getChatsUserById(userId);
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json(error);
    };
}

export { createChat, getAllChatsController, getChatByIdController, getChatsUserByIdController, getChatsUserByNameController, deleteChatByIdController, getChatsUserByUsersNameController }