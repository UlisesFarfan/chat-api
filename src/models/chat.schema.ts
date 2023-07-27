import { Schema, model, Types } from "mongoose";
import { ChatInterface } from "../interfaces/chat.interface";

const chatSchema = new Schema<ChatInterface>(
  {
    users: {
      type: [Types.ObjectId],
      ref: "User",
    },
    lastMessage: {
      type: Types.ObjectId,
      ref: "Message"
    },
    messagesId: {
      type: [Types.ObjectId],
      ref: "Message",
    },
  },
  {
    versionKey: false,
    collection: "chats",
  }
);

const ChatModel = model("Chat", chatSchema, "chats");
ChatModel.syncIndexes();
export default ChatModel;