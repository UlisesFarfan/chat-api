import { Request, Response } from "express";

import { newMessage, deleteMessageById } from "../services/message.service";

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

const deleteMessageByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteMessageById(id);
    res.status(201).json({
      message: "delete successfully"
    })
  } catch (error: any) {
    res.status(error.status ? error.status : 500).json({
      message: error.message,
    });
  }
}

export {
  newMessageController,
  deleteMessageByIdController
};