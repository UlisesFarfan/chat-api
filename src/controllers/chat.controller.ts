import { Request, Response } from "express";
import { newChat, getAllChats, getChatById, getChatsUserById } from "../services/chat.service";

const createChat = async (req: Request, res: Response) => {
    try {
        const chat = await newChat(req.body);
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getAllChatsController = async (req: Request, res: Response) => {
    try {
        const chats = await getAllChats();
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getChatByIdController = async (req: Request, res: Response) => {
    try {
        const { id }: any = req.params;
        const chat = await getChatById(id);
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getChatsUserByIdController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const chats = await getChatsUserById(userId);
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json(error);
    }
}

export { createChat, getAllChatsController, getChatByIdController, getChatsUserByIdController }