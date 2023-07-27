import ChatModel from "../models/chat.schema";
import UserModel from "../models/user.schema";
import { ChatInterface } from "../interfaces/chat.interface";
import { newMessage } from "./message.service";
import mongoose from "mongoose";

const newChat = async (body: ChatInterface) => {
  const { chat, message }: any = body
  try {
    if (!chat || !message) throw new Error("invalid data.");
    const newChat: any = new ChatModel(chat);
    await newChat.save();
    message.chatId = newChat._id
    await newMessage(message)
    chat.users.forEach(async (id: any) => {
      let user = await UserModel.findById(id);
      if (user) {
        user.chats.push(newChat._id);
        await user.save();
      }
    });
    const Res = await ChatModel.findById(newChat._id)
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name" })
      .populate({ path: "lastMessage" });
    return Res;
  } catch (error: any) {
    throw error;
  }
};

const getAllChats = async () => {
  try {
    const chats = await ChatModel.find()
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name" })
      .populate({ path: "lastMessage" });
    return chats;
  } catch (error: any) {
    throw error;
  }
};

const getChatById = async (chatId: string) => {
  try {
    const chat = await ChatModel.findByIdAndUpdate(chatId, {
      messageToView: false
    })
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name" })
      .populate({ path: "lastMessage" });
    return chat;
  } catch (error: any) {
    throw error;
  }
};

const getChatsUserById = async (userId: string) => {
  try {
    const chats = await ChatModel.find({ users: userId })
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name" })
      .populate({ path: "lastMessage" });
    return chats;
  } catch (error: any) {
    throw error;
  }
};

const getChatsUserByUsersName = async (users: Object) => {
  let { userId, secUserId }: any = users
  console.log(userId, secUserId)
  try {
    userId = new mongoose.Types.ObjectId(userId);
    secUserId = new mongoose.Types.ObjectId(secUserId);
    const chats = await ChatModel.find({
      users: {
        $all: [userId, secUserId]
      }
    })
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name" })
      .populate({ path: "lastMessage" });
    return chats[0];
  } catch (error: any) {
    throw error;
  }
};

const getChatsUserByName = async (userId: string, userName: string) => {
  try {
    let chats = await ChatModel.find({ users: userId })
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name" })
      .populate({ path: "lastMessage" });
    const newChats: any = [];
    for (let i = 0; i < chats.length; i++) {
      chats[i].users.forEach((el: any) => {
        if (el.name.toLocaleLowerCase().includes(userName.toLocaleLowerCase()) && el._id.toString() !== userId) {
          newChats.push(chats[i])
        }
      })
    }
    return newChats;
  } catch (error: any) {
    throw error;
  }
};

const deleteChatById = async (chatId: string) => {
  try {
    await ChatModel.findByIdAndDelete(chatId)
    return "Chat deleted successfully"
  } catch (error: any) {
    throw error;
  }
};

export {
  newChat,
  getAllChats,
  getChatById,
  getChatsUserById,
  getChatsUserByName,
  deleteChatById,
  getChatsUserByUsersName
}