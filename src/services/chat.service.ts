import ChatModel from "../models/chat.schema";
import UserModel from "../models/user.schema";
import { ChatInterface } from "../interfaces/chat.interface";

const newChat = async (body: ChatInterface) => {

  try {
    const newChat: any = new ChatModel(body);

    await newChat.save();

    body.users.forEach(async (id: any) => {
      let user = await UserModel.findById(id);
      if (user) {
        user.chats.push(newChat._id);
        await user.save();
      }
    });

    return newChat;
  } catch (error: any) {
    throw error;
  }
};

const getAllChats = async () => {
  try {
    const chats = await ChatModel.find()
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name" });
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
      .populate({ path: "users", select: "name" });
    return chat;
  } catch (error: any) {
    throw error;
  }
};

const getChatsUserById = async (userId: string) => {
  try {
    const chats = await ChatModel.find({ users: userId })
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name" });
    return chats;
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

export { newChat, getAllChats, getChatById, getChatsUserById, deleteChatById }