import { Request, Response } from "express";

import { newMessage } from "../services/message.service";

const newMessageController = async (req: Request, res: Response) => {
    try {
        const message = await newMessage(req.body);
        res.status(201).json({
            message,
        });
    } catch (error: any) {
        console.log(error);
        res.status(error.status ? error.status : 500).json({
            message: error.message,
        });
    }
};

export { newMessageController };