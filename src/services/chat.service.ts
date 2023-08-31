import ChatModel from "../models/chat.schema";
import UserModel from "../models/user.schema";
import { ChatInterface } from "../interfaces/chat.interface";
import { newMessage } from "./message.service";
import mongoose from "mongoose";

const newChat = async (body: ChatInterface) => {
  const { chat, message }: any = body
  try {
    let isBlock = false;
    if (!chat || !message) throw new Error("1");
    const existChat = await ChatModel.find({
      users: chat.users
    })
    for (let i = 0; i < chat.users.length; i++) {
      const user = await UserModel.findById(chat.users[i])
      user?.blocked.map((el) => {
        if (el.toString() === chat.users[0] || el.toString() === chat.users[1]) isBlock = true;
      })
    }
    if (!existChat[0] && isBlock) {
      throw new Error("2")
    }
    if (existChat[0]) {
      message.chatId = existChat[0]._id
    } else {
      const newChat: any = await new ChatModel(chat);
      await newChat.save();
      message.chatId = newChat._id
    }
    await newMessage(message)
    chat.users.forEach(async (id: any) => {
      await UserModel.findByIdAndUpdate(id, {
        $addToSet: { chats: message.chatId }
      });
    });
    const Res = await ChatModel.findById(message.chatId)
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name tag" })
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
      .populate({ path: "users", select: "name tag" })
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
      .populate({ path: "users", select: "name tag" })
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
      .populate({ path: "users", select: "name tag" })
      .populate({ path: "lastMessage" });
    const user = await UserModel.findById(userId)
    let chatsUnarchive: any = []
    if (chats === null || user === null) return "Invalid Data.";
    for (let i = 0; i < user.chats.length; i++) {
      chats.forEach(el => {
        if (el._id.toString() === user.chats[i].toString()) {
          chatsUnarchive.push(el)
        }
      })
    };
    const chatsArchive: any = []
    for (let i = 0; i < user.archive_chats.length; i++) {
      for (let j = 0; j < chats.length; j++) {
        if (chats[j]._id.toString() == user.archive_chats[i].toString()) {
          chatsArchive.push(chats[j])
        }
      }
    }

    return { chatsUnarchive, chatsArchive };
  } catch (error: any) {
    throw error;
  }
};

const putArchiveChat = async (userId: string, chatId: string, action: string) => {
  try {
    if (action == "archive") {
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { chats: chatId }
      })
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { archive_chats: chatId }
      })
      return "Archive Successfully."
    }
    if (action == "unarchive") {
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { archive_chats: chatId }
      })
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { chats: chatId }
      })
      return "Unarchive Successfully."
    }
  } catch (error: any) {
    throw error;
  }
};

const deletUserChat = async (userId: string, chatId: string) => {
  try {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { chats: chatId }
    });
    let chat = await ChatModel.findById(chatId);
    if (chat === null) return "Chat not exist.";
    let deletePermanentrly = true;
    for (let i = 0; i < chat.users.length; i++) {
      const user = await UserModel.findById(chat!.users[i]);
      user?.chats.forEach(e => {
        if (e.toString() == chatId) deletePermanentrly = false;
      });
      user?.archive_chats.forEach(e => {
        if (e.toString() == chatId) deletePermanentrly = false;
      });
    }
    if (deletePermanentrly) await ChatModel.findByIdAndDelete(chatId);

    return "Delete Successfully.";
  } catch (error: any) {
    console.log(error)
    throw error;
  }
};

const deletUserArchiveChat = async (userId: string, chatId: string) => {
  console.log(userId, chatId)
  try {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { archive_chats: chatId }
    });
    let chat = await ChatModel.findById(chatId)
    if (chat === null) return "Chat not exist.";
    let deletePermanentrly = true;
    for (let i = 0; i < chat!.users.length; i++) {
      const user = await UserModel.findById(chat!.users[i])
      user?.chats.forEach(e => {
        if (e.toString() == chatId) deletePermanentrly = false;
      })
      user?.archive_chats.forEach(e => {
        if (e.toString() == chatId) deletePermanentrly = false;
      })
    }
    if (deletePermanentrly) await ChatModel.findByIdAndDelete(chatId);

    return "Delete Successfully.";
  } catch (error: any) {
    throw error;
  }
};

const getChatsUserByUsersName = async (userId: string, secUserId: string) => {
  try {
    const newUserId = new mongoose.Types.ObjectId(userId);
    const newSecUserId = new mongoose.Types.ObjectId(secUserId);
    const chats = await ChatModel.find({
      users: {
        $all: [newUserId, newSecUserId]
      }
    })
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name tag" })
      .populate({ path: "lastMessage" });
    return chats[0];
  } catch (error: any) {
    throw error;
  }
};

const getChatsUserByName = async (userId: string, userName: string, type: string) => {
  try {
    const user = await UserModel.findById(userId)
    let chats = await ChatModel.find({ users: userId })
      .populate({ path: "messagesId" })
      .populate({ path: "users", select: "name tag" })
      .populate({ path: "lastMessage" });
    if (chats === null || user === null || !type) return "Invalid Data.";
    let newChats: any = [];
    let filterArchiveChat: any = [];
    let filterUnarchiveChat: any = [];
    for (let i = 0; i < chats.length; i++) {
      chats[i].users.forEach((el: any) => {
        if (el.name.toLocaleLowerCase().includes(userName.toLocaleLowerCase()) && el._id.toString() !== userId) {
          newChats.push(chats[i])
        }
      })
    };

    if (type === "unarchive") {
      for (let i = 0; i < user.chats.length; i++) {
        newChats.forEach((el: any) => {
          if (el._id.toString() === user.chats[i].toString()) {
            filterUnarchiveChat.push(el)
          }
        })
      };
    }

    if (type === "archive") {
      for (let i = 0; i < user.archive_chats.length; i++) {
        newChats.forEach((el: any) => {
          if (el._id.toString() === user.archive_chats[i].toString()) {
            filterArchiveChat.push(el)
          }
        })
      };
    }

    return {
      filterUnarchiveChat,
      filterArchiveChat
    };
  } catch (error: any) {
    console.log(error)
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
  getChatsUserByUsersName,
  putArchiveChat,
  deletUserChat,
  deletUserArchiveChat
}