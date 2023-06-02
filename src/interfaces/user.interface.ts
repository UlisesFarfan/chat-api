// src/interfaces/user.interface.ts
import { ChatInterface } from "./chat.interface";

import { ObjectId } from "mongoose";

export interface UserInterface extends Document {
  name: string;
  contacts: ObjectId[];
  blocked: ObjectId[];
  chats: ChatInterface[];
  requests: ObjectId[];
  notifications: ObjectId[];
  description: string;
  email: string;
  hash: string;
  salt: string;
  token: ObjectId;
  delete_at: Date | null;
}
