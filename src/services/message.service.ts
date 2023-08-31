import MessageModel from "../models/message.schema";
import ChatModel from "../models/chat.schema";
import { MessageInterface } from "../interfaces/message.interface";
import UserModel from "../models/user.schema";
import mongoose, { Schema } from "mongoose";

const newMessage = async (body: MessageInterface) => {
  try {
    body.date = new Date()
    const newMessage = new MessageModel(body);

    await newMessage.save();

    const addMessageToChat = await ChatModel.findByIdAndUpdate(
      body.chatId,
      {
        $push: {
          messagesId: newMessage._id,
        },
        lastMessage: newMessage._id
      },
      { new: true }
    );

    if (addMessageToChat) {
      await addMessageToChat.save();
      for (let i = 0; i < addMessageToChat.users.length; i++) {
        const userChat = await UserModel.find({
          _id: addMessageToChat.users[i],
          chats: [addMessageToChat._id]
        })
        const userArchive = await UserModel.find({
          _id: addMessageToChat.users[i],
          archive_chats: [addMessageToChat._id]
        })
        if (userChat.length === 0 && userArchive.length === 0) {
          await UserModel.findByIdAndUpdate(addMessageToChat.users[i], {
            $addToSet: { chats: addMessageToChat._id }
          })
        }
      }
    }

    return newMessage;
  } catch (error: any) {
    throw error;
  }
};

const deleteMessageById = async (id: string) => {
  try {
    console.log(id)
    const a = await MessageModel.findByIdAndUpdate(id, {
      _delete: true
    })
    return "delete successfully"
  } catch (error: any) {
    throw error;
  }
}

export {
  newMessage,
  deleteMessageById,
}