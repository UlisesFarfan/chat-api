import ChatModel from "../models/chat.schema";
import UserModel from "../models/user.schema";
import { ChatInterface } from "../interfaces/chat.interface";

const newChat = async (body: ChatInterface) => {

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
};

const getAllChats = async () => {
  const chats = await ChatModel.find()
    .populate({ path: "messagesId" })
    .populate({ path: "users", select: "name" });
  return chats;
};

const getChatById = async (chatId: string) => {
  const chat = await ChatModel.findByIdAndUpdate(chatId, {
    messageToView: false
  })
    .populate({ path: "messagesId" })
    .populate({ path: "users", select: "name" });
  return chat;
};

const getChatsUserById = async (userId: string) => {
  const chats = await ChatModel.find({ users: userId })
    .populate({ path: "messagesId" })
    .populate({ path: "users", select: "name" });
  return chats;
};

export { newChat, getAllChats, getChatById, getChatsUserById }