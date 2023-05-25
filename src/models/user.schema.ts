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
        },
        chats: {
            type: [Types.ObjectId],
            ref: "Chat",
        },
        description: {
            type: String || null,
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
