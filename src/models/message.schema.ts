import { Schema, model, Types } from "mongoose";
import { MessageInterface } from "../interfaces/message.interface";

const messageSchema = new Schema<MessageInterface>(
    {
        message: {
            type: String,
            required: true
        },
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        chatId: {
            type: Types.ObjectId,
            ref: "Chat",
            required: true
        },
        date: {
            type: Date,
        }
    },
    {
        versionKey: false,
        collection: "messages",
    }
);

const MessageModel = model("Message", messageSchema, "messages");
MessageModel.syncIndexes();
export default MessageModel;
