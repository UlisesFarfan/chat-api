// src/interfaces/chat.interface.ts

import { ObjectId } from "mongoose";

export interface ChatInterface extends Document {
    users: ObjectId[];
    messageToView: any;
    messagesId: ObjectId[];
  }
  