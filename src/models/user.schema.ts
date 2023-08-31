import { Schema, model, Types } from "mongoose";
import { UserInterface } from "../interfaces/user.interface";

const userSchema = new Schema<UserInterface>(
    {
        name: {
            type: String,
        },
        contacts: {
            type: [Types.ObjectId],
            ref: "User",
        },
        blocked: {
            type: [Types.ObjectId],
            ref: "User",
        },
        chats: {
            type: [Types.ObjectId],
            ref: "Chat"
        },
        archive_chats: {
            type: [Types.ObjectId],
            ref: "Chat"
        },
        requests: {
            type: [Types.ObjectId],
            ref: "Request",
        },
        tag: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            default: "Hey there! I am using Chat App"
        },
        notifications: {
            type: [Types.ObjectId],
            ref: "Notification",
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
        },
        hash: {
            type: String,
        },
        delete_at: {
            type: Date || null,
            default: null,
        },
        token: {
            type: Types.ObjectId,
            ref: "Tokens",
        },
    },
    {
        versionKey: false,
        collection: "users",
    }
);

const UserModel = model("User", userSchema, "users");
UserModel.syncIndexes();
export default UserModel;
